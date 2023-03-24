<?php

namespace OctopusPress\Bundle\Scalable\Features;

use OctopusPress\Bundle\Scalable\TermTaxonomy;
use function Symfony\Component\String\b;

final class PostType implements \JsonSerializable
{
    private string $name;

    private array $supports = [];

    private array $taxonomies = [];

    private string $label = "";

    private array $labels = [];

    private array $features = [];

    private bool $showUi;

    private bool $showTableTaxonomy;
    private bool $showNavigation;

    public function __construct(string $name, array $args)
    {
        $this->name = $name;
        $this->buildProps($args);
    }

    /**
     * @param array $args
     * @return void
     */
    private function buildProps(array $args): void
    {
        $defaults = [
            'label'  => '',
            'labels' => [
                'singularName' => '',
                'addItem' => '',
                'editItem'=> '',
            ],
            'supports' => ['title', 'editor'],
            'taxonomies' => [],
            'showUi'   => true,
            'showTableTaxonomy' => true,
            'showNavigation'    => true,
        ];

        $args = array_merge($defaults, $args);

        if (is_array($args['labels'])) {
            $this->labels = $args['labels'];
        }
        if (is_array($args['supports'])) {
            $this->supports = $args['supports'];
        }
        if (is_array($args['taxonomies'])) {
            $this->taxonomies = $args['taxonomies'];
        }
        if (is_bool($args['showUi'])) {
            $this->showUi = $args['showUi'];
        }
        if (is_bool($args['showTableTaxonomy'])) {
            $this->showTableTaxonomy = $args['showTableTaxonomy'];
        }
        $this->showNavigation = (bool) $args['showNavigation'];

        if ($args['label'] && is_string($args['label'])) {
            $this->label = $args['label'];
        }
        if ($this->isShowUi()) {
            $this->setDefaultLabel();
        }
    }

    /**
     * @param TermTaxonomy $termTaxonomy
     * @return PostType
     */
    public function registerTaxonomies(TermTaxonomy $termTaxonomy): PostType
    {
        foreach ($this->taxonomies as $taxonomy) {
            if (!$termTaxonomy->exists($taxonomy)) {
                continue;
            }
            $termTaxonomy->getTaxonomy($taxonomy)
                ->addObjectType($this->name);
        }
        return $this;
    }

    /**
     * @param string $taxonomy
     * @return $this
     */
    public function addTaxonomy(string $taxonomy): PostType
    {
        $this->taxonomies[] = $taxonomy;
        return $this;
    }

    /**
     * @return $this
     */
    public function addSupports(): PostType
    {
        foreach ($this->supports as $name => $args) {
            if (is_array($args)) {
                $this->features[$name] = $args;
            } else {
                $this->features[$args] = true;
            }
        }
        $this->supports = [];
        return $this;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        // TODO: Implement jsonSerialize() method.
        return [
            'label'  => $this->label,
            'labels' => $this->labels,
            'supports'=> array_keys($this->features),
            'visibility' => [
                'showUi' => $this->showUi,
                'showTableTaxonomy' => $this->showTableTaxonomy,
                'showNavigation' => $this->showNavigation,
            ],
        ];
    }

    /**
     * @return bool
     */
    public function isShowUi(): bool
    {
        return $this->showUi;
    }


    /**
     * @return void
     */
    private function setDefaultLabel(): void
    {
        if (empty($this->labels['singularName'])) {
            $this->labels['singularName'] = $this->label;
        }

        if (empty($this->labels['addItem'])) {
            $this->labels['addItem'] = '创建' . $this->label;
        }

        if (empty($this->labels['editItem'])) {
            $this->labels['editItem'] = '编辑' . $this->label;
        }
    }

    /**
     * @return bool
     */
    public function isShowNavigation(): bool
    {
        return $this->showNavigation;
    }
}
