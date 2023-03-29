<?php

namespace OctopusPress\Bundle\Event;

use OctopusPress\Bundle\Entity\Post;

class PostEvent extends OctopusEvent
{
    private Post $post;
    private string $oldStatus;

    public function __construct(Post $post, string $oldStatus)
    {
        $this->post = $post;
        $this->oldStatus = $oldStatus;
    }

    /**
     * @return Post
     */
    public function getPost(): Post
    {
        return $this->post;
    }

    /**
     * @return string
     */
    public function getOldStatus(): string
    {
        return $this->oldStatus;
    }
}
