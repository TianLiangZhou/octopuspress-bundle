<?php

namespace OctopusPress\Bundle\Customize;

/**
 *
 */
class AutoCompleteControl extends Control
{
    public function __construct(string $id, array $args = [])
    {
        parent::__construct($id, $args);
        $this->setType(self::AUTOCOMPLETE);
    }

    /**
     * @param string $endpoint
     * @return $this
     */
    public function withEndpoint(string $endpoint): static
    {
        $this->setSetting('endpoint', $endpoint);
        return $this;
    }
}
