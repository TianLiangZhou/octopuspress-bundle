<?php

namespace OctopusPress\Bundle\Widget;

use Traversable;

class Breadcrumb extends AbstractWidget implements \IteratorAggregate
{

    /**
     * @return Traversable
     */
    public function getIterator(): Traversable
    {
        // TODO: Implement getIterator() method.

        return new \ArrayIterator($this->items);
    }

    protected function template(): string
    {
        // TODO: Implement template() method.
        return  '';
    }

    protected function context(array $attributes = []): array
    {
        // TODO: Implement context() method.
        return [];
    }

    public function delayRegister(): void
    {
        // TODO: Implement registerForm() method.
        $this->setLabel("面包屑");
        $this->setIcon('arrowhead-right-outline');
    }
}
