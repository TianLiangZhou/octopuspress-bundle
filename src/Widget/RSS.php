<?php

namespace OctopusPress\Bundle\Widget;

use Twig\TemplateWrapper;

class RSS extends AbstractWidget
{

    protected function template(array $context = []): string|TemplateWrapper
    {
        // TODO: Implement template() method.
        return '';
    }

    protected function context(array $attributes = []): array
    {
        // TODO: Implement context() method.
        return [];
    }

    public function delayRegister(): void
    {
        // TODO: Implement delayRegister() method.
        $this->setLabel('RSS');
        $this->setIcon('op-rss');
    }
}
