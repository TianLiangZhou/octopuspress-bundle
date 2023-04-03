<?php

namespace OctopusPress\Bundle\Support;

use OctopusPress\Bundle\Scalable\Hook;
use Symfony\Component\HttpFoundation\RequestStack;

final class ActivatedRoute
{
    private RequestStack $requestStack;
    private Hook $hook;

    public function __construct(RequestStack $requestStack, Hook $hook)
    {
        $this->requestStack = $requestStack;
        $this->hook = $hook;
    }

    /**
     * @return bool
     */
    public function isHome(): bool
    {
        return $this->getRouteName() == 'home';
    }

    /***
     * @return bool
     */
    public function isTag(): bool
    {
        return $this->getRouteName() == 'tag';
    }

    /**
     * @return bool
     */
    public function isCategory(): bool
    {
        return $this->getRouteName() == 'category';
    }

    /**
     * @return bool
     */
    public function isTaxonomy(): bool
    {
        return $this->getRouteName() == 'taxonomy';
    }

    /**
     * @return bool
     */
    public function isAuthor(): bool
    {
        return $this->getRouteName() == 'author';
    }

    /**
     * @return bool
     */
    public function isArchive(): bool
    {
        return $this->getRouteName() == 'archives';
    }

    /**
     * @return bool
     */
    public function isArchives(): bool
    {
        return self::isTaxonomy() || self::isTag() || self::isCategory() || self::isAuthor() || self::isArchive();
    }

    /**
     * @return bool
     */
    public function isInstalled(): bool
    {
        return $this->getRouteName() == 'install';
    }

    /**
     * @return bool
     */
    public function isSingular(): bool
    {
        return in_array($this->getRouteName(), [
            'post_permalink_normal', 'post_permalink_number','post_permalink_date', 'post_permalink_name', 'page'
        ]);
    }

    /**
     * @return bool
     */
    public function isSingle(): bool
    {
        return in_array($this->getRouteName(), [
            'post_permalink_normal', 'post_permalink_number','post_permalink_date', 'post_permalink_name'
        ]);
    }

    /**
     * @return bool
     */
    public function isPage(): bool
    {
        return $this->getRouteName() == 'page';
    }

    public function is404(): bool
    {
        return $this->getRouteName() == 'error404';
    }

    /**
     * @return bool
     */
    public function isDashboard(): bool
    {
        return str_starts_with($this->getRouteName(), 'backend_');
    }

    /**
     * @return bool
     */
    public function isPlugin(): bool
    {
        return str_starts_with($this->getRouteName(), 'plugin_') || str_starts_with($this->getRouteName(), 'octopus_plugin_');
    }

    /**
     * @return bool
     */
    public function isDashboardPlugin(): bool
    {
        return str_starts_with($this->getRouteName(), 'backend_plugin_');
    }

    /**
     * @return string
     */
    public function getRouteName(): string
    {
        return $this->requestStack->getMainRequest()->attributes->get('_route') ?? '';
    }
}
