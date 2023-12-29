<?php

namespace OctopusPress\Bundle\Support;

use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Scalable\Hook;
use OctopusPress\Bundle\Twig\OctopusRuntime;
use Symfony\Bridge\Twig\Extension\AssetExtension;
use Twig\Error\RuntimeError;

final class DefaultViewFilter
{
    private Hook $hook;
    private Bridger $bridger;
    private OptionRepository $option;
    private bool $isSubscribed = false;

    public function __construct(Bridger $bridger)
    {
        $this->bridger = $bridger;
        $this->hook = $bridger->getHook();
    }

    /**
     * @return void
     */
    public function subscribe(): void
    {
        if ($this->isSubscribed) {
            return;
        }
        $this->isSubscribed = true;
        $this->option = $this->bridger->getOptionRepository();
        $priority = 64;
        $this->hook->add('head', [$this, 'getTitleTag'], $priority);
        $this->hook->add('head', [$this, 'getSiteIcon'], $priority);
        $this->hook->add('head', [$this, 'getThemeSupport'], $priority);
        $this->hook->add('body_class', [$this, 'getBodyClass'], $priority);
        $this->hook->add('custom_logo', [$this, 'customLogo'], $priority);
        $this->hook->add('footer', [$this, 'footer'], $priority);
    }

    /**
     * @return void
     */
    public function getTitleTag(): void
    {
        $args = ['title' => '',];
        $siteName = $this->option->title();
        $controllerResult = $this->getControllerResult();
        $activatedRoute = $this->getActivatedRoute();
        if ($activatedRoute->isHome()) {
            $args['title'] = $siteName;
        } elseif ($activatedRoute->isArchives()) {
            if ($controllerResult instanceof ArchiveDataSet) {
                $taxonomy = $controllerResult->getArchiveTaxonomy();
                if ($taxonomy instanceof TermTaxonomy) {
                    $args['title'] = $taxonomy->getTerm()->getName();
                } elseif ($taxonomy instanceof User) {
                    $args['title'] = $taxonomy->getNickname() . '作品';
                } else {
                    $args['title'] = $taxonomy->title ?? '';
                }
            }
        } elseif ($activatedRoute->isSingle()) {
            $args['title'] = $controllerResult instanceof Post
                ? $controllerResult->getTitle()
                : '';
        }
        if ($activatedRoute->isHome()) {
            $args['subtitle'] = $this->option->subtitle();
        } else {
            $args['site'] = $siteName;
        }
        $sep = $this->hook->filter('document_title_separator', '-');
        $args = $this->hook->filter('document_title_parts', $args);
        $title = implode(" $sep ", array_filter($args));
        echo sprintf('<title>%s</title>', $this->hook->filter('document_title', $title, $sep) );
    }
    /**
     * @return void
     * @throws RuntimeError
     */
    public function getThemeSupport(): void
    {
        /**
         * @var AssetExtension $extension
         */
        $extension = $this->bridger->getTwig()->getExtension(AssetExtension::class);

        // echo site base css
        echo sprintf(
            '<link href="%s" rel="stylesheet" />',
            $extension->getAssetUrl('bundles/octopuspress/css/base.css')
        );

        $themeExtension = $this->bridger->getTheme();
        if ($themeExtension->isThemeSupport('bootstrap') || $themeExtension->isThemeSupport('nebular')) {
            echo sprintf(
                '<link href="%s" rel="stylesheet" />',
                $extension->getAssetUrl('bundles/octopuspress/css/bootstrap.css')
            );
        }
        if ($themeExtension->isThemeSupport('nebular')) {
            $nebular = $themeExtension->getThemeSupport('nebular');
            $themes = ['default'];
            if (isset($nebular['theme'])) {
                $themes = is_array($nebular['theme']) ? $nebular['theme'] : [$nebular['theme']];
            }
            foreach ($themes as $themeName) {
                if (!in_array($themeName, ['default', 'dark', 'cosmic', 'corporate'])) {
                    continue;
                }
                echo sprintf(
                    '<link href="%s" rel="stylesheet" />',
                    $extension->getAssetUrl('bundles/octopuspress/css/nebular/' . $themeName . '.css')
                );
            }
            echo sprintf(
                '<link href="%s" rel="stylesheet" />',
                $extension->getAssetUrl('bundles/octopuspress/css/nebular/components.css')
            );
        }
        if ($themeExtension->isThemeSupport('prismjs')) {
            echo sprintf(
                '<link href="%s" rel="stylesheet" id="%s" />',
                $extension->getAssetUrl('bundles/octopuspress/css/prism.css'),
                'prismjs'
            );
        }
        $this->importThemeStyle($this->option->theme());
        $this->backgroundImage();
    }



