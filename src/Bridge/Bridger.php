<?php

namespace OctopusPress\Bundle\Bridge;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use OctopusPress\Bundle\Repository\CommentMetaRepository;
use OctopusPress\Bundle\Repository\CommentRepository;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Repository\PostMetaRepository;
use OctopusPress\Bundle\Repository\PostRepository;
use OctopusPress\Bundle\Repository\RelationRepository;
use OctopusPress\Bundle\Repository\TaxonomyRepository;
use OctopusPress\Bundle\Repository\TermMetaRepository;
use OctopusPress\Bundle\Repository\TermRepository;
use OctopusPress\Bundle\Repository\UserMetaRepository;
use OctopusPress\Bundle\Repository\UserRepository;
use OctopusPress\Bundle\Scalable\Hook;
use OctopusPress\Bundle\Scalable\Media;
use OctopusPress\Bundle\Scalable\Meta;
use OctopusPress\Bundle\Scalable\Plugin;
use OctopusPress\Bundle\Scalable\Post;
use OctopusPress\Bundle\Scalable\TermTaxonomy;
use OctopusPress\Bundle\Scalable\Theme;
use OctopusPress\Bundle\Scalable\Widget;
use OctopusPress\Bundle\Support\ActivatedPlugin;
use OctopusPress\Bundle\Support\ActivatedRoute;
use OctopusPress\Bundle\Support\DefaultViewFilter;
use Psr\Log\LoggerInterface;
use Symfony\Component\Asset\Packages;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\Service\Attribute\Required;
use Twig\Environment;

final class Bridger
{
    private ContainerInterface $container;
    private Environment $twig;
    private RequestStack $requestStack;
    private RouterInterface $router;
    private LoggerInterface $logger;
    private ParameterBagInterface $bag;
    private CacheInterface $cache;
    private HttpClientInterface $client;
    private Packages $packages;
    private UserPasswordHasherInterface $passwordHasher;


    /**
     * @param ContainerInterface $container
     * @param ParameterBagInterface $bag
     * @param Environment $twig
     * @param RequestStack $requestStack
     * @param RouterInterface $router
     * @param LoggerInterface $logger
     * @param CacheInterface $cache
     * @param HttpClientInterface $client
     * @param Packages $packages
     */
    public function __construct(
        ContainerInterface $container,
        ParameterBagInterface $bag,
        Environment $twig,
        RequestStack $requestStack,
        RouterInterface $router,
        LoggerInterface $logger,
        CacheInterface $cache,
        HttpClientInterface $client,
        Packages $packages,
    ) {
        $this->twig = $twig;
        $this->router = $router;
        $this->logger = $logger;
        $this->requestStack = $requestStack;
        $this->container = $container;
        $this->bag = $bag;
        $this->cache = $cache;
        $this->client = $client;
        $this->packages = $packages;
    }

    /**
     * @return string
     */
    public function getLogDir(): string
    {
        return $this->getParameter('kernel.logs_dir');
    }

    /**
     * @return string
     */
    public function getProjectDir(): string
    {
        return $this->getParameter('kernel.project_dir');
    }

    /**
     * @return string
     */
    public function getCacheDir(): string
    {
        return $this->getParameter('kernel.cache_dir');
    }

    /**
     * @return array
     */
    public function getAssetsUrl(): array
    {
        return array_map(function ($url) {
            return rtrim($url, '\\/') . DIRECTORY_SEPARATOR;
        }, (array) $this->getParameter('assets.base_urls'));
    }

    /**
     * @return string
     */
    public function getAssetUrl(): string
    {
        return $this->getAssetsUrl()[0];
    }

    /**
     * @return string
     */
    public function getBuildDir(): string
    {
        return $this->getParameter('kernel.build_dir');
    }

    public function getBuildAssetsDir(): string
    {
        return $this->getParameter('build_assets_dir');
    }

    /**
     * @return string
     */
    public function getPublicDir(): string
    {
        return $this->getParameter('public_dir');
    }

    /**
     * @return string
     */
    public function getPluginDir(): string
    {
        return $this->getParameter('plugin_dir');
    }

    /**
     * @return string
     */
    public function getTemplateDir(): string
    {
        return $this->getParameter('twig.default_path');
    }

    /**
     * @return string
     */
    public function getTempDir(): string
    {
        return $this->getProjectDir() . '/var/temp';
    }

    /**
     * @return bool
     */
    public function isDebug(): bool
    {
        return $this->getParameter('kernel.debug');
    }

    /**
     * @return string
     */
    public function getEnvironment(): string
    {
        return $this->getParameter('kernel.environment');
    }

    /**
     * @return ?Request
     */
    public function getRequest(): ?Request
    {
        return $this->getRequestStack()->getCurrentRequest();
    }

    /**
     * @return mixed
     */
    public function getControllerResult(): mixed
    {
        return $this->getRequest()->attributes->get('_controller_result');
    }

    /**
     * @return LoggerInterface
     */
    public function getLogger(): LoggerInterface
    {
        return $this->logger;
    }

    /**
     * @return Environment
     */
    public function getTwig(): Environment
    {
        return $this->twig;
    }

