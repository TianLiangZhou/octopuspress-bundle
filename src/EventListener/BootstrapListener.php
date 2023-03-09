<?php

namespace OctopusPress\Bundle\EventListener;

use OctopusPress\Bundle\Controller\Controller;
use OctopusPress\Bundle\Model\MasterManager;
use OctopusPress\Bundle\Model\PluginManager;
use OctopusPress\Bundle\OctopusPressKernel;
use OctopusPress\Bundle\Plugin\PluginInterface;
use OctopusPress\Bundle\Repository\OptionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\HttpKernel\KernelEvents;
use function Symfony\Component\String\u;

/**
 *
 */
class BootstrapListener implements EventSubscriberInterface
{

    /**
     * @var PluginManager
     */
    private PluginManager $manager;
    private ContainerInterface $container;
    private MasterManager $master;

    /**
     * @param MasterManager $master
     * @param PluginManager $manager
     * @param ContainerInterface $container
     */
    public function __construct(
        MasterManager $master,
        PluginManager $manager,
        ContainerInterface $container,
    ) {
        $this->manager = $manager;
        $this->master = $master;
        $this->container = $container;
    }

    /**
     * @param RequestEvent $event
     */
    public function onRequestEvent(RequestEvent $event): void
    {
        $pathInfo = $event->getRequest()->getPathInfo();
        /**
         * @var OptionRepository $option
         */
        $option = $this->container->get(OptionRepository::class);
        if ($option->maintenance() && !str_starts_with($pathInfo, '/backend')) {
            $event->setResponse(new Response('站点维护中...'));
            $event->stopPropagation();
            return ;
        }
        $timezone = $option->timezone();
        if ($timezone) {
            date_default_timezone_set($timezone);
        }
        $domain = $option->siteUrl();
        $redirectResponse = null;
        if ($pathInfo === '/install' && $domain) {
            $redirectResponse = new RedirectResponse('/');
        }
        if ($pathInfo !== '/install' && empty($domain)) {
            $redirectResponse = new RedirectResponse('/install');
        }
        if ($redirectResponse) {
            $event->setResponse($redirectResponse);
            $event->stopPropagation();
            return;
        }
        $this->master->boot();
        $this->pluginLauncher();
    }


    /**
     * @return void
     */
    private function pluginLauncher(): void
    {
        $bridger = $this->manager->getBridger();
        /**
         * @var $kernel Kernel
         */
        $kernel = $this->container->get('kernel');
        if ($kernel instanceof PluginInterface) {
            $kernel->launcher($bridger);
        }
        $dispatcher = $this->container->get('event_dispatcher');
        $activePlugins = $this->manager->getActivatedPlugins();
        $pluginDir = $this->manager->getPluginDir();
        $doctrine = $this->container->get('doctrine');
        foreach ($activePlugins as $name) {
            $plugin = $this->manager->getPlugin($name);
            if ($plugin == null) {
                continue;
            }
            $manifest = $plugin::manifest();
            if (empty($manifest->getAlias())) {
                $manifest->setAlias(u($name)->camel()->lower()->toString());
            }
            if (empty($manifest->getPluginDir())) {
                $manifest->setPluginDir($pluginDir . DIRECTORY_SEPARATOR . $name);
            }
            if ($plugin instanceof EventSubscriberInterface) {
                $dispatcher->addSubscriber($plugin);
            }
            $services = $plugin->getServices($bridger);
            foreach ($services as $service) {
                $className = get_class($service);
                if ($this->container->has($className)) {
                    continue;
                }
                if ($service instanceof Command) {
                    continue;
                }
                if ($service instanceof EventSubscriberInterface) {
                    $dispatcher->addSubscriber($service);
                }
                if ($service instanceof Controller) {
                    $service->setDeps($doctrine);
                    $service->setContainer($this->container);
                    $this->container->set($className, $service);
                }
            }
            $plugin->launcher($bridger);
        }
    }

    /**
     * @return \array[][]
     */
    public static function getSubscribedEvents(): array
    {
        // TODO: Implement getSubscribedEvents() method.
        return [
            KernelEvents::REQUEST => [['onRequestEvent', 256]],
        ];
    }
}
