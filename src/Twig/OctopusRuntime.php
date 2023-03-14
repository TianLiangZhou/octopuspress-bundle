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
use OctopusPress\Bundle\Support\Pagination;
use OctopusPress\Bundle\Util\Formatter;
use OctopusPress\Bundle\Util\Helper;
use OctopusPress\Bundle\Widget\AbstractWidget;
use OctopusPress\Bundle\Widget\Navigation;
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
        $url = $this->hook->filter('permalink.before', '', $obj, $query);
        if ($url) {
            return $url;
        }
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
        $name = $request->attributes->get('_route');
        $pathInfo = $request->getPathInfo();
        if (Helper::isHome($name) && empty($link)) {
            return true;
        }
        $linkInfo = parse_url($link);
        $idUriQueryExist = stripos($linkInfo['query'] ?? '', 'p=');
        if (Helper::isHome($name) && isset($linkInfo['path']) && $linkInfo['path'] == '/' && $idUriQueryExist === false) {
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
     * @return Navigation
     */
    public function navigation(string $location, array $options = []): Navigation
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
    public function getPosts(array $options = []): Pagination
    {
        $filter = [
            'type' => Post::TYPE_POST,
            'status' => Post::STATUS_PUBLISHED,
        ];
        if (isset($options['type'])) {
            $filter['type'] = $options['type'];
            unset($options['type']);
        }
        if (isset($options['status'])) {
            $filter['status'] = $options['status'];
            unset($options['status']);
        }
        if (isset($options['id'])) {
            $filter['id'] = is_array($options['id']) ? array_map('intval', $options['id']) : (int) $options['id'];
            unset($options['id']);
        }
        if (isset($options['author'])) {
            $filter['author'] = $options['author'];
            unset($options['author']);
        }
        $query = $this->post->createQuery($filter, function (QueryBuilder $builder) use ($options) {
            if (isset($options['sort']) && !$options['sort']) {
                $builder->resetDQLPart('orderBy');
            }
        });
        if (isset($options['limit']) && $options['limit'] > 0) {
            $records = $query->setMaxResults((int) $options['limit'])->getResult();
            [$limit, $count, $page] = [(int) $options['limit'], count($records), 1];
        } else {
            [$page, $limit] = $this->getPageLimit();
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
        $options['limit'] = $limit;
        $options['total'] = $count;
        $options['currentPage'] = $page;
        return new Pagination($records, $options);
    }

    /**
     * @param int $taxonomyId
     * @param array<string, bool|int|string> $options
     * @return Pagination
     * @throws NoResultException
     * @throws NonUniqueResultException
     */
    public function getTaxonomyPosts(int $taxonomyId, array $options = []): Pagination
    {
        $count = $this->relation->getTaxonomyObjectCount($taxonomyId);
        if (isset($options['limit']) && $options['limit'] > 0) {
            $objects = $this->relation->getTaxonomyObjectQuery($taxonomyId)
                    ->setMaxResults((int) $options['limit'])
                    ->getArrayResult();
            $ids = array_map(function ($item) {
                return $item['object_id'];
            }, $objects);
            $records = $this->post->createQuery(['id' => $ids])->setMaxResults((int) $options['limit'])->getResult();
            [$limit, $count, $page] = [(int) $options['limit'], count($records), 1];
        } else {
            [$page, $limit] = $this->getPageLimit();
            $records = [];
            if ($count > 0 && ceil($count / $limit) >= $page) {
                $objects = $this->relation->getTaxonomyObjectQuery($taxonomyId)
                    ->setFirstResult($page * $limit - $limit)
                    ->setMaxResults($limit)
                    ->getArrayResult();
                $ids = array_map(function ($item) {
                    return $item['object_id'];
                }, $objects);
                $records = $this->post->createQuery(['id' => $ids])->getResult();
            }
        }
        if ($records) {
            $this->post->thumbnails($records);
        }
        $options['limit'] = $limit;
        $options['total'] = $count;
        $options['currentPage'] = $page;
        return new Pagination($records, $options);
    }

    /**
     * @return int[]
     */
    private function getPageLimit(): array
    {
        return [
            max((int) $this->getRequest()->get('page', 1), 1),
            $this->option->postsPerPage(),
        ];
    }

    /**
     * @return Request
     */
    private function getRequest(): Request
    {
        return $this->bridger->getRequest();
    }
}