    /**
     * @return RouterInterface
     */
    public function getRouter(): RouterInterface
    {
        return $this->router;
    }

    /**
     * @return RequestStack
     */
    public function getRequestStack(): RequestStack
    {
        return $this->requestStack;
    }

    /**
     * @return ActivatedRoute
     */
    public function getActivatedRoute(): ActivatedRoute
    {
        return $this->get('activated_route');
    }

    /**
     * @return ActivatedPlugin
     */
    public function getActivatedPlugin(): ActivatedPlugin
    {
        return $this->get(ActivatedPlugin::class);
    }

    /**
     * @return Hook
     */
    public function getHook(): Hook
    {
        return $this->get(Hook::class);
    }

    /**
     * @return Plugin
     */
    public function getPlugin(): Plugin
    {
        return $this->get(Plugin::class);
    }

    /**
     * @return Theme
     */
    public function getTheme(): Theme
    {
        return $this->get(Theme::class);
    }

    /**
     * @return Media
     */
    public function getMedia(): Media
    {
        return $this->get(Media::class);
    }

    /**
     * @return Widget
     */
    public function getWidget(): Widget
    {
        return $this->get(Widget::class);
    }

    /**
     * @return Post
     */
    public function getPost(): Post
    {
        return $this->get(Post::class);
    }

    /**
     * @return TermTaxonomy
     */
    public function getTaxonomy(): TermTaxonomy
    {
        return $this->get(TermTaxonomy::class);
    }

    /**
     * @return Meta
     */
    public function getMeta(): Meta
    {
        return $this->get(Meta::class);
    }

    /**
     * @return DefaultViewFilter
     */
    public function getDefaultFilter(): DefaultViewFilter
    {
        return $this->get(DefaultViewFilter::class);
    }



    /**
     * @return PostRepository
     */
    public function getPostRepository(): PostRepository
    {
        return $this->get(PostRepository::class);
    }

    /**
     * @return PostMetaRepository
     */
    public function getPostMetaRepository(): PostMetaRepository
    {
        return $this->get(PostMetaRepository::class);
    }

    /**
     * @return OptionRepository
     */
    public function getOptionRepository(): OptionRepository
    {
        return $this->get(OptionRepository::class);
    }

    /**
     * @return TaxonomyRepository
     */
    public function getTaxonomyRepository(): TaxonomyRepository
    {
        return $this->get(TaxonomyRepository::class);
    }

    /**
     * @return TermRepository
     */
    public function getTermRepository(): TermRepository
    {
        return $this->get(TermRepository::class);
    }

    /**
     * @return TermMetaRepository
     */
    public function getTermMetaRepository(): TermMetaRepository
    {
        return $this->get(TermMetaRepository::class);
    }

    /**
     * @return RelationRepository
     */
    public function getRelationRepository(): RelationRepository
    {
        return $this->get(RelationRepository::class);
    }

    /**
     * @return UserRepository
     */
    public function getUserRepository(): UserRepository
    {
        return $this->get(UserRepository::class);
    }

    /**
     * @return CommentRepository
     */
    public function getCommentRepository(): CommentRepository
    {
        return $this->get(CommentRepository::class);
    }

    /**
     * @return UserMetaRepository
     */
    public function getUserMetaRepository(): UserMetaRepository
    {
        return $this->get(UserMetaRepository::class);
    }

    /**
     * @return CommentMetaRepository
     */
    public function getCommentMetaRepository(): CommentMetaRepository
    {
        return $this->get(CommentMetaRepository::class);
    }

    /**
     * @return EventDispatcherInterface
     */
    public function getDispatcher(): EventDispatcherInterface
    {
        return $this->get('event_dispatcher');
    }

    /**
     * @return ManagerRegistry
     */
    public function getDoctrine(): ManagerRegistry
    {
        return $this->get('doctrine');
    }

    /**
     * @param string $name
     * @return EntityManagerInterface
     */
    public function getEntityManager(string $name = 'default'): EntityManagerInterface
    {
        return $this->getDoctrine()->getManager($name);
    }

    /**
     * @return CacheInterface
     */
    public function getCache(): CacheInterface
    {
        return $this->cache;
    }

    /**
     * @template T
     * @param class-string<T> $identity
     * @return T
     */
    public function get(string $identity)
    {
        return $this->container->get($identity);
    }

    /**
     * @param string $name
     * @return array|bool|float|int|string|\UnitEnum|null
     */
    public function getParameter(string $name): mixed
    {
        return $this->bag->get($name);
    }

    /**
     * @return HttpClientInterface
     */
    public function getClient(): HttpClientInterface
    {
        return $this->client;
    }

    /**
     * @return Packages
     */
    public function getPackages(): Packages
    {
        return $this->packages;
    }

    public function getPasswordHasher(): UserPasswordHasherInterface
    {
        return $this->passwordHasher;
    }

    /**
     * @param UserPasswordHasherInterface $passwordHasher
     * @return void
     */
    #[Required]
    public function setPasswordHasher(UserPasswordHasherInterface $passwordHasher): void
    {
        $this->passwordHasher = $passwordHasher;
    }
}
