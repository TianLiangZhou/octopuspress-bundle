<?php

namespace OctopusPress\Bundle\Widget;

use OctopusPress\Bundle\Customize\AbstractControl;
use OctopusPress\Bundle\Customize\Control;
use OctopusPress\Bundle\Customize\Section;
use OctopusPress\Bundle\Entity\TermTaxonomy;

class Categories extends AbstractWidget
{

    protected function template(array $context = []): string
    {
        // TODO: Implement template() method.
        return <<<EOF
<ul  class="op-widget-categories">
{% for item in categories %}
    {% set c = item.getCount() %}
    {% if c > 0 or displayEmpty %}
    <li class="categories-item">
        <a href="{{ permalink(item) }}">{{item.name}}</a>
        {% if displayCount and c > 0 %}
        <span>({{c}})</span>
        {% endif %}
    </li>
    {% endif %}
    {% else %}
    <li class="categories-item">无记录</li>
{% endfor %}
</ul>
EOF;
    }

    protected function context(array $attributes = []): array
    {
        // TODO: Implement context() method.
        $taxonomy = $this->getBridger()->getTaxonomyRepository();

        $filters = [];
        if (isset($attributes['top']) && $attributes['top']) {
            $filters['parent'] = null;
        }
        return [
            'categories' => $taxonomy->taxonomies(TermTaxonomy::CATEGORY, $filters),
            'displayCount' => (bool) ($attributes['display_count'] ?? false),
            'displayEmpty' => (bool) ($attributes['display_empty'] ?? false),
        ];
    }

    public function delayRegister(): void
    {
        // TODO: Implement registerForm() method.
        $this->setLabel('分类列表')
            ->setIcon('grid-outline')
        ;
        $section = new Section('setting', [
            'label' => '设置',
        ]);
        $section->addControl(new Control('display_count', [
            'label' => '显示文章数目',
            'type'  => AbstractControl::SWITCH,
        ]));

        $section->addControl(new Control('top', [
            'label' => '仅显示顶级分类',
            'type'  => AbstractControl::SWITCH,
        ]));

        $section->addControl(new Control('display_empty', [
            'label' => '显示空分类',
            'type'  => AbstractControl::SWITCH,
        ]));
        $this->addSection($section);
    }
}
