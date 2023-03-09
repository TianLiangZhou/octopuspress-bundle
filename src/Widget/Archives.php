<?php

namespace OctopusPress\Bundle\Widget;

class Archives extends AbstractWidget
{

    protected function template(): string
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
        // TODO: Implement registerForm() method.
        $this->setLabel('归档');
        $this->setIcon('archive-outline');
    }
}
