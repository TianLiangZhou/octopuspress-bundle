<?php

namespace OctopusPress\Bundle\Customize;

class Control extends AbstractControl
{
    /**
     * @param string $id
     * @param string $label
     * @param array $args
     * @return static
     */
    public static function create(string $id, string $label, array $args = []): static
    {
        $args['label'] = $label;
        return new static($id, $args);
    }
}
