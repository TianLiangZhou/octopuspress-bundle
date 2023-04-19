<?php
namespace OctopusPress\Bundle\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;
use Twig\TwigTest;

/**
 *
 */
class OctopusExtension extends AbstractExtension
{

    /**
     * @return array|TwigTest[]
     */
    public function getTests(): array
    {
        // TODO: Change the autogenerated stub
        return [
            new TwigTest('exist_option', [OctopusRuntime::class, 'exist']),
            new TwigTest('plugin_activated', [OctopusRuntime::class, 'isPluginActivated']),
        ];
    }

    /**
     * @return array|TwigFilter[]
     */
    public function getFilters(): array
    {
        // TODO: Change the autogenerated stub
        return [
            new TwigFilter('apply_filter', [OctopusRuntime::class, 'filter']),
        ];
    }

    /**
     * @return array|TwigFunction[]
     */
    public function getFunctions(): array
    {
        // TODO: Change the autogenerated stub
        return [
            new TwigFunction('hook_filter', [OctopusRuntime::class, 'hookFilter']),
            new TwigFunction('hook_action', [OctopusRuntime::class, 'action']),
            new TwigFunction('permalink', [OctopusRuntime::class, 'permalink']),
            new TwigFunction('compare_url', [OctopusRuntime::class, 'compareUrl']),

            new TwigFunction('get_option', [OctopusRuntime::class, 'getOption']),
            new TwigFunction('get_options', [OctopusRuntime::class, 'getOptions']),

            new TwigFunction('theme_mod', [OctopusRuntime::class, 'getThemeMod']),


            new TwigFunction('get_plugin', [OctopusRuntime::class, 'getPlugin']),

            new TwigFunction('thumbnail', [OctopusRuntime::class, 'thumbnail'], ['is_safe' => ['html']]),

            new TwigFunction('attachment', [OctopusRuntime::class, 'attachment']),
            new TwigFunction('attachments', [OctopusRuntime::class, 'attachments']),


            new TwigFunction('get_users', [OctopusRuntime::class, 'getUsers']),
            new TwigFunction('get_user', [OctopusRuntime::class, 'getUser']),

            new TwigFunction('taxonomies', [OctopusRuntime::class, 'taxonomies']),
            new TwigFunction('taxonomy', [OctopusRuntime::class, 'taxonomy']),

            new TwigFunction('sidebar', [OctopusRuntime::class, 'sidebar'], ['is_safe' => ['html']]),
            new TwigFunction('widget', [OctopusRuntime::class, 'widget'], ['is_safe' => ['html']]),

            new TwigFunction('get_post', [OctopusRuntime::class, 'getPost']),
            new TwigFunction('get_posts', [OctopusRuntime::class, 'getPosts']),
            new TwigFunction('get_taxonomy_posts', [OctopusRuntime::class, 'getTaxonomyPosts']),

            new TwigFunction('navigation', [OctopusRuntime::class, 'navigation'], ['is_safe' => ['html']]),
        ];
    }
}
