<?php

namespace OctopusPress\Bundle\Event;

use OctopusPress\Bundle\Entity\Post;

class PostStatusUpdateEvent extends OctopusEvent
{
    /**
     * @var Post[]
     */
    private array $posts;
    private string $status;

    public function __construct(array $posts, string $status)
    {
        $this->posts = $posts;
        $this->status = $status;
    }

    /**
     * @return string
     */
    public function getStatus(): string
    {
        return $this->status;
    }

    /**
     * @return array
     */
    public function getPosts(): array
    {
        return $this->posts;
    }

}
