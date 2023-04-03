<?php

namespace OctopusPress\Bundle\EventListener;

use OctopusPress\Bundle\Model\MasterManager;
use OctopusPress\Bundle\Model\PluginManager;
use OctopusPress\Bundle\Plugin\PluginInterface;
use OctopusPress\Bundle\Repository\OptionRepository;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\HttpKernel\KernelEvents;

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
        $this->manager->launchers($this->container);
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
