<?php

namespace OctopusPress\Bundle\Scalable\Features;

use OctopusPress\Bundle\Scalable\TermTaxonomy;

/**
 *
 */
final class PostType implements \JsonSerializable
{
    private string $name;

    private array $supports = [];

    private array $taxonomies = [];

    private string $label = "";

    private array $labels = [];

    private array $features = [];

    private bool $showUi;

    private bool $showNavigation;

    private array $parentType = [];

    private array $children = [];

    private bool $showOnFront = true;

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
            'showOnFront'       => true,
            'showNavigation'    => true,
            'hierarchical'      => false,
            'parentType' => [],
        ];

        $args = array_merge($defaults, $args);
        $this->labels = (array) $args['labels'];
        $this->supports = (array) $args['supports'];
        $this->taxonomies = (array) $args['taxonomies'];
        $this->showUi = (bool) $args['showUi'];
        $this->parentType = (array) $args['parentType'];
        if (in_array('parent', $this->supports) && empty($this->parentType)) {
            $this->parentType[] = $this->name;
        }
        $this->showOnFront    = (bool) $args['showOnFront'];
        $this->showNavigation = (bool) $args['showNavigation'];
        if (!$this->isShowUi()) {
            $this->showOnFront = $this->showNavigation = false;
        }
        $this->label = (string) $args['label'];
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
     * Of list ['author', 'title', 'name', 'editor', 'parent', 'excerpt', 'thumbnail', 'comments', 'trackbacks']
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
     * @param string $name
     * @return bool
     */
    public function isSupports(string $name): bool
    {
        return isset($this->features[$name]);
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
            'parentType' => $this->parentType,
            'children'   => $this->children,
            'visibility' => [
                'showOnFront' => $this->showOnFront,
                'showUi' => $this->showUi,
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

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getLabel(): string
    {
        return $this->label;
    }

    /**
     * @param string $type
     * @return void
     */
    private function addChildren(string $type): void
    {
        if (!in_array($type, $this->children)) {
            $this->children[] = $type;
        }
    }

    /**
     * @param PostType[] $types
     * @return $this
     */
    public function registerChildren(array $types): PostType
    {
        if (isset($this->features['parent'])) {
            foreach ($types as $type) {
                if (in_array($type->getName(), $this->parentType)) {
                    $type->addChildren($this->getName());
                }
            }
        }
        return $this;
    }

    /**
     * @return array
     */
    public function getParentType(): array
    {
        return $this->parentType;
    }

    /**
     * @return bool
     */
    public function isShowOnFront(): bool
    {
        return $this->showOnFront;
    }
}
