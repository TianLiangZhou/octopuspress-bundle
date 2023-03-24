<?php

namespace OctopusPress\Bundle\Event;

use OctopusPress\Bundle\Support\ActivatedRoute;
use Symfony\Component\HttpFoundation\Request;

class ViewRenderEvent extends OctopusEvent
{
    private array $context = [];

    private ActivatedRoute $activatedRoute;

    /**
     * @param Request $request
     * @param ActivatedRoute $activatedRoute
     */
    public function __construct(Request $request, ActivatedRoute $activatedRoute)
    {
        $this->setRequest($request);
        $this->activatedRoute = $activatedRoute;
    }

    /**
     * @return mixed
     */
    public function getControllerResult(): mixed
    {
        return $this->getRequest()->attributes->get('_controller_result');
    }

    /**
     * @return array
     */
    public function getContext(): array
    {
        return $this->context;
    }

    /**
     * @param array $context
     */
    public function setContext(array $context): void
    {
        $this->context = $context;
    }

    /**
     * @param string $key
     * @param mixed $value
     */
    public function addContext(string $key, mixed $value): void
    {
        $this->context[$key] = $value;
    }


    /**
     * @param string $key
     * @return bool
     */
    public function hasContext(string $key): bool
    {
        return isset($this->context[$key]);
    }

    /**
     * @return ActivatedRoute
     */
    public function getActivatedRoute(): ActivatedRoute
    {
        return $this->activatedRoute;
    }
}
