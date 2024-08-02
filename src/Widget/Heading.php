<?php

namespace OctopusPress\Bundle\Widget;

use OctopusPress\Bundle\Customize\Control;
use OctopusPress\Bundle\Customize\Section;
use OctopusPress\Bundle\Scalable\Widget;
use Twig\TemplateWrapper;

class Heading extends AbstractWidget
{

    protected function template(array $context = []): string|TemplateWrapper
    {
        // TODO: Implement template() method.
        $tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        $tag = in_array($context['size'] ?? '', $tags) ? $context['size'] : 'h2';
        return sprintf('<%s class="%s">%s</%s>', $tag, "op-widget-heading", $context['title'] ?? '', $tag);
    }

    protected function context(array $attributes = []): array
    {
        // TODO: Implement context() method.
        return [
            'size' => $attributes['size'] ?? 'h1',
            'title' => $attributes['title'] ?? '输入标题',
        ];
    }

    public function delayRegister(): void
    {
        // TODO: Implement delayRegister() method.
        $this->setCategory(Widget::TEXT);
        $this->setLabel('标题');
        $this->setIcon('op-heading');

        $section = new Section('heading', [
            'label' => '排版'
        ]);
        $section->addControl(
            Control::createSelect('size', '尺寸', [
                'options' => [
                    ['value' => 'h1', 'label' => 'H1'],
                    ['value' => 'h2', 'label' => 'H2'],
                    ['value' => 'h3', 'label' => 'H3'],
                    ['value' => 'h4', 'label' => 'H4'],
                    ['value' => 'h5', 'label' => 'H5'],
                    ['value' => 'h6', 'label' => 'H6'],
                ]
            ]),
        )->addControl(
            Control::createInput('title', '标题')
        )
        ;
        $this->addSection($section);
    }
}