    /**
     * @return void
     */
    public function footer(): void
    {
        /**
         * @var AssetExtension $extension
         */
        $extension = $this->bridger->getTwig()->getExtension(AssetExtension::class);
        // The to base js
        echo sprintf(
            '<script src="%s" type="text/javascript"></script>',
            $extension->getAssetUrl('bundles/octopuspress/js/base.js'),
        );

        $theme = $this->bridger->getTheme();
        if ($theme->isThemeSupport('jQuery')) {
            echo sprintf(
                '<script src="%s" type="text/javascript"></script>',
                $extension->getAssetUrl('bundles/octopuspress/js/jquery.js'),
            );
        }
        if ($theme->isThemeSupport('bootstrap')) {
            echo sprintf(
                '<script src="%s" type="text/javascript"></script>',
                $extension->getAssetUrl('bundles/octopuspress/js/bootstrap.js'),
            );
        }
        if ($theme->isThemeSupport('prismjs')) {
            echo sprintf(
                '<script src="%s" type="text/javascript"></script>',
                $extension->getAssetUrl('bundles/octopuspress/js/prismjs.js'),
            );
        }
        if ($theme->isThemeSupport('alpine')) {
            echo sprintf(
                '<script src="%s" type="text/javascript"></script>',
                $extension->getAssetUrl('bundles/octopuspress/js/alpinejs.js'),
            );
        }
        $this->importThemeScript($this->option->theme());
    }

    /**
     * @throws RuntimeError
     */
    public function getSiteIcon(): void
    {
        $siteIcon = $this->option->siteIcon();
        if ($siteIcon < 0) {
            return ;
        }
        $attachment = $this->attachment($siteIcon);
        if (empty($attachment)) {
            return ;
        }
        if (str_ends_with($attachment['url'], '.ico')) {
            echo sprintf('<link rel="shortcut icon" href="%s" />', $attachment['url']);
        } else {
            echo sprintf('<link rel="shortcut icon" type="%s" href="%s" />', $attachment['mime_type'], $attachment['url']);
        }
    }

    /**
     * @return void
     * @throws RuntimeError
     */
    public function customLogo(): void
    {
        $theme = $this->bridger->getTheme();
        if (!$theme->isThemeSupport('custom_logo')) {
            return ;
        }
        $customLogo = (int) $this->option->themeModuleFeature('custom_logo', $this->option->theme());
        if ($customLogo < 1) {
            return ;
        }
        $attachment = $this->attachment($customLogo);
        if (empty($attachment) || empty($attachment['url'])) {
            return ;
        }
        $supports = $theme->getThemeSupport('custom_logo');
        echo sprintf(
            '<img src="%s" width="%d" height="%d" alt="%s" />',
            $attachment['url'],
            (int) ($supports['width'] ?? 100),
            (int) ($supports['height'] ?? 100),
            $this->option->title(),
        );
    }

    /**
     * @return void
     * @throws RuntimeError
     */
    private function backgroundImage(): void
    {
        $themeModules = $this->option->themeModules($this->option->theme());
        if (!isset($themeModules['background_image']) || empty(($imageId = $themeModules['background_image']))) {
            return ;
        }
        $attachment = $this->attachment((int) $imageId);
        $attributes = [
            sprintf('background-image: url("%s");', $attachment['url']),
        ];
        if (!empty($themeModules['background_preset'])) {
            switch ($themeModules['background_preset']) {
                case 'auto':
                case 'repeat':
                    $attributes[] = 'background-size: auto;';
                    $attributes[] = 'background-repeat: repeat;';
                    break;
                default:
                    $attributes[] = sprintf('background-size: %s;', $themeModules['background_preset']);
            }
        }
        if (!empty($themeModules['background_position'])) {
            switch ($themeModules['background_position']) {
                case 'top':
                case 'bottom':
                case 'left':
                case 'right':
                case 'center':
                    $attributes[] = sprintf('background-position: %s;', $themeModules['background_position']);
                    break;
                default:
                    [$x, $y] = explode(' ', $themeModules['background_position']);
                    $attributes[] = sprintf('background-position-x: %s;', $x);
                    $attributes[] = sprintf('background-position-y: %s;', $y);
                    break;
            }
        }
        $css = implode(
            '',
            $attributes
        );
        echo <<<EOF
<style>
body { $css }
</style>
EOF;
    }

