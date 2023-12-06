<?php

namespace OctopusPress\Bundle\Model;

use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Event\OctopusEvent;
use OctopusPress\Bundle\Event\ViewRenderEvent;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Scalable\Hook;
use OctopusPress\Bundle\Support\ActivatedRoute;
use OctopusPress\Bundle\Support\ArchiveDataSet;
use Symfony\Component\HttpFoundation\Response;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

class ViewManager
{
    private Environment $twig;

    private Hook $hook;

    private OptionRepository $option;

    private ThemeManager $themeManager;

    private bool $booted = false;

    private Bridger $bridger;

    private ActivatedRoute $activatedRoute;

    public function __construct(ThemeManager $themeManager, Bridger $bridger)
    {
        $this->themeManager = $themeManager;
        $this->bridger = $bridger;
        $this->option = $bridger->getOptionRepository();
        $this->hook = $this->bridger->getHook();
        $this->twig = $this->bridger->getTwig();
        $this->activatedRoute = $this->bridger->getActivatedRoute();
    }


    /**
     * @return void
     */
    public function boot(): void
    {
        if ($this->booted) {
            return;
        }
        $this->booted = true;
        if (!$this->activatedRoute->isDashboard()) {
            $this->registerGlobal();
        }
        $this->themeManager->boot();
    }

    /**
     * @return Response
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function render(): Response
    {
        $controllerResult = $this->getControllerResult();
        $context = [
            'route' => $this->getActivatedRoute()->getRouteName(),
            'entity' => null,
            'collection'=> null,
        ];
        if ($controllerResult instanceof Post) {
            $context['entity'] = $controllerResult;
        } elseif ($controllerResult instanceof ArchiveDataSet) {
            $context['entity'] = $controllerResult->getArchiveTaxonomy();
            $context['collection'] = $controllerResult->getCollection();
        }
        foreach ($context as $name => $value) {
            $this->twig->addGlobal($name, $value);
        }
        $event = new ViewRenderEvent($this->getBridger()->getRequest(), $this->getActivatedRoute());
        $this->getBridger()->getDispatcher()->dispatch($event, OctopusEvent::VIEW_RENDER);
        if ($event->hasResponse()) {
            return $event->getResponse();
        }
        if (!$event->hasContext('layout')) {
            $event->addContext(
                'layout',
                $this->twig->load('@OctopusPressBundle/base.html.twig')
            );
        }
        return new Response($this->twig->render($this->getTemplate(), $event->getContext()));
    }

    /**
     * @return bool
     */
    public function notFoundExist(): bool
    {
        return !empty($this->getNotFoundTemplate());
    }

    /**
     * @return Response
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function notFound(): Response
    {
        return new Response($this->twig->render($this->getNotFoundTemplate()), Response::HTTP_NOT_FOUND);
    }

    /**
     * @return string
     */
    private function getTemplate(): string
    {
        $template = '';
        if ($this->activatedRoute->isTag()) {
            $template = $this->getTagTemplate();
        } elseif ($this->activatedRoute->isCategory()) {
            $template = $this->getCategoryTemplate();
        } elseif ($this->activatedRoute->isArchives()) {
            $template = $this->getTaxonomyTemplate();
        } elseif ($this->activatedRoute->isSingle()) {
            $template = $this->getSingleTemplate();
        } elseif ($this->activatedRoute->isPage()) {
            $template = $this->getPageTemplate();
        } elseif ($this->activatedRoute->isHome()) {
            $template = $this->getHomeTemplate();
        } elseif ($this->activatedRoute->isPlugin()) {
            $template = $this->getPluginTemplate();
        } elseif ($this->activatedRoute->isSignUp()) {
            $template = $this->getSignUpTemplate();
        } elseif ($this->activatedRoute->isSignIn()) {
            $template = $this->getLoginTemplate();
        } elseif ($this->activatedRoute->isForgot()) {
            $template = $this->getForgotTemplate();
        } elseif ($this->activatedRoute->isReset()) {
            $template = $this->getResetTemplate();
        } elseif ($this->activatedRoute->isSearch()) {
            $template = $this->getSearchTemplate();
        }
        if (empty($template)) {
            $template = $this->getIndexTemplate();
        }
        return $this->hook->filter('template_include', $template);
    }



