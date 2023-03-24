<?php

namespace OctopusPress\Bundle\Twig;

use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Tools\Pagination\Paginator;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Repository\PostRepository;
use OctopusPress\Bundle\Repository\RelationRepository;
use OctopusPress\Bundle\Repository\TaxonomyRepository;
use OctopusPress\Bundle\Repository\UserRepository;
use OctopusPress\Bundle\Scalable\Hook;
use OctopusPress\Bundle\Support\ActivatedRoute;
use OctopusPress\Bundle\Util\Formatter;
use OctopusPress\Bundle\Widget\AbstractWidget;
use OctopusPress\Bundle\Widget\Navigation;
use OctopusPress\Bundle\Widget\Pagination;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;
use Twig\Extension\RuntimeExtensionInterface;

class OctopusRuntime implements RuntimeExtensionInterface
{
    private Bridger $bridger;
    private OptionRepository $option;
    private PostRepository $post;
    private RelationRepository $relation;
    private TaxonomyRepository $taxonomy;
    private Hook $hook;
    private RouterInterface $router;
    private array $assetsUrl;
    private UserRepository $user;
    private ActivatedRoute $activatedRoute;

    public function __construct(Bridger $bridger)
    {
        $this->bridger = $bridger;
        $this->hook = $this->bridger->getHook();
        $this->option   = $this->bridger->get(OptionRepository::class);
        $this->post     = $this->bridger->get(PostRepository::class);
        $this->relation = $this->bridger->get(RelationRepository::class);
        $this->taxonomy = $this->bridger->get(TaxonomyRepository::class);
        $this->user     = $this->bridger->get(UserRepository::class);
        $this->router   = $this->bridger->getRouter();
        $this->activatedRoute = $this->bridger->getActivatedRoute();
        $this->assetsUrl = $this->bridger->getAssetsUrl();
    }

    /**
     * @param string $name
     * @param mixed $value
     * @param mixed $args
     * @return mixed
     */
    public function filter(mixed $value, string $name, mixed ...$args): mixed
    {
        return $this->hook->filter($name, $value, ...$args);
    }

    /**
     * @param string $name
     * @param mixed $value
     * @param mixed $args
     * @return mixed
     */
    public function hookFilter(string $name, mixed $value = null, mixed ...$args): mixed
    {
        return $this->hook->filter($name, $value, ...$args);
    }

    /**
     * @param mixed $args
     * @param string $name
     * @return void
     */
    public function action(string $name, mixed ...$args): void
    {
        $this->hook->action($name, ...$args);
    }

    /**
     * @param string $name
     * @return bool
     */
    public function exist(string $name): bool
    {
        return $this->option->findOneBy(['name' => $name]) != null;
    }

    /**
     * @param string $name
     * @param mixed|null $default
     * @return mixed
     */
    public function getOption(string $name, mixed $default = null): mixed
    {
        return $this->option->value($name, $default);
    }

    /**
     * @param object|null $obj
     * @param array<string, mixed> $query
     * @return string
     */
    public function permalink(?object $obj, array $query = []): string
    {
        if (empty($obj)) {
            return '';
        }
        $url = '';
        if ($obj instanceof Post) {
            if ($obj->getType() == Post::TYPE_ATTACHMENT) {
            }
            if ($obj->getType() == Post::TYPE_NAVIGATION && ($itemType = $obj->getMeta('_menu_item_type'))) {
                switch ($itemType->getMetaValue()) {
                    case 'custom':
                        return $obj->getMeta('_menu_item_url')?->getMetaValue() ?? '';
                    case 'post_type':
                        return $this->permalink($this->post->find((int) $obj->getMeta('_menu_item_object_id')?->getMetaValue()));
                    case 'taxonomy':
                        return $this->permalink($this->taxonomy->find((int) $obj->getMeta('_menu_item_object_id')?->getMetaValue()));
                }
            }
            $permalinkType = $this->option->permalinkStructure();
            $args = [];
            switch ($permalinkType) {
                case 'post_permalink_date':
                    [$year, $month] = explode('|', $obj->getModifiedAt()->format('Y|m'));
                    $args['year'] = $year;
                    $args['month'] = $month;
                    $args['name'] = $obj->getName();
                    break;
                case 'post_permalink_number':
                    if ($obj->getType() == 'page') {
                        $permalinkType = 'page';
                    }
                    $args['id'] = $obj->getId();
                    break;
                case 'post_permalink_name':
                    $args['name'] = $obj->getName();
                    break;
                case 'post_permalink_normal':
                default:
                    $permalinkType = 'home';
                    $args['p'] = $obj->getId();
            }
            $url = $this->router->generate($permalinkType, $args);
        }
        if ($obj instanceof TermTaxonomy) {
            $url = $this->router->generate('taxonomy', [
                'taxonomy' => $obj->getTaxonomy(),
                'slug' => $obj->getSlug()
            ]);
        } elseif ($obj instanceof User) {
            $url = $this->router->generate('author', [
                'slug' => $obj->getAccount(),
            ]);
        }

        if ($url && $query) {
            $url .= (!str_contains($url, '?') ? '?' : '&') . http_build_query($query);
        }
        return $this->hook->filter('permalink.after', $url, $obj, $query);
    }

