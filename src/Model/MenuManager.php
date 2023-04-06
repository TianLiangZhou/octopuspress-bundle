<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Model;

use Symfony\Component\Routing\RouterInterface;

/**
 *
 */
final class MenuManager
{
    private RouterInterface $router;

    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    /**
     * @return array
     */
    public function registeredRoutes(): array
    {
        $routeCollection = $this->router->getRouteCollection();
        $menus = [];
        foreach ($routeCollection as $routeName => $route) {
            $options = $route->getOptions();
            if (empty($options) || empty($options['name'])) {
                continue;
            }
            $path = $route->getPath();
            $option = [
                'name' => $options['name'],
                'path' => $path,
                'route' => $routeName,
            ];
            if (!empty($options['parent'])) {
                $option['parent'] = 'backend_' . $options['parent'];
            }
            if (!empty($options['sort'])) {
                $option['sort'] = (int) $options['sort'];
            }
            if (!empty($options['link'])) {
                $option['link'] = $options['link'];
            }
            if (!empty($options['icon'])) {
                $option['icon'] = $options['icon'];
            }
            if (!empty($options['home'])) {
                $option['home'] = true;
            }
            if (isset($option['link']) && $option['link'] === '/app/plugin/feature') {
                $option['queryParams'] = ['page' => $path];
            }
            $menus[$path] = $option;
        }
        return $menus;
    }

    /**
     * @param array $menus
     * @return array
     */
    public function tree(array $menus): array
    {
        $children = [];
        foreach ($menus as $key => $menu) {
            $parent = $menu['parent'] ?? '';
            if ($parent) {
                $children[$parent][] = $key;
            }
        }
        $this->treeNode($menus, $children);
        foreach ($children as $child) {
            foreach ($child as $index) {
                unset($menus[$index]);
            }
        }
        array_multisort(array_map(function ($item) {
            return $item['sort'] ?? 0;
        }, $menus), SORT_ASC, $menus);
        return array_values($menus);
    }

    /**
     * @param array<int, mixed> $nodes
     * @param array<int, mixed> $children
     * @param string $parent
     * @return array<int, mixed>
     */
    private function treeNode(array &$nodes, array $children, string $parent = ''): array
    {
        $child = [];
        foreach ($nodes as &$node) {
            if (($node['parent']??'') != $parent) {
                continue;
            }
            if (isset($children[$node['route']])) {
                $node['children'] = self::treeNode($nodes, $children, $node['route']);
                $sorts = array_map(function ($item) {
                    return $item['sort'] ?? 0;
                }, $node['children']);
                array_multisort($sorts, SORT_ASC, $node['children']);
            }
            $child[] = $node;
        }
        return $child;
    }
}
