<?php

namespace OctopusPress\Bundle\Widget;

use OctopusPress\Bundle\Customize\AbstractControl;
use OctopusPress\Bundle\Customize\Control;
use OctopusPress\Bundle\Customize\Section;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Twig\OctopusRuntime;
use Twig\Error\RuntimeError;

class LatestComments extends AbstractWidget
{

    protected function template(): string
    {
        // TODO: Implement template() method.
        return <<<EOF

EOF;
    }

    protected function context(array $attributes = []): array
    {
        // TODO: Implement context() method.
        return [];
    }

    public function delayRegister(): void
    {
        // TODO: Implement delayRegister() method.
        $this->setLabel("近期评论");
        $this->setIcon('message-circle-outline');
    }
}
