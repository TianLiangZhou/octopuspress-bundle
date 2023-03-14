<?php

namespace OctopusPress\Bundle\Util;

use OctopusPress\Bundle\Plugin\PluginInterface;
use function Symfony\Component\String\u;

final class Helper
{
    /**
     * @param string $name
     * @return bool
     */
    public static function isHome(string $name): bool
    {
        return $name == 'home';
    }

    /***
     * @param string $name
     * @return bool
     */
    public static function isTag(string $name): bool
    {
        return $name == 'tag';
    }

    /**
     * @param string $name
     * @return bool
     */
    public static function isCategory(string $name): bool
    {
        return $name == 'category';
    }

    /**
     * @param string $name
     * @return bool
     */
    public static function isTaxonomy(string $name): bool
    {
        return $name == 'taxonomy';
    }

    /**
     * @param string $name
     * @return bool
     */
    public static function isAuthor(string $name): bool
    {
        return $name == 'author';
    }

    /**
     * @param string $name
     * @return bool
     */
    public static function isArchive(string $name): bool
    {
        return $name == 'archives';
    }

    /**
     * @param string $name
     * @return bool
     */
    public static function isArchives(string $name): bool
    {
        return self::isTaxonomy($name) || self::isTag($name) || self::isCategory($name) || self::isAuthor($name) || self::isArchive($name);
    }

    /**
     * @param string $name
     * @return bool
     */
    public static function isInstalled(string $name): bool
    {
        return $name == 'install';
    }

    /**
     * @param string $name
     * @return bool
     */
    public static function isSingular(string $name): bool
    {
        return in_array($name, ['post_permalink_normal', 'post_permalink_number','post_permalink_date', 'post_permalink_name', 'page']);
    }

    /**
     * @param string $name
     * @return bool
     */
    public static function isSingle(string $name): bool
    {
        return in_array($name, ['post_permalink_normal', 'post_permalink_number','post_permalink_date', 'post_permalink_name']);
    }

    /**
     * @param string $name
     * @return bool
     */
    public static function isPage(string $name): bool
    {
        return $name == 'page';
    }

    public static function is404(string $name): bool
    {
        return $name == 'error404';
    }

    /**
     * @param string $name
     * @return bool
     */
    public static function isDashboard(string $name): bool
    {
        return str_starts_with($name, 'backend_');
    }

    /**
     * @param string $name
     * @return bool
     */
    public static function isPlugin(string $name): bool
    {
        return str_starts_with($name, 'plugin_') || str_starts_with($name, 'octopus_plugin_');
    }

    /**
     * @param string $name
     * @return bool
     */
    public static function isDashboardPlugin(string $name): bool
    {
        return str_starts_with($name, 'backend_plugin_');
    }

    /**
     * @param array<int, mixed> $nodes
     * @param array<int, mixed> $children
     * @param int $parentId
     * @return array<int, mixed>
     */
    public static function treeNode(array &$nodes, array $children, int $parentId = 0): array
    {
        $child = [];
        foreach ($nodes as &$node) {
            if (isset($node['object'])) {
                if ($node['parent'] != $parentId) {
                    continue;
                }
            }
            if (isset($children[$node['id']])) {
                $node['children'] = self::treeNode($nodes, $children, $node['id']);
            }
            $child[] = $node;
        }
        return $child;
    }
}
