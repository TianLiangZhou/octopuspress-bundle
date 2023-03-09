<?php

namespace OctopusPress\Bundle\Scalable;

use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Scalable\Features\Block;
use OctopusPress\Bundle\Widget\AbstractWidget;
use function Symfony\Component\String\b;

final class Widget
{
    /**
     * @return array<string, AbstractWidget>
     */
    private array $registeredWidgets = [];

    /**
     * @var array<string, Block>
     */
    private array $registeredBlocks = [];

    private Bridger $bridger;


    public function __construct(Bridger $bridger)
    {
        $this->bridger = $bridger;
    }

    /**
     * @param AbstractWidget $widget
     * @return $this
     */
    public function register(AbstractWidget $widget): Widget
    {
        $this->registeredWidgets[$widget->getName()] = $widget;
        return $this;
    }

    /**
     * @return array
     */
    public function getCategories(): array
    {
        $defaults = [
            [
                'slug'  => 'text',
                'label' => 'Text',
                'icon'  => 'text-outline',
            ],
            [
                'slug'  => 'media',
                'label' => 'Media',
                'icon'  => 'film-outline',
            ],
            [
                'slug'  => 'design',
                'label' => 'Design',
                'icon'  => 'brush-outline',
            ],
            [
                'slug'  => 'widgets',
                'label' => 'Widgets',
                'icon'  => 'list-outline',
            ],
            [
                'slug'  => 'theme',
                'label' => 'Theme',
                'icon'  => 'layout-outline',
            ],
            [
                'slug'  => 'embed',
                'label' => 'Embeds',
                'icon'  => 'link-outline',
            ],
            [
                'slug'  => 'reusable',
                'label' => 'Reusable Blocks',
                'icon'  => 'repeat-outlin   e',
            ],
        ];
        return $this->bridger->getHook()->filter('block_categories_all', $defaults);
    }


    /**
     * @param class-string $className
     * @return $this
     */
    public function registerForClassName(string $className): Widget
    {
        $name = b(basename(
            str_replace('\\', '/', $className)
        ))->snake()->toString();
        return $this->register(new $className($this->bridger, $name));
    }


    /**
     * @param string $name
     * @return AbstractWidget
     */
    public function get(string $name): AbstractWidget
    {
        return $this->registeredWidgets[$name];
    }

    /**
     * @param string $name
     * @return Block
     */
    public function getBlock(string $name): Block
    {
        return $this->registeredBlocks[$name];
    }

    /**
     * @param array $args
     * @return Widget
     */
    public function registerBlock(array $args = []): Widget
    {
        if (empty($args['name'])) {
            $args['name'] = 'block-' . count($this->registeredBlocks);
        }
        $this->registeredBlocks[$args['name']] = new Block($args['name'], $args);
        return $this;
    }

    /**
     * @return AbstractWidget[]
     */
    public function getRegistered(): array
    {
        return array_values($this->registeredWidgets);
    }

    /**
     * @return Block[]
     */
    public function getRegisteredBlocks(): array
    {
        return array_values($this->registeredBlocks);
    }


    /**
     * @param string $name
     * @return bool
     */
    public function exists(string $name): bool
    {
        return isset($this->registeredWidgets[$name]);
    }

    /**
     * @param string $name
     * @return bool
     */
    public function existsBlock(string $name): bool
    {
        return isset($this->registeredBlocks[$name]);
    }
}
