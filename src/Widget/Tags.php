<?php

namespace OctopusPress\Bundle\Widget;

use OctopusPress\Bundle\Customize\AbstractControl;
use OctopusPress\Bundle\Customize\Control;
use OctopusPress\Bundle\Customize\Section;
use OctopusPress\Bundle\Entity\TermTaxonomy;

class Tags extends AbstractWidget
{

    protected function template(): string
    {
        // TODO: Implement template() method.
        return <<<EOF
<ul class="tags-list">
{% for item in tags %}
    <li class="tags-list-item">
        <a href="{{permalink(item)}}">{{item.getName()}}{% if displayCount and c > 0 %}<span>({{c}})</span>{% endif %}</a>
    </li>
{% endfor %}
</ul>
EOF;

    }

    protected function context(array $attributes = []): array
    {
        // TODO: Implement context() method.
        $results = [
            'tags' => [],
            'displayCount' => (bool) ($attributes['display_count'] ?? false),
        ];
        $results['tags'] = $this->getBridger()->getTaxonomyRepository()->taxonomies(
            TermTaxonomy::TAG,
            [],
            (int) ($attributes['count'] ?? 50)
        );
        return $results;
    }

    public function delayRegister(): void
    {
        // TODO: Implement registerForm() method.
        $this->setLabel('标签云');
        $this->setIcon('pricetags-outline');
        $section = new Section('setting', [
            'label' => '设置'
        ]);
        $section->addControl(new Control('box', [
            'label' => '显示边框轮廓',
            'type'  => AbstractControl::SWITCH,
        ]));

        $section->addControl(new Control('display_count', [
            'label' => '显示文章数目',
            'type'  => AbstractControl::SWITCH,
        ]));


        $section->addControl(new Control('count', [
            'label' => '最大数量',
            'type'  => AbstractControl::INPUT,
            'inputType' => 'number',
            'default' => 50,
        ]));

        $this->addSection($section);
    }
}
