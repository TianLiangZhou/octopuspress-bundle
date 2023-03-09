<?php

namespace OctopusPress\Bundle\Event;

use OctopusPress\Bundle\Entity\Post;

class PostEvent extends OctopusEvent
{
    private Post $post;

    public function __construct(Post $post)
    {
        $this->post = $post;
    }

    /**
     * @return Post
     */
    public function getPost(): Post
    {
        return $this->post;
    }
}
