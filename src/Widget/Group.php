<?php

namespace OctopusPress\Bundle\Widget;

use OctopusPress\Bundle\Customize\Control;
use OctopusPress\Bundle\Customize\Section;
use OctopusPress\Bundle\Scalable\Widget;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;
use Twig\TemplateWrapper;

class Group extends AbstractWidget
{

    /**
     * @throws SyntaxError
     * @throws RuntimeError
     * @throws LoaderError
     */
    protected function template(array $context = []): string|TemplateWrapper
    {
        // TODO: Implement template() method.

        $classNames = ['op-widget-group'];
        if (!empty($context['layout'])) {
            $classNames[] = match ($context['layout']) {
                "v" => "d-flex flex flex-col flex-column",
                "h" => "d-flex flex flex-row",
                "g" => "grid",
                default => "",
            };
        }
        if (!empty($context['alignment-x'])) {
            $classNames[] = match ($context['alignment-x']) {
                "s" => "justify-content-start justify-start",
                "c" => "justify-content-center justify-center",
                "e" => "justify-content-end justify-end",
                "bt"=> "justify-content-between justify-between",
                "ar"=> "justify-content-around justify-around",
                "ev"=> "justify-content-evenly justify-evenly",
                default => "",
            };
        }

        if (!empty($context['alignment-y'])) {
            $classNames[] = match ($context['alignment-y']) {
                "s" => "align-items-start items-start",
                "c" => "align-items-center items-center",
                "e" => "align-items-end items-end",
                default => "",
            };
        }
        if (!empty($context['className'])) {
            $classNames[] = $context['className'];
        }
        $className = implode(' ', $classNames);
        if (isset($context['backend_render']) && $context['backend_render']) {
            return $className;
        }
        $children = $this->renderChildren($this->getChildren());
        return <<<EOF
<div class="{$className}">
    {$children}
</div>
EOF;

    }

    /**
     * @throws SyntaxError
     * @throws RuntimeError
     * @throws LoaderError
     */
    protected function renderChildren(array $widgets = []): string
    {
        $widgetSupport = $this->getBridger()->getWidget();
        if (count($widgets) === 0) {
            return '';
        }
        $renders = [];
        foreach ($widgets as $data) {
            if (!$widgetSupport->exists($data['name'])) {
                continue;
            }
            $widget = $widgetSupport->get($data['name']);
            $widget->put($data['attributes'] ?? []);
            if (!empty($data['children'])) {
                $widget->setChildren($data['children']);
            }
            $renders[] = $widget->render();
        }
        return implode("\n", $renders);
    }

    protected function context(array $attributes = []): array
    {
        // TODO: Implement context() method.
        return [
            'layout' => $attributes['layout'] ?? '',
            'alignment-x' => $attributes['alignment-x'] ?? '',
            'alignment-y' => $attributes['alignment-y'] ?? '',
            'grid' => (int) ($attributes['grid'] ?? 0),
            'backend_render' => (bool) ($attributes['is_backend'] ?? false),
        ];
    }

    public function delayRegister(): void
    {
        // TODO: Implement delayRegister() method.
        $this->setCategory(Widget::DESIGN);
        $this->setLabel('群组');
        $this->setIcon('op-group');

        $section = new Section('heading', [
            'label' => '排版'
        ]);
        $alignmentX = Control::createSelect('alignment-x', '水平对齐', [
            'options' => [
                ['value' => 's', 'label' => '靠左'],
                ['value' => 'c', 'label' => '居中'],
                ['value' => 'e', 'label' => '靠右'],
                ['value' => 'bt', 'label' => '两端对齐'],
                ['value' => 'ar', 'label' => '两端相等'],
                ['value' => 'ev', 'label' => '两端均匀'],
            ],
        ]);
        $alignmentX->addDepend('layout', false, ['v', 'h']);
        $alignmentY = Control::createSelect('alignment-y', '垂直对齐', [
            'options' => [
                ['value' => 's', 'label' => '靠上'],
                ['value' => 'c', 'label' => '居中'],
                ['value' => 'e', 'label' => '靠下'],
            ],
        ]);
        $alignmentY->addDepend('layout', false, ['v', 'h']);


        $number = Control::createInput('grid', '网格', [
            'inputType' => 'number',
            'default' => 3,
        ]);
        $number->addDepend('layout', false, 'g');
        $section->addControl(
            Control::createSelect('layout', '排列', [
                'options' => [
                    ['value' => 'v', 'label' => '垂直'],
                    ['value' => 'h', 'label' => '水平'],
                    ['value' => 'g', 'label' => '网格'],
                ],
                'default' => 'v',
            ]),
        )->addControl($alignmentX)
        ->addControl($alignmentY)
        ->addControl($number);
        $this->addSection($section);
    }
}
