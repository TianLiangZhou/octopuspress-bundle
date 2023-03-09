<?php

namespace OctopusPress\Bundle\Widget;

use Stringable;

interface WidgetInterface extends Stringable
{
    public function render(): string;
}
