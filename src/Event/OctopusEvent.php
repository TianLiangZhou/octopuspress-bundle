<?php

namespace OctopusPress\Bundle\Event;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\EventDispatcher\Event;

class OctopusEvent extends Event
{
    const POST_SAVE_BEFORE = 'post.save.before';

    const POST_SAVE_AFTER = 'post.save.after';

    const POST_DELETE = 'post.delete';

    const POST_STATUS_UPDATE = 'post.status.update';

    const TAXONOMY_SAVE_AFTER = 'taxonomy.save.after';

    const TAXONOMY_DELETE = 'taxonomy.delete';

    const VIEW_RENDER = 'view.render';

    private ?Request $request = null;

    private ?Response $response = null;

    /**
     * @return Request|null
     */
    public function getRequest(): ?Request
    {
        return $this->request;
    }

    /**
     * @param Request|null $request
     */
    public function setRequest(?Request $request): void
    {
        $this->request = $request;
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