    /**
     * @return string
     */
    private function getTagTemplate(): string
    {
        $templates = [];
        $controllerResult = $this->getControllerResult();
        if ($controllerResult instanceof ArchiveDataSet) {
            $term = $controllerResult->getArchiveTaxonomy()->getTerm();
            $templates[] = 'tag-' . $term->getSlug();
            $templates[] = 'tag-' . $term->getId();
        }
        $templates[] = 'tag';
        $templates[] = 'taxonomy';
        return $this->getQueryTemplate('tag', $templates);
    }

    /**
     * @return string
     */
    private function getCategoryTemplate(): string
    {
        $templates = [];
        $controllerResult = $this->getControllerResult();
        if ($controllerResult instanceof ArchiveDataSet) {
            $term = $controllerResult->getArchiveTaxonomy()->getTerm();
            $templates[] = 'category-' . $term->getSlug();
            $templates[] = 'category-' . $term->getId();
        }
        $templates[] = 'category';
        $templates[] = 'taxonomy';
        return $this->getQueryTemplate('category', $templates);
    }

    /**
     * @return string
     */
    private function getTaxonomyTemplate(): string
    {
        $templates = [];
        $controllerResult = $this->getControllerResult();
        if ($controllerResult instanceof ArchiveDataSet) {
            $taxonomy = $controllerResult->getArchiveTaxonomy();
            if ($taxonomy instanceof TermTaxonomy) {
                $templates[] = $taxonomy->getTaxonomy();
                $slug = $taxonomy->getTerm()->getSlug();
                $templates[] = $taxonomy->getTaxonomy() . '-' . $slug;
            } elseif ($taxonomy instanceof User) {
                $templates[] = 'author';
            } else {
                $templates[] = 'archive';
            }
        }
        $templates[] = 'taxonomy';
        return $this->getQueryTemplate('taxonomy', $templates);
    }

    /**
     * @return string
     */
    private function getSingleTemplate(): string
    {
        $templates = [];
        $controllerResult = $this->getControllerResult();
        if ($controllerResult instanceof Post) {
            $type = $controllerResult->getType();
            $name = $controllerResult->getName();
            $templates[] = 'single-' . $type . '-' . $name;
            $templates[] = 'single-' . $type;
        }
        $templates[] = 'single';
        return $this->getQueryTemplate('single', $templates);
    }

    /**
     * @return string
     */
    private function getPageTemplate(): string
    {
        $templates = [];
        $controllerResult = $this->getControllerResult();
        if ($controllerResult instanceof Post) {
            $meta = $controllerResult->getMeta('_wp_page_template');
            if ($meta && ($template = $meta->getMetaValue())) {
                $templates[] = $template;
            }
            $templates[] = 'page-' . $controllerResult->getName();
            $templates[] = 'page-' . $controllerResult->getId();
        }
        $templates[] = 'page';
        $templates[] = 'single';
        return $this->getQueryTemplate('page', $templates);
    }

    /**
     * @return string
     */
    private function getHomeTemplate(): string
    {
        $templates = ['home', 'index'];
        return $this->getQueryTemplate('home', $templates);
    }

    /**
     * @return string
     */
    private function getSearchTemplate(): string
    {
        $templates = ['search'];
        return $this->getQueryTemplate('search', $templates);
    }

    /**
     * @return string
     */
    private function getLoginTemplate(): string
    {
        $templates = ['login', '@OctopusPressBundle/login'];
        return $this->getQueryTemplate('login', $templates);
    }

    /**
     * @return string
     */
    private function getSignUpTemplate(): string
    {
        $templates = ['signup', '@OctopusPressBundle/signup'];
        return $this->getQueryTemplate('signup', $templates);
    }

    /**
     * @return string
     */
    private function getForgotTemplate(): string
    {
        $templates = ['forgot', '@OctopusPressBundle/forgot'];
        return $this->getQueryTemplate('forgot', $templates);
    }