    /**
     * @param string $link
     * @return bool
     */
    public function compareUrl(string $link): bool
    {
        $request = $this->getRequest();
        $pathInfo = $request->getPathInfo();
        if ($this->activatedRoute->isHome() && empty($link)) {
            return true;
        }
        $linkInfo = parse_url($link);
        $idUriQueryExist = stripos($linkInfo['query'] ?? '', 'p=');
        if ($this->activatedRoute->isHome() && isset($linkInfo['path']) && $linkInfo['path'] == '/' && $idUriQueryExist === false) {
            return true;
        }

        $uri = $request->getRequestUri();
        if ($uri == $link) {
            return true;
        }
        if (isset($linkInfo['path']) && $pathInfo == $linkInfo['path']) {
            $idQueryExist = $request->query->has('p');
            if (($idQueryExist && $idUriQueryExist === false) || (!$idQueryExist && $idUriQueryExist !== false)) {
                return false;
            }
            if (!$idQueryExist && $idUriQueryExist === false) {
                return true;
            }
            if ($idQueryExist && $idUriQueryExist !== false) {
                $p = $request->query->getInt('p');
                return stripos($linkInfo['query'] ?? '', 'p=' . $p) !== false;
            }
        }
        return false;
    }

    /**
     * @param string ...$name
     * @return array<string, mixed>
     */
    public function getOptions(string ...$name): array
    {
        $options = $this->option->findBy(['name' => $name,]);
        $items = [];
        foreach ($options as $option) {
            $items[$option->getName()] = Formatter::reverseTransform($option->getValue() ?? '');
        }
        foreach ($name as $k) {
            if (!isset($items[$k])) {
                $items[$k] = null;
            }
        }
        return $items;
    }

    /**
     * @param string $feature
     * @param mixed|null $default
     * @param string $theme
     * @return mixed|null
     */
    public function getThemeMod(string $feature, mixed $default = null, string $theme = ''): mixed
    {
        if (empty($theme)) {
            $theme = $this->option->theme();
        }
        $themeModules = $this->option->themeModules($theme);
        return $themeModules[$feature] ?? $default;
    }

    /**
     * @param int $attachmentId
     * @return array|null
     */
    public function attachment(int $attachmentId): ?array
    {
        if ($attachmentId < 1) {
            return null;
        }
        $attachment = $this->post->findOneBy(['id' => $attachmentId, 'type' => Post::TYPE_ATTACHMENT]);
        if ($attachment == null) {
            return null;
        }
        return $attachment->getAttachment($this->bridger->getAssetsUrl());
    }

    /**
     * @param array $attachments
     * @param string $filterKey
     * @return ?array
     */
    public function attachments(array $attachments, string $filterKey = ''): ?array
    {
        $formerColumn = [];
        if (!empty($filterKey)) {
            $ids = array_map(function ($item) use ($filterKey) {
                if (is_array($item[$filterKey])) {
                    return (int) $item[$filterKey][0];
                }
                return (int) $item[$filterKey];
            }, $attachments);
            $formerColumn = array_column($attachments, null, $filterKey);
        } else {
            $ids = array_map(function ($item) {
                return (int) $item;
            }, $attachments);
        }
        if ($ids < 1) {
            return null;
        }
        $attachments = $this->post->findBy(['id' => $ids, 'type' => Post::TYPE_ATTACHMENT]);
        if (count($attachments) < 1) {
            return null;
        }
        $medias = [];
        foreach ($attachments as $attachment) {
            $attachmentLite = $attachment->getAttachment($this->bridger->getAssetsUrl());
            if (isset($formerColumn[$attachmentLite['id']])) {
                $attachmentLite = array_merge($attachmentLite, $formerColumn[$attachmentLite['id']]);
            }
            $medias[] = $attachmentLite;
        }
        return $medias;
    }


    /**
     * @param string $location
     * @param array<string, bool|int|string> $options
     * @return Navigation|null
     */
    public function navigation(string $location, array $options = []): ?Navigation
    {
        $options['location'] = $location;
        return $this->widget('navigation', $options);
    }

    public function getUsers(array $idSets)
    {
        $ids = array_filter($idSets, function ($id) {
           return is_numeric($id) && $id > 0;
        });
        if (empty($ids)) {
            return null;
        }
        return $this->user->findBy([
            'id' => $ids,
        ]);
    }

    public function getUser(int $id)
    {
        return $this->user->find($id);
    }

