<?php

namespace OctopusPress\Bundle\Event;

class PostStatusUpdateEvent extends OctopusEvent
{
    /**
     * @var int[]
     */
    private array $ids;

    public function __construct(array $ids)
    {
        $this->ids = $ids;
    }

    /**
     * @return array
     */
    public function getIds(): array
    {
        return $this->ids;
    }

}
