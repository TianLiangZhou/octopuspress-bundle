<?php

namespace OctopusPress\Bundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{

    private bool $debug;

    private string $alias;

    public function __construct(bool $debug, string $alias)
    {
        $this->debug = $debug;
        $this->alias = $alias;
    }

    public function getConfigTreeBuilder(): TreeBuilder
    {
        // TODO: Implement getConfigTreeBuilder() method.
        $treeBuilder = new TreeBuilder($this->alias);
        $rootNode = $treeBuilder->getRootNode();
        $rootNode->children()
                ->scalarNode('plugin_dir')->defaultValue("%kernel.project_dir%/plugins")->end()
                ->scalarNode('assets_url')->end()
                ->scalarNode('build_assets_dir')->end()
                ->scalarNode('service_center_host')->defaultValue("http://127.0.0.1:8080")->end()
                ->arrayNode('access_controls')
                    ->arrayPrototype()
                        ->children()
                            ->scalarNode('path')->end()
                            ->scalarNode('roles')->end()
                        ->end()
                    ->end()
                ->end()
            ->end();

        return $treeBuilder;
    }
}
