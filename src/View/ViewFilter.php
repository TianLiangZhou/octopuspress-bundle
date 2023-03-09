<?php

namespace OctopusPress\Bundle\View;

use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Model\ViewManager;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Scalable\Hook;
use OctopusPress\Bundle\Twig\OctopusRuntime;
use OctopusPress\Bundle\Util\Helper;
use Symfony\Bridge\Twig\Extension\AssetExtension;
use Twig\Error\RuntimeError;

class ViewFilter
{
    private Hook $hook;
    private ViewManager $viewManager;
    private Bridger $bridger;

    public function __construct(ViewManager $viewManager)
    {
        $this->viewManager = $viewManager;
        $this->bridger = $this->viewManager->getBridger();
        $this->hook = $this->bridger->getHook();
    }

    /**
     * @return void
     */
    public function subscribe(): void
    {
        $priority = 255;
        $this->hook->add('body_class', [$this, 'getBodyClass'], $priority);
        $this->hook->add('head', [$this, 'head'], $priority);
        $this->hook->add('footer', [$this, 'footer'], $priority);

        $this->hook->add('custom_logo', [$this, 'customLogo'], $priority);
    }

    /**
     * @return void
     * @throws RuntimeError
     */
    public function head(): void
    {
        $this->siteIcon();
        /**
         * @var AssetExtension $extension
         */
        $extension = $this->bridger->getTwig()->getExtension(AssetExtension::class);
        $theme = $this->bridger->getTheme();
        if ($theme->isThemeSupport('bootstrap') || $theme->isThemeSupport('nebular')) {
            echo sprintf(
                '<link href="%s" rel="stylesheet" />',
                $extension->getAssetUrl('assets/css/bootstrap.css')
            );
        }
        if ($theme->isThemeSupport('nebular')) {
            $nebular = $theme->getThemeSupport('nebular');
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
                    $extension->getAssetUrl('assets/css/nebular/' . $themeName . '.css')
                );
            }
            echo sprintf(
                '<link href="%s" rel="stylesheet" />',
                $extension->getAssetUrl('assets/css/nebular/components.css')
            );
        }
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
        $theme = $this->bridger->getTheme();
        if ($theme->isThemeSupport('jQuery')) {
            echo sprintf(
                '<script src="%s" type="text/javascript"></script>',
                $extension->getAssetUrl('assets/js/jquery.js'),
            );
        }
        if ($theme->isThemeSupport('bootstrap')) {
            echo sprintf(
                '<script src="%s" type="text/javascript"></script>',
                $extension->getAssetUrl('assets/js/bootstrap.js'),
            );
        }
    }

    /**
     * @throws RuntimeError
     */
    public function siteIcon(): void
    {
        $option = $this->viewManager->getOption();
        $siteIcon = $option->siteIcon();
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
        $option = $this->viewManager->getOption();
        $customLogo = (int) $option->themeModuleFeature('custom_logo', $option->theme());
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
            $option->title(),
        );
    }

    /**
     * @return void
     * @throws RuntimeError
     */
    public function backgroundImage(): void
    {
        $option = $this->viewManager->getOption();
        $themeModules = $option->themeModules($option->theme());
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
        $routeName = $this->viewManager->getRouteName();
        if (Helper::isHome($routeName)) {
            $class[] = 'home';
        } elseif (Helper::isSingular($routeName)) {
            if ($this->viewManager->getControllerResult() instanceof Post) {
                $class[] = $this->viewManager->getControllerResult()->getType() . '-template';
            }
            if (Helper::isSingle($routeName)) {
                $class[] = 'single';
            }
            if (Helper::isPage($routeName)) {
                $class[] = 'page';
            }
        } elseif (Helper::isArchive($routeName)) {
            if ($this->viewManager->getControllerResult() instanceof TermTaxonomy) {
                $prefix = $this->viewManager->getControllerResult()->getTaxonomy();
                $class[] = $prefix;
                if (($term = $this->viewManager->getControllerResult()->getTerm())) {
                    $class[] = $prefix .'-'. $term->getSlug();
                }
            }
        } elseif (Helper::is404($routeName)) {
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
}
