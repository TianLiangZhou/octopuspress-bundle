<?php

namespace OctopusPress\Bundle\Event;

use OctopusPress\Bundle\Bridge\Bridger;
use Symfony\Contracts\EventDispatcher\Event;

class FilterEvent extends Event
{
    private Bridger $bridger;

    public function __construct(Bridger $bridger)
    {
        $this->bridger = $bridger;
    }

    /**
     * @return Bridger
     */
    public function getBridger(): Bridger
    {
        return $this->bridger;
    }
}
