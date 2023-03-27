<?php

namespace OctopusPress\Bundle\Plugin;

use OctopusPress\Bundle\Bridge\Bridger;

interface PluginInterface
{
    /**
     * @return Manifest
     */
    public static function manifest(): Manifest;

    public function launcher(Bridger $bridger): void;

    public function activate(Bridger $bridger): void;

    public function uninstall(Bridger $bridger): void;

    /**
     * @return object[]
     */
    public function getServices(Bridger $bridger): array;
}
