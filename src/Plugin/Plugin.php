<?php

namespace OctopusPress\Bundle\Plugin;

use OctopusPress\Bundle\Bridge\Bridger;

class Plugin
{
    private string $name;

    private string $version;

    private PluginInterface $plugin;

    private ?PluginProviderInterface $provider = null;

    public function __construct(PluginInterface $plugin, $name, $version)
    {
        $this->name = $name;
        $this->version = $version;
        $this->plugin = $plugin;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getVersion(): string
    {
        return $this->version;
    }

    /**
     * @param Bridger $bridger
     * @return PluginProviderInterface|null
     */
    public function getProvider(Bridger $bridger): ?PluginProviderInterface
    {
        return $this->provider ??= $this->plugin->provider($bridger);
    }
}
