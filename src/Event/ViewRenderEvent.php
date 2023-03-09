<?php

namespace OctopusPress\Bundle\Event;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ViewRenderEvent extends OctopusEvent
{
    private string $routeName;
    /**
     * @var mixed|null
     */
    private mixed $controllerResult;

    private array $context = [];

    private ?Response $response = null;

    private Request $request;

    /**
     * @param Request $request
     * @param mixed|null $controllerResult
     */
    public function __construct(Request $request, mixed $controllerResult = null)
    {
        $this->request = $request;
        $this->routeName = $request->attributes->get('_route');
        $this->controllerResult = $controllerResult;
    }

    /**
     * @return mixed
     */
    public function getControllerResult(): mixed
    {
        return $this->controllerResult;
    }

    /**
     * @return string
     */
    public function getRouteName(): string
    {
        return $this->routeName;
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
     * @return Response|null
     */
    public function getResponse(): ?Response
    {
        return $this->response;
    }

    /**
     * @param Response $response
     */
    public function setResponse(Response $response): void
    {
        $this->response = $response;
    }

    /**
     * @return bool
     */
    public function hasResponse(): bool
    {
        return $this->response !== null;
    }
}
