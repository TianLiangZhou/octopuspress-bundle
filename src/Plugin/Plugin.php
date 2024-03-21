<?php

namespace OctopusPress\Bundle\Plugin;

use OctopusPress\Bundle\Bridge\Bridger;

class Plugin
{
    private array $extra;

    private PluginInterface $plugin;

    private ?PluginProviderInterface $provider = null;

    private string $pluginDir;

    public function __construct(PluginInterface $plugin, array $extra, string $pluginDir)
    {
        $this->plugin = $plugin;
        $this->extra = $extra;
        $this->pluginDir = $pluginDir;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->extra['name'];
    }

    /**
     * @return string
     */
    public function getDir(): string
    {
        return $this->pluginDir  . DIRECTORY_SEPARATOR . $this->getName();
    }

    /**
     * @return string
     */
    public function miniOP(): string
    {
        return $this->extra['miniOP'];
    }

    /**
     * @return string
     */
    public function miniPHP(): string
    {
        return $this->extra['miniPHP'];
    }

    /**
     * @return array
     */
    public function getExtra(): array
    {
        return $this->extra;
    }

    /**
     * @return string
     */
    public function getVersion(): string
    {
        return $this->extra['version'];
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
