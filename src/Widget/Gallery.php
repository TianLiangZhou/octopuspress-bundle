<?php

namespace OctopusPress\Bundle\Widget;

use OctopusPress\Bundle\Customize\ImageControl;
use OctopusPress\Bundle\Customize\Section;
use Twig\TemplateWrapper;

class Gallery extends AbstractWidget
{

    protected function template(): string|TemplateWrapper
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
        $this->setLabel('图库');
        $this->setIcon('fa-images');
        $section = new Section('media', [
            'label' => '图库'
        ]);
        $section->addControl(
            new ImageControl('gallery', [
                'label' => '选择图像',
                'multiple' => true,
            ])
        );
        $this->addSection($section);
    }
}
