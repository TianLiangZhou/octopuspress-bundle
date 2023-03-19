<?php

namespace OctopusPress\Bundle\Util;

final class Helper
{
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
