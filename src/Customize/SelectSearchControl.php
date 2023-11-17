<?php

namespace OctopusPress\Bundle\Customize;

/**
 *
 */
class SelectSearchControl extends AutoCompleteControl
{
    public function __construct(string $id, array $args = [])
    {
        parent::__construct($id, $args);
        $this->setType(self::SELECT_SEARCH);
    }
}
