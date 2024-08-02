<?php

namespace OctopusPress\Bundle\Widget;

class SiteLogo extends AbstractWidget
{

    protected function template(array $context = []): string
    {
        $option = $this->getBridger()->getOptionRepository();
        $title  = $option->title();
        $siteUrl= $option->siteUrl();
        return <<<EOF
<div class="op-widget-site-logo">
    <a href="$siteUrl">$title</a>
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
        // TODO: Implement registerForm() method.
        $this->setCategory('theme');
        $this->setLabel("自定义Logo");
    }
}
