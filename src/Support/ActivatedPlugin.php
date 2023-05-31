<?php

namespace OctopusPress\Bundle\Support;

use OctopusPress\Bundle\Plugin\Plugin;

final class ActivatedPlugin
{

    /**
     * @var array<string, Plugin>
     */
    private array $registered = [];

    public function add(Plugin $plugin): static
    {
        $this->registered[] = $plugin;

        return $this;
    }

    /**
     * @param string $name
     * @return bool
     */
    public function has(string $name): bool
    {
        return isset($this->registered[$name]);
    }

    /**
     * @param string $name
     * @return Plugin|null
     */
    public function get(string $name): ?Plugin
    {
        if ($this->has($name)) {
            return $this->registered[$name];
        }
        return null;
    }
}