    /**
     * @param string $theme
     * @return void
     */
    private function importThemeStyle(string $theme): void
    {
        if (!$theme) {
            return ;
        }
        /**
         * @var AssetExtension $extension
         */
        $extension = $this->bridger->getTwig()->getExtension(AssetExtension::class);
        $templateDir = $this->bridger->getTemplateDir();
        $names = $this->hook->filter('load_theme_resource_names', ['common', 'main', 'index', $theme]);
        foreach ($names as $name) {
            $file = sprintf('%s/%s/css/%s.css', $templateDir, $theme, $name);
            if (file_exists($file)) {
                echo sprintf(
                    '<link href="%s" rel="stylesheet" />',
                    $extension->getAssetUrl('css/' . $name . '.css', 'theme')
                );
            }
        }
    }

    /**
     * @param string $theme
     * @return void
     */
    private function importThemeScript(string $theme): void
    {
        if (!$theme) {
            return ;
        }
        /**
         * @var AssetExtension $extension
         */
        $extension = $this->bridger->getTwig()->getExtension(AssetExtension::class);
        $templateDir = $this->bridger->getTemplateDir();
        $names = $this->hook->filter('load_theme_resource_names', ['common', 'main', 'index', $theme]);
        foreach ($names as $name) {
            $file = sprintf('%s/%s/js/%s.js', $templateDir, $theme, $name);
            if (file_exists($file)) {
                echo sprintf(
                    '<script type="text/javascript" src="%s"></script>',
                    $extension->getAssetUrl('js/' . $name . '.js', 'theme')
                );
            }
        }
    }

    /**
     * @param string[]|null $class
     * @return string[]
     */
    public function getBodyClass(?array $class): array
    {
        if ($class === null) {
            $class = [];
        }
        $theme = $this->bridger->getTheme();
        if ($theme->isThemeSupport('nebular')) {
            $class[] = 'nb-theme-default';
        }
        $route = $this->getActivatedRoute();
        $controllerResult = $this->getControllerResult();
        if ($route->isHome()) {
            $class[] = 'home';
        } elseif ($route->isSingular()) {
            if ($controllerResult instanceof Post) {
                $class[] = $controllerResult->getType() . '-template';
            }
            if ($route->isSingle()) {
                $class[] = 'single';
            }
            if ($route->isPage()) {
                $class[] = 'page';
            }
        } elseif ($route->isArchive()) {
            if ($controllerResult instanceof ArchiveDataSet) {
                $taxonomy = $controllerResult->getArchiveTaxonomy();
                if ($taxonomy instanceof TermTaxonomy) {
                    $prefix = $taxonomy->getTaxonomy();
                    $class[] = $prefix;
                    if (($term = $taxonomy->getTerm())) {
                        $class[] = $prefix .'-'. $term->getSlug();
                    }
                } elseif ($taxonomy instanceof User) {
                    $class[] = 'author';
                }
            }
            $class[] = 'archive';
        } elseif ($route->is404()) {
            $class[] = 'error404';
        }
        return $class;
    }

    /**
     * @param int $attachmentId
     * @return array|null
     * @throws RuntimeError
     */
    private function attachment(int $attachmentId): ?array
    {
        /**
         * @var OctopusRuntime $entityRuntime
         */
        $entityRuntime = $this->bridger->getTwig()->getRuntime(OctopusRuntime::class);
        return $entityRuntime->attachment($attachmentId);
    }

    /**
     * @return ActivatedRoute
     */
    private function getActivatedRoute(): ActivatedRoute
    {
        return $this->bridger->getActivatedRoute();
    }

    /**
     * @return mixed
     */
    private function getControllerResult(): mixed
    {
        return $this->bridger->getControllerResult();
    }
}
