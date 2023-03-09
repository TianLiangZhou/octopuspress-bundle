<?php

namespace OctopusPress\Bundle\Customize;

class GroupControl extends Control
{
    public function __construct(string $id, array $args = [])
    {
        $args['type'] = self::GROUP;
        parent::__construct($id, $args);
    }

    /**
     * @param bool $isSort
     * @return $this
     */
    public function sort(bool $isSort = true): static
    {
        $this->setSetting('is_sort', $isSort && $this->isMultiple());
        return $this;
    }
}
