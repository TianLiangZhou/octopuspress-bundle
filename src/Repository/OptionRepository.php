<?php

namespace OctopusPress\Bundle\Repository;

use OctopusPress\Bundle\Entity\Option;
use OctopusPress\Bundle\Util\Formatter;
use OctopusPress\Bundle\Util\RepositoryTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Option|null find($id, $lockMode = null, $lockVersion = null)
 * @method Option|null findOneBy(array $criteria, array $orderBy = null)
 * @method Option[]    findAll()
 */
class OptionRepository extends ServiceEntityRepository
{
    use RepositoryTrait;

    /**
     * @var array|string[]
     */
    public static array $defaultGeneralNames = [
        'site_title',
        'site_subtitle',
        'site_url',
        'site_static_url',
        'site_description',
        'site_keywords',
        'timezone',
        'lang',
        'charset',
        'search_engine',
    ];

    /**
     * @var array|string[]
     */
    public static array $defaultMediaNames = [
        'thumbnail_size_w',
        'thumbnail_size_h',
        'thumbnail_crop',
        'medium_size_w',
        'medium_size_h',
        'large_size_w',
        'large_size_h',
    ];

    /**
     * @var array|string[]
     */
    public static array $defaultEditorNames = [
        'editor_markdown_support',
        'editor_html_support',
        'editor_html_embed_support',
        'editor_html_rules',
        'editor_style_rules'
    ];

    /**
     * @var array|string[]
     */
    public static array $defaultContentNames = [
        'site_icon',
        'site_url',
        'static_mode',
        'permalink_structure',
        'default_category',
        'default_post_format',
        'posts_per_page',
        'default_comment_status',
        'comment_moderation',
        'page_comments',
        'comment_order',
        'comments_per_page',
    ];

    /**
     * @var array<string, mixed>
     */
    private array $defaultOptions = [];

    /**
     *
     */
    const DEFAULT_CACHE_KEY = 'default_options';

    /**
     * @var array
     */
    private array $caches = [];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Option::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function getDefaultOptions(): array
    {
        if (!empty($this->defaultOptions)) {
            return $this->defaultOptions;
        }
        /**
         * @var $options Option[]
         */
        $options = $this->createQueryBuilder('o')
            ->andWhere('o.autoload = :auto')
            ->setParameter('auto', 'yes')
            ->getQuery()
            ->enableResultCache(mt_rand(300, 900), self::DEFAULT_CACHE_KEY)
            ->getResult();
        foreach ($options as $option) {
            $this->defaultOptions[$option->getName()] = $option->getValue(true);
        }
        $this->caches = array_merge($this->caches, $this->defaultOptions);
        return $this->defaultOptions;
    }


