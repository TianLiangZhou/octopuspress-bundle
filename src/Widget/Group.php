<?php

namespace OctopusPress\Bundle\Widget;

use Twig\TemplateWrapper;

class Group extends AbstractWidget
{

    protected function template(): string|TemplateWrapper
    {
        // TODO: Implement template() method.
        return <<<EOF
<div class="widget-group">


</div>
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
        $this->setLabel('挂件组');
        $this->setIcon('copy-outline')
        ;
        $this->setCategory('widgets');
    }
}
