<?php

namespace OctopusPress\Bundle\Customize\Layout;


class Table implements \JsonSerializable
{
    /**
     * @var array<string, mixed>
     */
    private array $canvas = [
        'source' => [
            'default' => '',
            'edit'    => '',
            'delete'  => '',
            'add'  => '',
        ],
        'columns'=> [],
        'actions'=> [
            'customTitle' => '',
            'add' => false,
            'edit' => false,
            'delete' => false,
            'position' => 'right',
        ],

    ];

    public function source(string $endpoint): static
    {
        $this->canvas['source']['default'] = $endpoint;
        return $this;
    }

    public function sourceCreate($endpoint): static
    {
        $this->canvas['source']['add'] = $endpoint;
        return $this;
    }

    public function sourceEdit($endpoint): static
    {
        $this->canvas['source']['edit'] = $endpoint;
        return $this;
    }

    public function sourceDelete($endpoint): static
    {
        $this->canvas['source']['delete'] = $endpoint;
        return $this;
    }

    /**
     * @param string $key
     * @param string $name
     * @param bool $isFilter
     * @param bool $isOrder
     * @param string $type
     * @return $this
     */
    public function column(string $key, string $name, bool $isFilter = false, bool $isOrder = false, string $type = 'string'): static
    {
        $this->canvas['columns'][$key] = [
            'title' => $name,
            'type'  => $type,
            'isSortable' => $isOrder,
            'isEditable' => false,
            'isAddable' => false,
            'isFilterable' => $isFilter,
        ];
        return $this;
    }

    /**
     * @param string $key
     * @param string $columnKey
     * @param mixed $value
     * @return $this
     */
    public function columnAppend(string $key, string $columnKey, mixed $value): static
    {
        $this->canvas['columns'][$key][$columnKey] = $value;
        return $this;
    }

    /**
     * @param bool $isCreate
     * @return $this
     */
    public function isCreate(bool $isCreate): static
    {
        $this->canvas['actions']['add'] = $isCreate;
        return $this;
    }

    /**
     * @param bool $isEditor
     * @return $this
     */
    public function isEditor(bool $isEditor): static
    {
        $this->canvas['actions']['edit'] = $isEditor;
        return $this;
    }

    /**
     * @param bool $isDelete
     * @return $this
     */
    public function isDelete(bool $isDelete): static
    {
        $this->canvas['actions']['delete'] = $isDelete;
        return $this;
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        // TODO: Implement build() method.
        return $this->canvas;
    }
}