    /**
     * @param Option $entity
     * @param bool $flush
     * @return void
     */
    public function add(Option $entity, bool $flush = true): void
    {
        $this->getEntityManager()->persist($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * @return string
     */
    public function theme(): string
    {
        return $this->getDefaultOptions()['theme'] ?? '';
    }

    /**
     * @return array
     */
    public function blocks(): array
    {
        return $this->value('blocks', []) ?? [];
    }

    /**
     * @return array
     */
    public function blockWidgets(): array
    {
        return $this->value('block_widgets', []) ?? [];
    }

    /**
     * @return string
     */
    public function adminEmail(): string
    {
        return $this->value('admin_email', '');
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return $this->getDefaultOptions()['site_title'] ?? '';
    }

    /**
     * @return string
     */
    public function keyword(): string
    {
        return $this->getDefaultOptions()['site_keyword'] ?? '';
    }

    public function postsPerPage(int $default = 30): int
    {
        return $this->getDefaultOptions()['posts_per_page'] ?? $default;
    }

    /**
     * @return string
     */
    public function description(): string
    {
        return $this->getDefaultOptions()['site_description'] ?? '';
    }

    /**
     * @return string
     */
    public function subtitle(): string
    {
        return $this->getDefaultOptions()['site_subtitle'] ?? '';
    }

    /**
     * @param string $theme
     * @return array
     */
    public function themeModules(string $theme): array
    {
        return $this->value('theme_mods_' . $theme, []);
    }

    /**
     * @param string $feature
     * @param string $theme
     * @return mixed
     */
    public function themeModuleFeature(string $feature, string $theme): mixed
    {
        return $this->value('theme_mods_' . $theme, [])[$feature] ?? null;
    }

    /**
     * @return string
     */
    public function siteUrl(): string
    {
        return $this->getDefaultOptions()['site_url'] ?? '';
    }

    /**
     * @return int
     */
    public function siteIcon(): int
    {
        return (int) ($this->getDefaultOptions()['site_icon'] ?? 0);
    }


    /**
     * @return bool
     */
    public function markdown(): bool
    {
        return ($this->getDefaultOptions()['editor_markdown_support'] ?? false) === true;
    }

    /**
     * @return string
     */
    public function timezone(): string
    {
        return $this->getDefaultOptions()['timezone'] ?? 'UTC';
    }

    public function maintenance(): bool
    {
        return ($this->getDefaultOptions()['maintenance'] ?? false) === true;
    }

    /**
     * @return string[]
     */
    public function activePlugins(): array
    {
        return $this->getDefaultOptions()['active_plugins'] ?? [];
    }

    /**
     * @return array
     */
    public function installedPlugins(): array
    {
        return $this->getDefaultOptions()['installed_plugins'] ?? [];
    }

    /**
     * @return array
     */
    public function installedThemes(): array
    {
        return $this->getDefaultOptions()['installed_themes'] ?? [];
    }

    /**
     * @return string
     */
    public function permalinkStructure(): string
    {
        return $this->getDefaultOptions()['permalink_structure'] ?? 'post_permalink_normal';
    }

    /**
     * @return bool
     */
    public function staticMode(): bool
    {
        return ($this->getDefaultOptions()['static_mode'] ?? false) === true;
    }

    public function thumbnail(): array
    {
        return [
            (int) ($this->getDefaultOptions()['thumbnail_size_w'] ?? 150),
            (int) ($this->getDefaultOptions()['thumbnail_size_h'] ?? 150),
            (int) ($this->getDefaultOptions()['thumbnail_crop'] ?? 1),
        ];

    }

    public function medium(): array
    {
        return [
            (int) ($this->getDefaultOptions()['medium_size_w'] ?? 300),
            (int) ($this->getDefaultOptions()['medium_size_h'] ?? 300),
        ];
    }


    public function large(): array
    {
        return [
            (int) ($this->getDefaultOptions()['large_size_w'] ?? 1024),
            (int) ($this->getDefaultOptions()['large_size_h'] ?? 1024),
        ];
    }

    /**
     * @return array
     */
    public function roles(): array
    {
        return $this->value('roles', []) ?? [];
    }

    /**
     * @return string
     */
    public function lang(): string
    {
        return $this->value('lang', 'zh_CN');
    }

    /**
     * @return string
     */
    public function searchEngine(): string
    {
        return $this->value('search_engine', 'google');
    }


    /**
     * @return string
     */
    public function charset(): string
    {
        return $this->value('charset', 'UTF-8');
    }

    /**
     * 评论审核
     *
     * @return bool
     */
    public function commentModeration(): bool
    {
        return ($this->getDefaultOptions()['comment_moderation'] ?? false) === true;
    }


    /**
     * @param string $name
     * @param mixed|null $default
     * @return mixed
     */
    public function value(string $name, mixed $default = null): mixed
    {
        if (isset($this->caches[$name])) {
            return $this->caches[$name];
        }
        $this->findOneByName($name);
        if (isset($this->caches[$name])) {
            return $this->caches[$name];
        }
        return $default;
    }



    /**
     * @param string $name
     * @return Option|null
     */
    public function findOneByName(string $name): ?Option
    {
        $option = $this->findOneBy(['name' => $name]);
        if ($option != null) {
            $this->caches[$name] = $option->getValue(true);
        }
        return $option;
    }

    /**
     * @param array $criteria
     * @param array|null $orderBy
     * @param $limit
     * @param $offset
     * @return Option[]
     */
    public function findBy(array $criteria, ?array $orderBy = null, $limit = null, $offset = null): array
    {
        /**
         * @var $options Option[]
         */
        $options = parent::findBy($criteria, $orderBy, $limit, $offset);
        foreach ($options as $option) {
            $this->caches[$option->getName()] = $option->getValue(true);
        }
        return $options;
    }

    /**
     * @param Option $entity
     * @param bool $flush
     * @return void
     */
    public function remove(Option $entity, bool $flush = true): void
    {
        $this->getEntityManager()->remove($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    private function addFilters(QueryBuilder $qb, array $filters): void
    {
        // TODO: Implement addFilters() method.
    }

    public function handleRecords(array $records): array
    {
        // TODO: Implement handleRecords() method.
        foreach ($records as &$record) {
            unset($record['autoload']);
            $value = Formatter::reverseTransform($record['value']);
            if (is_bool($value)) {
                $type = 1;
            } elseif (is_object($value)) {
                $type = 3;
            } elseif (is_array($value)) {
                $type = 2;
                if (isset($value[0]) && is_object($value[0])) {
                    $type = 4;
                }
            } elseif (is_string($value) && str_contains("\n", $value)) {
                $type = 6;
            } else {
                $type = 5;
            }
            $record['value'] = $value;
            $record['type'] = $type;
        }
        return $records;
    }
}
