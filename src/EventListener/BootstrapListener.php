<?php

namespace OctopusPress\Bundle\EventListener;

use OctopusPress\Bundle\Command\PluginCommand;
use OctopusPress\Bundle\Controller\PostController;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Model\MasterManager;
use OctopusPress\Bundle\Model\PluginManager;
use OctopusPress\Bundle\Plugin\PluginInterface;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Support\ActivatedTheme;
use Symfony\Component\Console\Command\HelpCommand;
use Symfony\Component\Console\ConsoleEvents;
use Symfony\Component\Console\Event\ConsoleCommandEvent;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Routing\Route;

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

    private bool $started = false;

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
        if (!$event->isMainRequest()) {
            return ;
        }
        /**
         * @var OptionRepository $option
         */
        $option = $this->container->get(OptionRepository::class);
        $request = $event->getRequest();
        $requestUri = $request->server->get('REQUEST_URI');
        if ($option->staticMode() && $option->permalinkStructure() !== 'post_permalink_normal') {
            if (str_contains($requestUri, '.html')) {
                $request->server->set('REQUEST_URI', str_replace('.html', '', $requestUri));
            }
        }
        $request->server->set('ORIGIN_REQUEST_URI', $requestUri);
        if ($option->maintenance() && !str_starts_with($requestUri, '/backend')) {
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
        if ($requestUri === '/install' && $domain) {
            $redirectResponse = new RedirectResponse('/');
        }
        if ($requestUri !== '/install' && empty($domain)) {
            $redirectResponse = new RedirectResponse('/install');
        }
        if ($redirectResponse) {
            $event->setResponse($redirectResponse);
            $event->stopPropagation();
            return;
        }
        $this->onStart();
    }

    /**
     * @return void
     */
    private function onStart(): void
    {
        if ($this->started) {
            return ;
        }
        $this->master->boot();
        $this->updateActivatedTheme();
        $this->pluginLauncher();
        $this->started = true;
    }

    /**
     * @param ConsoleCommandEvent $event
     * @return void
     */
    public function onBeforeCommand(ConsoleCommandEvent $event): void
    {
        $command = $event->getCommand();
        if ($command instanceof PluginCommand) {
            $this->onStart();
        } elseif ($command instanceof HelpCommand) {
            $input = $event->getInput();
            $commandString = $input->getArgument('command');
            if ($commandString !== PluginCommand::NAME) {
                return ;
            }
            $commandName = $input->getArgument('command_name');
            if ($commandName === 'help') {
                return ;
            }
            if (!str_starts_with($commandName, 'plugin:')) {
                $commandName = 'plugin:' . $commandName;
            }
            $this->onStart();
            $subCommand = $command->getApplication()->get($commandName);
            $command->setCommand($subCommand);
        }
    }


    /**
     * @return void
     */
    private function updateActivatedTheme(): void
    {
        $option = $this->container->get(OptionRepository::class);
        /**
         * @var $activatedTheme ActivatedTheme
         */
        $theme = $option->theme();
        if (empty($theme)) {
            return ;
        }
        $activatedTheme = $this->container->get(ActivatedTheme::class);
        $activatedTheme->setName($theme);
        $installed = $option->installedThemes();
        $activatedTheme->setVersion($installed[$theme]['version'] ?? '1.0.0');
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
        $this->registerDynamicRoutes();
    }

    /**
     * @return void
     */
    private function registerDynamicRoutes(): void
    {
        $routeCollection = $this->container->get('router')->getRouteCollection();
        $bridger = $this->manager->getBridger();
        foreach ($bridger->getPlugin()->getRoutes() as $route) {
            $routeCollection->add($route[0], $route[1], $route[2]);
        }
        foreach ($bridger->getPlugin()->getRouteCollections() as $collection) {
            $routeCollection->addCollection($collection);
        }
        $taxonomies = $bridger->getTaxonomy()->getTaxonomies();
        foreach ($taxonomies as $name => $taxonomy) {
            if (!$taxonomy->isShowUi() || $name === TermTaxonomy::TAG || $name === TermTaxonomy::CATEGORY || $name === TermTaxonomy::NAV_MENU) {
                continue;
            }
            $taxonomyRoute = new Route('/'. $name .'/{slug}', [
                '_controller' => PostController::class . '::taxonomy',
                'taxonomy' => $name,
            ], [
                'slug'     => '[a-z0-9\-_%]{2,}',
            ]);
            $taxonomyRoute->setMethods(Request::METHOD_GET);
            $routeCollection->add('taxonomy_' .$name, $taxonomyRoute);
        }
        $postTypes = $bridger->getPost()->getTypes();
        foreach ($postTypes as $name => $type) {
            if (!$type->isShowUi() || !$type->isShowOnFront() || $name === Post::TYPE_NAVIGATION  || $name == Post::TYPE_PAGE) {
                continue;
            }
            $parentType = $type->getParentType();
            if (empty($parentType) || ($parentType[0] == $name)) {
                $path = '/'.$name.'/{name}';
            } else {
                $path = '/'. $parentType[0] . '/' . $name . '/{name}';
            }
            $postRoute = new Route($path, [
                '_controller' => PostController::class . '::show'
            ], [
                'name' => '[a-z0-9\-%_]{2,}'
            ]);
            $postRoute->setMethods(Request::METHOD_GET);
            $routeCollection->add('post_permalink_type_' . $name, $postRoute);
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
            ConsoleEvents::COMMAND => [['onBeforeCommand', 64]]
        ];
    }
}
