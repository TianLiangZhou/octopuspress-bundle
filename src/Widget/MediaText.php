<?php

namespace OctopusPress\Bundle\Widget;

use OctopusPress\Bundle\Customize\ImageControl;
use OctopusPress\Bundle\Customize\Section;
use Twig\TemplateWrapper;

class MediaText extends AbstractWidget
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
        $this->setCategory('media');
        $this->setLabel('媒体和文本');
        $this->setIcon('op-media-text');
        $section = new Section('media');
        $section->addControl(
            new ImageControl('image', [
                'label' => '选择图像',
            ])
        );
        $this->addSection($section);
    }
}
