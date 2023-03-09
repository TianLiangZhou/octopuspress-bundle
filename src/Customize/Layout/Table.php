<?php

namespace OctopusPress\Bundle\Customize\Layout;


class Table implements \JsonSerializable
{
    /**
     * @var array<string, mixed>
     */
    private array $canvas = [
        'source' => '',
        'columns'=> [],
        'actions'=> [
            'create' => false,
            'edit' => false,
            'delete' => false,
        ]
    ];

    public function source(string $endpoint): static
    {
        $this->canvas['source'] = $endpoint;
        return $this;
    }

    public function column(string $key, string $name, bool $isFilter = false, bool $isOrder = false, string $type = 'string'): static
    {
        $this->canvas['columns'][$key] = [
            'title' => $name,
            'type'  => $type,
            'sort'  => $isOrder,
            'filter'=> $isFilter,
        ];
        return $this;
    }

    /**
     * @param bool $isCreate
     * @return $this
     */
    public function isCreate(bool $isCreate): static
    {
        $this->canvas['action']['create'] = $isCreate;
        return $this;
    }

    /**
     * @param bool $isEditor
     * @return $this
     */
    public function isEditor(bool $isEditor): static
    {
        $this->canvas['action']['edit'] = $isEditor;
        return $this;
    }

    /**
     * @param bool $isDelete
     * @return $this
     */
    public function isDelete(bool $isDelete): static
    {
        $this->canvas['action']['delete'] = $isDelete;
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
