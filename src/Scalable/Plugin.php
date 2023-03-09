<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Scalable;

use OctopusPress\Bundle\Bridge\Bridger;
use Symfony\Component\Config\Loader\LoaderInterface;
use Symfony\Component\Routing\RouterInterface;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Loader\FilesystemLoader;

final class Plugin
{
    /**
     * @var array<string, array<string, mixed>>
     */
    private array $dashboardWidgets = [];

    private LoaderInterface $loader;
    private Bridger $bridger;

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
        $pluginCollection = $this->loader->load(is_object($class) ? get_class($class) : $class, 'attribute');
        if ($pluginCollection->count() < 1) {
            return $this;
        }
        $collection = $this->bridger->getRouter()->getRouteCollection();
        $collection->addCollection($pluginCollection);
        return $this;
    }
}
