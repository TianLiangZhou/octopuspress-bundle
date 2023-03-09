<?php

namespace OctopusPress\Bundle\Model;

use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Event\OctopusEvent;
use OctopusPress\Bundle\Event\ViewRenderEvent;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Scalable\Hook;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Util\Helper;
use OctopusPress\Bundle\View\ViewFilter;
use Symfony\Component\HttpFoundation\Response;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

class ViewManager
{
    private Environment $twig;

    private mixed $controllerResult = null;

    private Hook $hook;

    private OptionRepository $option;

    private ThemeManager $themeManager;

    private bool $booted = false;

    private Bridger $bridger;

    public function __construct(ThemeManager $themeManager, Bridger $bridger)
    {
        $this->themeManager = $themeManager;
        $this->bridger = $bridger;
        $this->option = $bridger->getOptionRepository();
        $this->hook = $this->bridger->getHook();
        $this->twig = $this->bridger->getTwig();
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
        $this->registerFilter();
        if (!Helper::isDashboard($this->getRouteName())) {
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
        $context = [
            'title' => $this->getTitle(),
            'route' => $this->getRouteName(),
            'entity' => $this->getControllerResult(),
        ];
        foreach ($context as $name => $value) {
            $this->twig->addGlobal($name, $value);
        }
        $event = new ViewRenderEvent($this->getBridger()->getRequest(), $context['entity']);
        $this->getBridger()->getDispatcher()->dispatch($event, OctopusEvent::VIEW_RENDER);
        if ($event->hasResponse()) {
            return $event->getResponse();
        }
        if (!$event->hasContext('layout')) {
            $event->addContext('layout', $this->twig->load('@OctopusPressBundle/base.html.twig'));
        }
        return new Response($this->twig->render($this->getTemplate(), $event->getContext()));
    }

    /**
     * @param mixed $result
     * @return void
     */
    public function setControllerResult(mixed $result): void
    {
        $this->controllerResult = $result;
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
        $routeName = $this->getRouteName();
        $template = '';
        if (Helper::isTag($routeName)) {
            $template = $this->getTagTemplate();
        } elseif (Helper::isCategory($routeName)) {
            $template = $this->getCategoryTemplate();
        } elseif (Helper::isTaxonomy($routeName)) {
            $template = $this->getTaxonomyTemplate();
        } elseif (Helper::isSingle($routeName)) {
            $template = $this->getSingleTemplate();
        } elseif (Helper::isPage($routeName)) {
            $template = $this->getPageTemplate();
        } elseif (Helper::isHome($routeName)) {
            $template = $this->getHomeTemplate();
        } elseif (Helper::isPlugin($routeName)) {
            $template = $this->getPluginTemplate();
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
        if ($this->controllerResult instanceof TermTaxonomy) {
            $term = $this->controllerResult->getTerm();
            $templates[] = 'tag-' . $term->getSlug() . '.twig';
            $templates[] = 'tag-' . $term->getId() . '.twig';
        }
        $templates[] = 'tag.twig';
        $templates[] = 'taxonomy.twig';
        return $this->getQueryTemplate('tag', $templates);
    }

    /**
     * @return string
     */
    private function getCategoryTemplate(): string
    {
        $templates = [];
        if ($this->controllerResult instanceof TermTaxonomy) {
            $term = $this->controllerResult->getTerm();
            $templates[] = 'category-' . $term->getSlug() . '.twig';
            $templates[] = 'category-' . $term->getId() . '.twig';
        }
        $templates[] = 'category.twig';
        $templates[] = 'taxonomy.twig';
        return $this->getQueryTemplate('category', $templates);
    }

    /**
     * @return string
     */
    private function getTaxonomyTemplate(): string
    {
        $templates = [];
        if ($this->controllerResult instanceof TermTaxonomy) {
            $taxonomy = $this->controllerResult->getTaxonomy();
            $slug = $this->controllerResult->getTerm()?->getSlug();
            $templates[] = 'taxonomy-' . $taxonomy . '-' . $slug . '.twig';
            $templates[] = 'taxonomy-' . $taxonomy . '.twig';
        }
        $templates[] = 'taxonomy.twig';
        return $this->getQueryTemplate('taxonomy', $templates);
    }

    /**
     * @return string
     */
    private function getSingleTemplate(): string
    {
        $templates = [];
        if ($this->controllerResult instanceof Post) {
            $meta = $this->controllerResult->getMeta('_wp_page_template');
            if ($meta && ($template = $meta->getMetaValue())) {
                $templates[] = $template;
            }
            $type = $this->controllerResult->getType();
            $name = $this->controllerResult->getName();
            $templates[] = 'single-' . $type . '-' . $name . '.twig';
            $templates[] = 'single-' . $type . '.twig';
        }
        $templates[] = 'single.twig';
        return $this->getQueryTemplate('single', $templates);
    }

    /**
     * @return string
     */
    private function getPageTemplate(): string
    {
        $templates = [];
        if ($this->controllerResult instanceof Post) {
            $meta = $this->controllerResult->getMeta('_wp_page_template');
            if ($meta && ($template = $meta->getMetaValue())) {
                $templates[] = $template;
            }
            $templates[] = 'page-' . $this->controllerResult->getName() . '.twig';
            $templates[] = 'page-' . $this->controllerResult->getId() . '.twig';
        }
        $templates[] = 'page.twig';
        return $this->getQueryTemplate('page', $templates);
    }

    /**
     * @return string
     */
    private function getHomeTemplate(): string
    {
        $templates = ['home.twig', 'index.twig'];
        return $this->getQueryTemplate('home', $templates);
    }

    /**
     * @return string
     */
    private function getNotFoundTemplate(): string
    {
        $template = $this->getQueryTemplate('404', ['@OctopusPressBundle/404.html.twig']);
        if (!empty($template)) {
            return $template;
        }
        return '404.twig';
    }

    /**
     * @return string
     */
    private function getPluginTemplate(): string
    {
        $routeBlocks = explode('_', $this->getRouteName());
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
            $templates[] = sprintf('@%s/%s.twig', $routeBlocks[0], $routeBlocks[0]);
            $templates[] = sprintf('@%s/index.twig', $routeBlocks[0]);
        } elseif ($chunkCount < 3) {
            $templates[] = sprintf('@%s/%s.twig', $routeBlocks[0], $routeBlocks[1]);
            $templates[] = sprintf('@%s/%s/index.twig', $routeBlocks[0], $routeBlocks[1]);
        } else {
            $name = array_shift($routeBlocks);
            $nest = implode('/', $routeBlocks);
            $single = implode('_', $routeBlocks);
            $templates[] = sprintf('@%s/%s.twig', $name, $nest);
            $templates[] = sprintf('@%s/%s.twig', $name, $single);
        }
        return $this->getQueryTemplate('plugin', $templates);
    }

    /**
     * @return string
     */
    private function getIndexTemplate(): string
    {
        return $this->getQueryTemplate('index', ['@OctopusPressBundle/index.html.twig']);
    }

    /**
     * @param string $type
     * @param string[] $templates
     * @return string
     */
    private function getQueryTemplate(string $type, array $templates = []): string
    {
        if (empty($templates)) {
            $templates = ["$type.twig"];
        }
        $templates = $this->hook->filter($type . '_template_hierarchy', $templates);
        $themePath = $this->getThemePath();
        $template = '';
        foreach ($templates as $tpl) {
            if (str_starts_with($tpl, '@')) {
                if ($this->twig->getLoader()->exists($tpl)) {
                    $template = $tpl;
                    break;
                }
            }
            if ($this->twig->getLoader()->exists($themePath . $tpl)) {
                $template = $themePath . $tpl;
                break;
            }
        }
        return $this->hook->filter($type . '_template', $template, $type, $templates);
    }

    /**
     * @return void
     */
    public function registerFilter(): void
    {
        $filter = new ViewFilter($this);
        $filter->subscribe();
    }


    /**
     * @return void
     */
    private function registerGlobal(): void
    {
        $this->twig->addGlobal('now', time());
        foreach ($this->option->getDefaultOptions() as $name => $value) {
            $this->twig->addGlobal($name, $value);
        }
    }


    /**
     * @return string
     */
    private function getTitle(): string
    {
        $args = ['title' => '',];
        $siteName = $this->option->title();
        $routeName = $this->getRouteName();
        if (Helper::isHome($routeName)) {
            $args['title'] = $siteName;
        } elseif (Helper::isTaxonomy($routeName) || Helper::isTag($routeName) || Helper::isCategory($routeName)) {
            $args['title'] = $this->controllerResult instanceof TermTaxonomy
                ? $this->controllerResult->getTerm()?->getName()
                : '';
        } elseif (Helper::isSingle($routeName)) {
            $args['title'] = $this->controllerResult instanceof Post
                ? $this->controllerResult->getTitle()
                : '';
        }
        if (Helper::isHome($routeName)) {
            $args['subtitle'] = $this->option->subtitle();
        } else {
            $args['site'] = $siteName;
        }
        $sep = $this->hook->filter('title_separator', '-');
        return $this->hook->filter('title', implode(" $sep ", array_filter($args)));
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
        return $this->option->theme() . DIRECTORY_SEPARATOR;
    }

    /**
     * @return string
     */
    public function getRouteName(): string
    {
        return $this->getBridger()->getRequest()->attributes->get('_route');
    }

    /**
     * @return mixed
     */
    public function getControllerResult(): mixed
    {
        return $this->controllerResult;
    }

    /**
     * @return Bridger
     */
    public function getBridger(): Bridger
    {
        return $this->bridger;
    }
}