    /**
     * @return string
     */
    private function getResetTemplate(): string
    {
        $templates = ['reset', '@OctopusPressBundle/reset'];
        return $this->getQueryTemplate('reset', $templates);
    }

    /**
     * @return string
     */
    private function getNotFoundTemplate(): string
    {
        return $this->getQueryTemplate('404', ['@OctopusPressBundle/404']);
    }

    /**
     * @return string
     */
    private function getPluginTemplate(): string
    {
        $routeBlocks = explode('_', $this->getActivatedRoute()->getRouteName());
        if ($routeBlocks[0] === 'octopus') {
            array_shift($routeBlocks);
        }
        if ($routeBlocks[0] === 'plugin') {
            array_shift($routeBlocks);
        }
        if (empty($routeBlocks)) {
            return $this->getQueryTemplate('plugin', []);
        }
        $templates = [];
        $chunkCount = count($routeBlocks);
        if ($chunkCount < 2) {
            $templates[] = sprintf('@%s/%s', $routeBlocks[0], $routeBlocks[0]);
            $templates[] = sprintf('@%s/index', $routeBlocks[0]);
        } elseif ($chunkCount < 3) {
            $templates[] = sprintf('@%s/%s', $routeBlocks[0], $routeBlocks[1]);
            $templates[] = sprintf('@%s/%s/index', $routeBlocks[0], $routeBlocks[1]);
        } else {
            $name = array_shift($routeBlocks);
            $nest = implode('/', $routeBlocks);
            $single = implode('_', $routeBlocks);
            $templates[] = sprintf('@%s/%s', $name, $nest);
            $templates[] = sprintf('@%s/%s', $name, $single);
        }
        return $this->getQueryTemplate('plugin', $templates);
    }

    /**
     * @return string
     */
    private function getIndexTemplate(): string
    {
        return $this->getQueryTemplate('index', ['@OctopusPressBundle/index']);
    }

    /**
     * @param string $type
     * @param string[] $templates
     * @return string
     */
    private function getQueryTemplate(string $type, array $templates = []): string
    {
        if (empty($templates)) {
            $templates = [$type];
        }
        $templates = $this->hook->filter($type . '_template_hierarchy', $templates);
        $themePath = $this->getThemePath();
        $template = '';
        foreach ($templates as $tpl) {
            $templateName = $tpl . '.html.twig';
            if (str_starts_with($templateName, '@')) {
                if ($this->twig->getLoader()->exists($templateName)) {
                    $template = $templateName;
                    break;
                }
            }
            if ($this->twig->getLoader()->exists($themePath . $templateName)) {
                $template = $themePath . $templateName;
                break;
            }
        }
        return $this->hook->filter($type . '_template', $template, $themePath, $templates);
    }


    /**
     * @return void
     */
    private function registerGlobal(): void
    {
        $this->twig->addGlobal('now', time());
        $this->twig->addGlobal('activated_route', $this->activatedRoute);
        $defaultGlobalOptions = array_merge(
            $this->option::$defaultGeneralNames,
            $this->option::$defaultMediaNames,
            $this->option::$defaultContentNames
        );
        $defaultOptions = $this->option->getDefaultOptions();
        foreach ($defaultGlobalOptions as $key) {
            $this->twig->addGlobal($key, $defaultOptions[$key] ?? null);
        }
        $this->twig->addGlobal('theme', $this->option->theme());
    }

    /**
     * @return OptionRepository
     */
    public function getOption(): OptionRepository
    {
        return $this->option;
    }

    /**
     * @return string
     */
    public function getThemePath(): string
    {
        return ($theme = $this->option->theme()) ? $theme . DIRECTORY_SEPARATOR : '';
    }

    /**
     * @return ActivatedRoute
     */
    public function getActivatedRoute(): ActivatedRoute
    {
        return $this->activatedRoute;
    }

    /**
     * @return mixed
     */
    public function getControllerResult(): mixed
    {
        return $this->getBridger()->getControllerResult();
    }

    /**
     * @return Bridger
     */
    public function getBridger(): Bridger
    {
        return $this->bridger;
    }
}
