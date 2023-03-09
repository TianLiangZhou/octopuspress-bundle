<?php

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

return static function(RoutingConfigurator $configurator) {
    $configurator->import(
        __DIR__ . '/../src/Controller/*.php',
        'annotation'
    );
    $dashboard = $configurator->import(__DIR__ . '/../src/Controller/Admin/', 'annotation')
        ->prefix("backend")
        ->namePrefix('backend_');
    if (!empty($_SERVER['DASHBOARD_URL'])) {
        $dashboard->host(str_replace(['https://', 'http://'], '', $_SERVER['DASHBOARD_URL']));
    }
};
