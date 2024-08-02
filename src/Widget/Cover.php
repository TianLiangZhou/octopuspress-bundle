<?php

namespace OctopusPress\Bundle\Widget;

use OctopusPress\Bundle\Customize\ImageControl;
use OctopusPress\Bundle\Customize\Section;
use Twig\TemplateWrapper;

class Cover extends AbstractWidget
{

    protected function template(array $context = []): string|TemplateWrapper
    {
        // TODO: Implement template() method.
        return "";
    }

    protected function context(array $attributes = []): array
    {
        // TODO: Implement context() method.
        return [];
    }

    public function delayRegister(): void
    {
        // TODO: Implement delayRegister() method.
        $this->setCategory('media');
        $this->setLabel('封面');
        $this->setIcon('op-cover');
        $section = new Section('media', [
            'label' => '封面'
        ]);
        $section->addControl(
            new ImageControl('cover', [
                'label' => '选择封面',
            ])
        );
        $this->addSection($section);
    }
}
