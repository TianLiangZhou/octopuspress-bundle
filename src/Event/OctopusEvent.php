<?php

namespace OctopusPress\Bundle\Event;

use Symfony\Contracts\EventDispatcher\Event;

class OctopusEvent extends Event
{
    const POST_SAVE_BEFORE = 'post.save.before';


    const POST_SAVE_AFTER = 'post.save.after';


    const POST_DELETE = 'post.delete';


    const TAXONOMY_SAVE_BEFORE = 'taxonomy.save.before';


    const TAXONOMY_SAVE_AFTER = 'taxonomy.save.after';


    const TAXONOMY_DELETE = 'taxonomy.delete';

    const VIEW_RENDER = 'view.render';
}
