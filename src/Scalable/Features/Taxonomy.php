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
    private bool $showNavigation;


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
            'label' => null,
            'labels'                => [],
            'description'           => '',
            'hierarchical'          => false,
            'showUi'                => true,
            'showPostFilter'        => false,
            'showNavigation'        => true,
        ];
        $args = array_merge($defaults, $args);
        $this->label = $args['label'] ?? $this->name;
        if ($args['description']) {
            $this->description = $args['description'];
        }
        $this->hierarchical = (bool) $args['hierarchical'];
        $this->showUi      = (bool) $args['showUi'];
        $this->showPostFilter      = (bool) $args['showPostFilter'];
        $this->showNavigation = (bool) $args['showNavigation'];
        if (is_array($args['labels'])) {
            $this->labels = $args['labels'];
        }
        if ($this->showUi) {
            $this->setDefaultLabel();
        }
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

    /**
     * @return void
     */
    private function setDefaultLabel(): void
    {
        $defaultLabels = [
            'singularName' => $this->label,
            'addNewItem'=> '添加新' . $this->label,
            'editItem'  => '编辑' . $this->label,
            'nameField' => '名称',
            'slugField' => '别名',
            'descField' => '描述',
            'parentField' => '父级' . $this->label,
            'nameFieldDescription' => '这将是它在站点上显示的名字。',
            'slugFieldDescription' => '“别名”是在URL中使用的别称，它可以令URL更美观。通常使用小写，只能包含字母，数字和连字符（-）。',
            'parentFieldDescription' => '分类和标签不同，它可以有层级关系。您可以有一个“音乐”分类目录，在这个目录下可以有叫做“流行”和“古典”的子目录。',
            'descFieldDescription' => '描述默认不显示，但某些主题可能会显示。',
        ];
        foreach ($defaultLabels as $name => $value) {
            if (!isset($this->labels[$name])) {
                $this->labels[$name] = $value;
            } elseif ($this->labels[$name] === null) {
                unset($this->labels[$name]);
            }
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
