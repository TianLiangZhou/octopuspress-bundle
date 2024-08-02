<?php

namespace OctopusPress\Bundle\Scalable;

use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Scalable\Features\Block;
use OctopusPress\Bundle\Widget\AbstractWidget;
use function Symfony\Component\String\b;

final class Widget
{
    const TEXT = 'text';
    const MEDIA = 'media';
    const DESIGN = 'design';
    const WIDGETS = 'widgets';
    const THEME = 'theme';
    const EMBED = 'embed';
    const REUSABLE = 'reusable';

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
                'slug'  => self::TEXT,
                'label' => 'Text',
                'icon'  => 'text-outline',
            ],
            [
                'slug'  => self::MEDIA,
                'label' => 'Media',
                'icon'  => 'film-outline',
            ],
            [
                'slug'  => self::DESIGN,
                'label' => 'Design',
                'icon'  => 'brush-outline',
            ],
            [
                'slug'  => self::WIDGETS,
                'label' => 'Widgets',
                'icon'  => 'list-outline',
            ],
            [
                'slug'  => self::THEME,
                'label' => 'Theme',
                'icon'  => 'layout-outline',
            ],
            [
                'slug'  => self::EMBED,
                'label' => 'Embeds',
                'icon'  => 'link-outline',
            ],
            [
                'slug'  => self::REUSABLE,
                'label' => 'Reusable Blocks',
                'icon'  => 'repeat-outline',
            ],
        ];
        return $this->bridger->getHook()->filter('block_categories_all', $defaults);
    }


    /**
     * @param class-string $className
     * @return $this
     */
    public function registerForClassName(string $className, array $args = []): Widget
    {
        $name = b(basename(
            str_replace('\\', '/', $className)
        ))->snake()->toString();
        /**
         * @var $widget AbstractWidget
         */
        $widget = new $className($this->bridger, $name, $args);
        if (!$widget instanceof AbstractWidget) {
            return $this;
        }
        return $this->register($widget);
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
