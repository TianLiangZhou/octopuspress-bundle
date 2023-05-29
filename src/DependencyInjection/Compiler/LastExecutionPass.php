<?php

namespace OctopusPress\Bundle\DependencyInjection\Compiler;

use OctopusPress\Bundle\EventListener\AuthenticateListener;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class LastExecutionPass implements CompilerPassInterface
{

    public function process(ContainerBuilder $container): void
    {
        // TODO: Implement process() method.
        if ($container->hasExtension('security')) {
            $hasTokenManagerDefined = $container->hasDefinition('security.csrf.token_manager');
            if (!$hasTokenManagerDefined) {
                return;
            }
            $container->register(AuthenticateListener::class, AuthenticateListener::class)
                ->setArgument(0, $container->getDefinition('request_stack'))
                ->addTag('kernel.event_subscriber');
        }
    }
}
