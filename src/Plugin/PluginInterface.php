<?php

namespace OctopusPress\Bundle\Plugin;

use OctopusPress\Bundle\Bridge\Bridger;

interface PluginInterface
{
    public function launcher(Bridger $bridger): void;

    public function activate(Bridger $bridger): void;

    public function uninstall(Bridger $bridger): void;

    /**
     * @return object[]
     */
    public function getServices(Bridger $bridger): array;

    /**
     * @param Bridger $bridger
     * @return PluginProviderInterface|null
     */
    public function provider(Bridger $bridger): ?PluginProviderInterface;
}
