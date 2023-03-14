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
                ->scalarNode('pluginDir')->defaultValue("%kernel.project_dir%/plugins")->end()
                ->scalarNode('buildAssetDir')->end()
                ->arrayNode('assetsUrl')->scalarPrototype()->end()->end()
                ->arrayNode('accessControls')
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
