<?php

namespace OctopusPress\Bundle\Scalable\Features;

/**
 *
 */
final class Taxonomy implements \JsonSerializable
{
    /**
     * @var string
     */
    private string $name;

    /**
     * @var array
     */
    private array $objectType = [];

    /**
     * @var array
     */
    private array $labels = [];

    private string $label = '';

    private string $description = '';

    private bool $hierarchical;

    private bool $showUi;
    private bool $showPostFilter;


    public function __construct(string $name, array $objectType, array $args = [])
    {
        $this->name = $name;
        $this->objectType = $objectType;
        $this->buildProps($args);
    }

    /**
     * @param array $args
     * @return void
     */
    private function buildProps(array $args): void
    {
        $defaults = [
            'label' => '',
            'labels'                => [],
            'description'           => '',
            'hierarchical'          => false,
            'showUi'                => true,
            'showPostFilter'        => false,
        ];

        $args = array_merge($defaults, $args);
        if (is_array($args['labels'])) {
            $this->labels = $args['labels'];
        }
        if ($args['label']) {
            $this->label = $args['label'];
        }
        if ($args['description']) {
            $this->description = $args['description'];
        }
        $this->hierarchical = (bool) $args['hierarchical'];
        $this->showUi      = (bool) $args['showUi'];
        $this->showPostFilter      = (bool) $args['showPostFilter'];
    }

    /**
     * @param string $objectType
     * @return void
     */
    public function addObjectType(string $objectType): void
    {
        if (!in_array($objectType, $this->objectType)) {
            $this->objectType[] = $objectType;
        }
    }

    public function jsonSerialize(): array
    {
        // TODO: Implement jsonSerialize() method.
        return [
            'slug'  => $this->name,
            'label' => $this->label,
            'labels'=> $this->labels,
            'types' => $this->objectType,
            'hierarchical' => $this->hierarchical,
            'visibility' => [
                'showUi' => $this->showUi,
                'showPostFilter' => $this->showPostFilter,
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
     * @return bool
     */
    public function isHierarchical(): bool
    {
        return $this->hierarchical;
    }

    /**
     * @return array
     */
    public function getObjectType(): array
    {
        return $this->objectType;
    }
}
