<?php


use OctopusPress\Bundle\Asset\ThemePackage;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Command\AutoloadCommand;
use OctopusPress\Bundle\Command\InstallCommand;
use OctopusPress\Bundle\Command\PluginCommand;
use OctopusPress\Bundle\EventListener\BootstrapListener;
use OctopusPress\Bundle\EventListener\LogoutListener;
use OctopusPress\Bundle\EventListener\ViewListener;
use OctopusPress\Bundle\Factory\ResourceCheckerConfigCacheFactory;
use OctopusPress\Bundle\Model\ThemeManager;
use OctopusPress\Bundle\Model\CustomizeManager;
use OctopusPress\Bundle\Model\MasterManager;
use OctopusPress\Bundle\Model\PluginManager;
use OctopusPress\Bundle\Model\ViewManager;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Scalable\Hook;
use OctopusPress\Bundle\Scalable\Plugin;
use OctopusPress\Bundle\Security\PermissionVoter;
use OctopusPress\Bundle\Service\Requester;
use OctopusPress\Bundle\Service\ServiceCenter;
use OctopusPress\Bundle\Support\ActivatedRoute;
use OctopusPress\Bundle\Twig\OctopusExtension;
use OctopusPress\Bundle\Twig\OctopusRuntime;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use function Symfony\Component\DependencyInjection\Loader\Configurator\service;
use function Symfony\Component\DependencyInjection\Loader\Configurator\tagged_iterator;

return static function (ContainerConfigurator $container, ContainerBuilder $builder) {
    $services = $container->services()
        ->defaults()
        ->autowire()
        ->autoconfigure();

    $services->set('octopus_press.bridger', Bridger::class)
        ->args([
            service('service_container'),
            service(ParameterBagInterface::class),
            service('twig'),
            service('request_stack'),
            service('router'),
            service('logger'),
        ])
        ->alias(Bridger::class, 'octopus_press.bridger');


    $services->load("OctopusPress\\Bundle\\Controller\\", "../src/Controller/*")
        ->public();
    $services->load("OctopusPress\\Bundle\\Repository\\", '../src/Repository/*.php')
        ->public();
    $services->load("OctopusPress\\Bundle\\Scalable\\", '../src/Scalable/*.php')
        ->public();
    $services->load("OctopusPress\\Bundle\\Model\\", '../src/Model/*.php');

    $services->set('activated_route', ActivatedRoute::class)
        ->args([
            service('request_stack'),
            service(Hook::class)
        ])
        ->public();

    $services->set(LogoutListener::class, LogoutListener::class)
        ->tag('kernel.event_subscriber');
    $services->set(ViewListener::class, ViewListener::class)
        ->args([
            service(ViewManager::class),
        ])
        ->tag('kernel.event_subscriber');
    $services->set(BootstrapListener::class, BootstrapListener::class)
        ->args([
            service(MasterManager::class),
            service(PluginManager::class),
            service('service_container'),
        ])
        ->tag('kernel.event_subscriber');

    $services->set('security.voter.permission', PermissionVoter::class)
        ->args([
            service('router'),
            service(OptionRepository::class)
        ])
        ->tag('security.voter');


    $services->set('twig.extension.octopus', OctopusExtension::class)
        ->tag('twig.extension');

    $services->set('twig.runtime.octopus', OctopusRuntime::class);

    $services->set(ThemePackage::class, ThemePackage::class)
        ->args([
            service('octopus_press.bridger'),
        ])
        ->tag('assets.package', ['package' => 'theme']);

    $services->set(Plugin::class, Plugin::class)
        ->public()
        ->args([
            service(Bridger::class),
            service('routing.loader.annotation')
        ]);
    $services->set(CustomizeManager::class, CustomizeManager::class)->public();


    $services->set('octopus_press.command.plugin', PluginCommand::class)
        ->args([
            service(PluginManager::class),
            service(Bridger::class)
        ])
        ->tag('console.command');

    $services->set('octopus_press.command.autoload', AutoloadCommand::class)
        ->args([
            service(PluginManager::class),
        ])
        ->tag('console.command');


    $services->set('octopus_press.command.install', InstallCommand::class)
        ->args([
            service(PluginManager::class),
            service(ThemeManager::class)
        ])
        ->tag('console.command');

    $services->set(Requester::class, Requester::class)
        ->args([service(HttpClientInterface::class)]);

    $services->set(ServiceCenter::class, ServiceCenter::class)
        ->args([
            service(Requester::class),
            service(Bridger::class),
        ]);

    $services->set('config_cache_factory', ResourceCheckerConfigCacheFactory::class)
        ->args([
            service('router'),
            $builder->getParameter('kernel.debug') ? tagged_iterator('config_cache.resource_checker') : [],
        ]);
};
