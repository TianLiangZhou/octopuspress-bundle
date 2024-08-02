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
        return str_starts_with($this->getRouteName(), 'taxonomy_');
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
    public function isSearch(): bool
    {
        return $this->getRouteName() == 'search';
    }

    public function isProfile(): bool
    {
        return $this->getRouteName() == 'user_profile';
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
        return $this->isSingle() || $this->getRouteName() == 'page';
    }

    /**
     * @return bool
     */
    public function isSingle(): bool
    {
        return str_starts_with($this->getRouteName(), 'post_permalink_');
    }

    /**
     * @return bool
     */
    public function isPage(): bool
    {
        return $this->getRouteName() == 'page';
    }

    /**
     * @return bool
     */
    public function isSignIn(): bool
    {
        return $this->getRouteName() == 'sign_in';
    }

    /**
     * @return bool
     */
    public function isSignUp(): bool
    {
        return $this->getRouteName() == 'sign_up';
    }

    /**
     * @return bool
     */
    public function isForgot(): bool
    {
        return $this->getRouteName() == 'forgot';
    }

    /**
     * @return bool
     */
    public function isReset(): bool
    {
        return $this->getRouteName() == 'reset';
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
        $request = $this->requestStack->getCurrentRequest();
        return $request->attributes->get('_route') ?? '';
    }
}
