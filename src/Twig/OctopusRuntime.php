<?php

namespace OctopusPress\Bundle\Twig;

use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\Query;
use Doctrine\ORM\Tools\Pagination\Paginator;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Plugin\PluginProviderInterface;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Repository\PostRepository;
use OctopusPress\Bundle\Repository\RelationRepository;
use OctopusPress\Bundle\Repository\TaxonomyRepository;
use OctopusPress\Bundle\Repository\UserRepository;
use OctopusPress\Bundle\Scalable\Hook;
use OctopusPress\Bundle\Support\ActivatedPlugin;
use OctopusPress\Bundle\Support\ActivatedRoute;
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
    private UserRepository $user;
    private ActivatedRoute $activatedRoute;
    private ActivatedPlugin $activatedPlugin;

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
        $this->activatedPlugin = $this->bridger->get(ActivatedPlugin::class);
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
     * @return bool
     */
    public function isThemeSupport(string $name): bool
    {
        return $this->bridger->getTheme()->isThemeSupport($name);
    }

    /**
     * @param string $name
     * @return bool
     */
    public function isPluginActivated(string $name): bool
    {
        return $this->activatedPlugin->has($name);
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
     * @param object $obj
     * @param array<string, mixed> $query
     * @return string
     */
    public function permalink(object $obj, array $query = []): string
    {
        $url = '';
        if ($obj instanceof Post) {
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
                    $args['id'] = $obj->getId();
                    break;
                case 'post_permalink_name':
                    $args['name'] = $obj->getName();
                    break;
                case 'post_permalink_type':
                    if ($obj->getType() === Post::TYPE_PAGE) {
                        $permalinkType = 'post_permalink_name';
                    } else {
                        $permalinkType = 'post_permalink_type_' . $obj->getType();
                    }
                    $args['name'] = $obj->getName();
                    break;
                case 'post_permalink_normal':
                default:
                    $permalinkType = 'home';
                    $args['p'] = $obj->getId();
            }
            $url = $this->router->generate($permalinkType, $args);
            if ($permalinkType != 'post_permalink_normal' && $this->option->staticMode()) {
                $url .= '.html';
            }
            $url = $this->hookFilter('post_type_link', $url, $obj);
        } elseif ($obj instanceof TermTaxonomy) {
            $taxonomy = $obj->getTaxonomy();
            $name = $taxonomy;
            if ($taxonomy != TermTaxonomy::TAG && $taxonomy != TermTaxonomy::CATEGORY) {
                $name = 'taxonomy_' . $taxonomy;
            }
            $url = $this->router->generate($name, ['slug' => $obj->getSlug()]);
            if ($this->option->staticMode()) {
                $url .= '.html';
            }
            $url = $this->hookFilter('taxonomy_link', $url, $obj);
        } elseif ($obj instanceof User) {
            $url = $this->router->generate('author', [
                'slug' => $obj->getAccount(),
            ]);
            if ($this->option->staticMode()) {
                $url .= '.html';
            }
            $url = $this->hookFilter('author_link', $url, $obj);
        } elseif(isset($obj->url) || isset($obj->route)) {
            if (isset($obj->url)) {
                $url = $obj->url;
            }
            if (isset($obj->route)) {
                $url = $this->router->generate($obj->route, $obh->params ?? []);
            }
        } else {
            // todo
            $url = $this->hookFilter('unknown_link', $url, $obj);
        }
        if ($url && $query) {
            $url .= (!str_contains($url, '?') ? '?' : '&') . http_build_query($query);
        }
        return $this->hook->filter('permalink', $url, $obj, $query);
    }

    /**
     * @param string $link
     * @return bool
     */
    public function compareUrl(string $link): bool
    {
        $request = $this->getRequest();
        $pathInfo = $request->getPathInfo();
        if ($this->activatedRoute->isHome() && (empty($link) || $link == '/')) {
            return true;
        }
        if ($this->activatedRoute->isSingular() && $this->option->permalinkStructure() === 'post_permalink_normal') {
            $p = $this->bridger->getRequestStack()
                ->getMainRequest()
                ->query
                ->getInt('p');
            return str_contains($link, 'p=' . $p);
        }
        if ($this->option->staticMode() && ($this->activatedRoute->isArchives() || $this->activatedRoute->isSingular())) {
            $pathInfo .= '.html';
        }
        return $this->hook->filter('compare_url', explode('?', $link)[0] == $pathInfo, $link, $pathInfo);
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
            $items[$option->getName()] = $option->getValue();
        }
        foreach ($name as $k) {
            if (!isset($items[$k])) {
                $items[$k] = null;
            }
        }
        return $items;
    }

    /**
     * @param array $options
     * @return string
     */
    public function customLogo(array $options = []): string
    {
        if (!$this->isThemeSupport('custom_logo')) {
            return '';
        }
        $customLogoArgs = $this->bridger->getTheme()->getThemeSupport('custom_logo');
        $customLogoArgs = array_merge($customLogoArgs, $options);

        $imageId = (int) $this->getThemeMod('custom_logo', 0);
        if ($imageId < 1) {
            return '';
        }
        $post = $this->bridger->getPostRepository()->find($imageId);
        if ($post == null) {
            return '';
        }
        return $this->thumbnail($post, '', '', $customLogoArgs['alt'] ?? 'logo', $customLogoArgs);
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
     * @param string $name
     * @return PluginProviderInterface|null
     */
    public function getPlugin(string $name): ?PluginProviderInterface
    {
        return $this->activatedPlugin->get($name)?->getProvider($this->bridger);
    }

    /**
     * @param Post $post
     * @param string $class
     * @param string $size
     * @param string|null $alt
     * @param array $args
     * @return string
     */
    public function thumbnail(Post $post, string $class = '', string $size = '', ?string $alt = null, array $args = []): string
    {
        $type = $post->getType();
        if ($type !== Post::TYPE_ATTACHMENT) {
            $post = $post->getThumbnail();
            if ($post == null) {
                return '';
            }
        }
        $attachment = $post->getAttachment();
        $url = $attachment['url'];
        $width = $args['width'] ?? $attachment['meta']['width'];
        $height = $args['height'] ?? $attachment['meta']['height'];
        if ($size) {
            $sizeArray = $attachment['meta']['sizes'][$size] ?? [];
            if (isset($sizeArray['file'])) {
                $url = $sizeArray['file'];
            }
            $width = $args['width'] ?? $sizeArray['width'];
            $height = $args['height'] ?? $sizeArray['height'];
        }
        return sprintf(
            '<img src="%s" alt="%s" class="%s" width="%d" height="%d" />',
            $this->bridger->getPackages()->getUrl($url),
            $alt ?? $post->getTitle(),
            $class,
            $width,
            $height,
        );
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
        $attr = $attachment->getAttachment();
        $attr['url'] = $this->bridger->getPackages()->getUrl($attr['url']);
        return $attr;
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
            $attachmentLite = $attachment->getAttachment();
            $attachmentLite['url'] = $this->bridger->getPackages()->getUrl($attachmentLite['url']);
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

    /**
     * @param array $idSets
     * @return User[]
     */
    public function getUsers(array $idSets): array
    {
        $ids = array_filter($idSets, function ($id) {
           return is_numeric($id) && $id > 0;
        });
        if (empty($ids)) {
            return [];
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
     * @param array $options
     * @return string|null
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function sidebar(string $name, array $options = []): ?string
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
        $container = sprintf('<div class="sidebar-block sidebar-%s %s">', $name, $options['class'] ?? '');
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
            if (!empty($data['children'])) {
                $widget->setChildren($data['children']);
            }
            $container .= "<div id='{$data['id']}' class='widget widget-block widget-{$data['name']}'>" . $widget->render() . "</div>";
        }
        $container .= '</div>';
        return $container;
    }

    /**
     * @param int $id
     * @return Post|null
     */
    public function getPost(int $id): ?Post
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
     * @return iterable
     */
    public function getPosts(array $options = []): iterable
    {
        $filters = array_merge([
            'type' => Post::TYPE_POST,
            'status' => Post::STATUS_PUBLISHED,
        ], $options);
        if (!isset($filters['_sort']) && empty($filters['id'])) {
            $filters['_sort'] = 'id';
            $filters['_order']= 'DESC';
        }
        $query = $this->post->createQuery($filters);
        $query->setHint(Query::HINT_READ_ONLY, true);
        if (!empty($filters['id']) && is_array($filters['id'])) {
            $records = $query->getResult();
            [$limit, $count, $page] = [count($filters['id']), count($records), 1];
        } else {
            $pagination = new Paginator($query);
            $count = $pagination->count();
            $page = max(1, (int) $this->getRequest()->get('paged', 1));
            $limit = $this->option->postsPerPage();
            if (($page * $limit - $limit) > $count) {
                return [];
            }
            $records = $pagination->getQuery()
                ->setFirstResult($page * $limit - $limit)
                ->setMaxResults($limit)
                ->getResult();
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
     * @param array<string, mixed> $options
     * @return iterable
     * @throws NonUniqueResultException
     */
    public function getTaxonomyPosts(int|array $taxonomyId, array $options = []): iterable
    {
        if (empty($taxonomyId)) {
            return [];
        }
        $queryBuilder = $this->relation->createQueryBuilder('r');
        $queryBuilder->select('COUNT(r.post) as cnt');
        $taxonomies = is_array($taxonomyId) ? array_map('intval', $taxonomyId) : [$taxonomyId];
        $queryBuilder->andWhere('r.taxonomy IN (:taxonomyId)')
            ->setParameter('taxonomyId', $taxonomies);
        if (empty($options['type'])) {
            $options['type'] = Post::TYPE_POST;
        }
        if (empty($options['status'])) {
            $options['status'] = Post::STATUS_PUBLISHED;
        }
        is_array($options['type'])
            ? $queryBuilder->andWhere('r.type IN (:type)')
            : $queryBuilder->andWhere('r.type = :type');
        $queryBuilder->setParameter('type', $options['type']);
        is_array($options['status'])
            ? $queryBuilder->andWhere('r.status IN (:status)')
            : $queryBuilder->andWhere('r.status = :status');
        $queryBuilder->setParameter('status', $options['status']);
        $count = $queryBuilder->getQuery()->getOneOrNullResult()['cnt'] ?? 0;
        if ($count < 1) {
            return [];
        }
        $page = max(1, (int) $this->getRequest()->get('paged', 1));
        $limit = (int) ($options['limit'] ?? $this->option->postsPerPage());
        if (($page * $limit - $limit) > $count) {
            return [];
        }
        $queryBuilder->select('(r.post) as object_id')
            ->addOrderBy('r.createdAt', 'DESC');
        $records = $queryBuilder->getQuery()
            ->setFirstResult($page * $limit - $limit)
            ->setMaxResults($limit)
            ->getArrayResult();
        if (empty($records)) {
            return [];
        }
        $objectIds = array_map(function ($item) {return (int)$item['object_id'];}, $records);
        $records = $this->post->createThumbnailQuery(array_merge([
            'id' => $objectIds,
            '_sort' => 'createdAt',
            '_order'=> 'DESC',
        ], $options));
        $currentPageCount = count($records);
        if ($currentPageCount < $limit) {
            $pageCount = ceil($count / $limit);
            $count = $count - (($pageCount - $page) * $limit);
        }
        $this->widget('pagination', [
            'limit' => $limit,
            'total' => $count,
            'currentPage' => $page,
            'currentCount'=> $currentPageCount,
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
