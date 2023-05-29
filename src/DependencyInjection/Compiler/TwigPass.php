<?php

namespace OctopusPress\Bundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class TwigPass implements CompilerPassInterface
{

    public function process(ContainerBuilder $container): void
    {
        // TODO: Implement process() method.
        $definition = $container->getDefinition('twig.loader.native_filesystem');
        $definition->addMethodCall('addPath', [dirname(__DIR__, 3)  . '/templates', 'OctopusPressBundle']);
    }
}