    /**
     * @param string $name
     * @param array $options
     * @return TermTaxonomy[]
     */
    public function taxonomies(string $name, array $options = []): array
    {
        return $this->taxonomy->taxonomies($name, $options, $options['limit'] ?? null);
    }

    /**
     * @param int $id
     * @return TermTaxonomy|null
     */
    public function taxonomy(int $id): ?TermTaxonomy
    {
        return $this->taxonomy->find($id);
    }

    /**
     * @param string $name
     * @param array $attributes
     * @return AbstractWidget|null
     */
    public function widget(string $name, array $attributes = []): ?AbstractWidget
    {
        if (!$this->bridger->getWidget()->exists($name)) {
            return null;
        }
        return $this->bridger->getWidget()->get($name)->put($attributes);
    }


    /**
     * @param string $name
     * @return string|null
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function sidebar(string $name): ?string
    {
        $widgetSupport = $this->bridger->getWidget();
        if (!$widgetSupport->existsBlock($name)) {
            return null;
        }
        $blocks = $this->option->blocks();
        if (empty($blocks[$name])) {
            return null;
        }
        $widgets = $this->option->blockWidgets();
        $container = '';
        foreach ($blocks[$name] as $blockId) {
            if (!isset($widgets[$blockId])) {
                continue;
            }
            $data = $widgets[$blockId];
            if (empty($data['name']) || !$widgetSupport->exists($data['name'])) {
                continue;
            }
            $widget = $widgetSupport->get($data['name']);
            $widget->put($data['attributes'] ?? []);
            $container .= "<div id='{$data['id']}' class='widget widget-block widget-{$data['name']}'>" . $widget->render() . "</div>";
        }
        return $container;
    }

    public function getPost(int $id)
    {
        $post = $this->post->find($id);
        if ($post == null) {
            return null;
        }
        $this->post->thumbnails([$post]);
        return $post;
    }

    /**
     * @param array<string, bool|int|string> $options
     * @return Pagination
     */
    public function getPosts(array $options = []): iterable
    {
        $filters = [
            'type' => Post::TYPE_POST,
//            'status' => Post::STATUS_PUBLISHED,
        ];
        $filters = array_merge($filters, $options);
        if (!isset($filters['_sort'])) {
            $filters['_sort'] = 'id';
            $filters['_order']= 1;
        }
        $query = $this->post->createQuery($filters);
        if (isset($options['limit']) && $options['limit'] > 0) {
            $records = $query->setMaxResults((int) $options['limit'])->getResult();
            [$limit, $count, $page] = [(int) $options['limit'], count($records), 1];
        } else {
            $page = max(1, (int) $this->getRequest()->get('paged', 1));
            $limit = $this->option->postsPerPage();
            $pagination = new Paginator($query);
            $count = $pagination->count();
            $records = [];
            if ($count > 0 && ceil($count / $limit) >= $page) {
                $records = $pagination->getQuery()
                    ->setFirstResult($page * $limit - $limit)
                    ->setMaxResults($limit)
                    ->getResult();
            }
        }
        if ($records) {
            $this->post->thumbnails($records);
        }
        $this->widget('pagination', [
            'limit' => $limit,
            'total' => $count,
            'currentPage' => $page,
            'currentCount'=> count($records),
        ]);
        return $records;
    }

    /**
     * @param int|array $taxonomyId
     * @param array<string, bool|int|string> $options
     * @return Pagination
     * @throws NoResultException
     * @throws NonUniqueResultException
     */
    public function getTaxonomyPosts(int|array $taxonomyId, array $options = []): iterable
    {
        if (empty($taxonomyId)) {
            return [];
        }
        $count = $this->relation->getTaxonomyObjectCount($taxonomyId);
        $page = max(1, (int) $this->getRequest()->get('paged', 1));
        $limit = isset($options['limit']) && $options['limit'] > 0
            ? (int) $options['limit']
            : $this->option->postsPerPage();
        $records = [];
        $filters = [
            'id' => [],
        ];
        if ($count > 0 && ceil($count / $limit) >= $page) {
            $objects = $this->relation->getTaxonomyObjectQuery($taxonomyId)
                ->setFirstResult($page * $limit - $limit)
                ->setMaxResults($limit)
                ->getArrayResult();
            $filters['id'] = array_map(function ($item) {
                return $item['object_id'];
            }, $objects);
            $filters = array_merge($filters, $options);
            if (!isset($filters['_sort'])) {
                $filters['_sort'] = 'id';
                $filters['_order']= 1;
            }
            $records = $this->post->createQuery($filters)->getResult();
        }
        if ($records) {
            $this->post->thumbnails($records);
        }
        $this->widget('pagination', [
            'limit' => $limit,
            'total' => $count,
            'currentPage' => $page,
            'currentCount'=> count($records),
        ]);
        return $records;
    }

    /**
     * @return Request
     */
    private function getRequest(): Request
    {
        return $this->bridger->getRequest();
    }
}
