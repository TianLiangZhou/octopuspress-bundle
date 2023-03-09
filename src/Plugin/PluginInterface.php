<?php

namespace OctopusPress\Bundle\Plugin;

use OctopusPress\Bundle\Bridge\Bridger;

interface PluginInterface
{
    /**
     * @return Manifest
     */
    public static function manifest(): Manifest;

    public function launcher(Bridger $bridge): void;

    public function activate(Bridger $bridge): void;

    public function uninstall(Bridger $bridge): void;

    /**
     * @return object[]
     */
    public function getServices(Bridger $bridge): array;
}
