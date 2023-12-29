<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Scalable;

use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Controller\Admin\AdminController;
use OctopusPress\Bundle\Controller\Admin\PluginController;
use Symfony\Component\Config\Loader\LoaderInterface;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;
use Twig\Error\LoaderError;
use Twig\Loader\FilesystemLoader;
use function Symfony\Component\String\u;

final class Plugin
{
    /**
     * @var array<string, array<string, mixed>>
     */
    private array $dashboardWidgets = [];

    private array $settingPages = [];

    private array $customMenus = [];

    private LoaderInterface $loader;

    private Bridger $bridger;

    /**
     * @var array
     */
    private array $routes = [];

    /**
     * @var RouteCollection[]
     */
    private array $routeCollections = [];


    public function __construct(Bridger $bridger, LoaderInterface $loader)
    {
        $this->loader = $loader;
        $this->bridger = $bridger;
    }

    /**
     * @param string $title
     * @param string $type widget type option value is status, list, total, curve， circle，
     * @param array $args
     * @return void
     */
    public function registerDashboardWidget(string $title, string $type, array $args = []): void
    {
        $values = [];
        $arguments = [
            'type' => $type,
            'class' => $args['class'] ?? 'col-12',
            'title' => $title,
        ];
        switch ($type) {
            case 'status':
                $results = $args['body'] ?? [];
                foreach ($results as $key => $value) {
                    if (!is_array($value)) {
                        continue;
                    }
                    $values[] = array_merge(
                        [
                            'id' => $type . '_' . ($key + 1),
                            'title' => null,
                            'icon' => null,
                            'primaryColor' => null,
                            'value' => null,
                            'sanitizeCallback' => null,
                            'saveCallback' => null,
                            'type' => 'option',
                        ],
                        $value,
                    );
                }
                break;
            case 'number':
            case 'pie':
            case 'pie-chart':
            case 'pie-grid':
            case 'bar-vertical':
            case 'bar-horizontal':
            case 'line':
            case 'area':
                $results = $args['body'] ?? [];
                $arguments['settings'] = array_merge([
                    'animations' => true,
                    'legend' => true,
                    'labels' => true,
                    'yAxis' => true,
                    'xAxis' => true,
                ], $args['settings'] ?? $args);
                $view = $arguments['settings']['view'] ?? null;
                if (isset($view) && (!is_array($view) || count($view) != 2 || !is_numeric($view[0]) || !is_numeric($view[1]))) {
                    unset($arguments['settings']['view']);
                }
                foreach ($results as $value) {
                    if (!is_array($value)) {
                        continue;
                    }
                    $values[] = array_merge(['name' => '', 'value' => 0, 'series' => []], $value);
                }
                break;
        }
        $arguments['body'] = $values;
        $this->dashboardWidgets[] = $arguments;
    }

    /**
     * @return array<int, mixed>
     */
    public function getDashboardWidgets(): array
    {
        return $this->dashboardWidgets;
    }

    /**
     * @param string $dir
     * @param string $pluginName
     * @return $this
     * @throws LoaderError
     */
    public function registerTemplatePath(string $dir, string $pluginName): Plugin
    {
        if (!file_exists($dir)) {
            return $this;
        }
        $loader = $this->bridger->getTwig()->getLoader();
        if (!$loader instanceof FilesystemLoader) {
            return $this;
        }
        $loader->addPath($dir, $pluginName);
        return $this;
    }

    /**
     * @param string|object $class
     * @return Plugin
     * @throws \Exception
     */
    public function registerRoute(string|object $class): Plugin
    {
        /**
         * @var $pluginCollection RouteCollection
         */
        $pluginCollection = $this->loader->load(is_object($class) ? get_class($class) : $class, 'attribute');
        if ($pluginCollection->count() < 1) {
            return $this;
        }
        if ((is_string($class) && $this->bridger->get($class) instanceof AdminController) || $class instanceof AdminController) {
            $pluginCollection->addNamePrefix("backend_");
            $pluginCollection->addPrefix("backend");
        }
        $this->routeCollections[] = $pluginCollection;
        return $this;
    }

    /**
     * @param string $path
     * @param string $controllerAction
     * @param string $name
     * @param int $priority
     * @return Route
     */
    public function addRoute(string $path, string $controllerAction, string $name = "",  int $priority = 0): Route
    {
        $name = $name ?: u($path)->snake()->lower()->toString();
        $route = new Route($path, ['_controller' => $controllerAction]);
        $this->routes[] = [$name, $route, $priority];
        return $route;
    }

    /**
     * 添加一些自定义的一，二级菜章
     *
     * @return $this
     */
    public function addMenu(string $path, string $link, array $args = []): Plugin
    {
        $path = '/backend/menu/extra' . $path;
        $args['link'] = $link;
        $this->customMenus[$path] = array_merge([
            'path' => $path,
            'route' => trim(str_replace('/', '_', $path), '_'),
            'sort' => 10,
            'name' => $path,
            'parent' => '',
            'link' => '',
            'icon' => '',
        ], $args);
        return $this;
    }

    /**
     * @param string $type
     * @param string $name
     * @param array $args
     * @return Plugin
     */
    public function addTypeMenu(string $type, string $name, array $args = []): Plugin
    {
        $args['name'] = $name;
        return $this->addMenu('/' . $type, '/app/content/' . $type, $args);
    }

    /**
     * @param string $taxonomy
     * @param string $name
     * @param array $args
     * @return Plugin
     */
    public function addTaxonomyMenu(string $taxonomy, string $name, array $args = []): Plugin
    {
        $args['name'] = $name;
        return $this->addMenu('/' . $taxonomy, '/app/taxonomy/' . $taxonomy, $args);
    }

    /**
     * @param string $path
     * @param callable $callable
     * @param string $tabName
     * @param string $pluginName
     * @return $this
     */
    public function registerSetting(string $path, callable $callable, string $tabName, string $pluginName = ''): Plugin
    {
        $this->addRoute('/backend' . $path, PluginController::class . '::settingProxy', '');
        $this->bridger->getHook()->add('/backend' . $path, $callable);
        $this->settingPages[] = ['path' => $path, 'name' => $tabName, 'plugin' => $pluginName,];
        return $this;
    }



    /**
     * @return array
     */
    public function getSettingPages(): array
    {
        return $this->settingPages;
    }

    /**
     * @return array
     */
    public function getCustomMenus(): array
    {
        return $this->customMenus;
    }

    /**
     * @return array
     */
    public function getRoutes(): array
    {
        return $this->routes;
    }

    /**
     * @return RouteCollection[]
     */
    public function getRouteCollections(): array
    {
        return $this->routeCollections;
    }
}
