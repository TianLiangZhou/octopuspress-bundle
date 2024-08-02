<?php

namespace OctopusPress\Bundle\Widget;

use OctopusPress\Bundle\Customize\AbstractControl;
use OctopusPress\Bundle\Customize\Control;
use OctopusPress\Bundle\Customize\ImageControl;
use OctopusPress\Bundle\Customize\Section;
use OctopusPress\Bundle\Entity\Post;
use Twig\TemplateWrapper;

class Image extends AbstractWidget
{

    protected function template(array $context = []): string|TemplateWrapper
    {
        // TODO: Implement template() method.
        return <<<EOF
{% if image %}
<figure class="op-widget-image">
    <div>
        <img
            {% if rounded %} class="rounded-4" {% endif %}
            src="{{image.url}}"
            alt="{{alt}}"
            {%if width %} width="{{width}}" {% endif %}
            {%if height %} height="{{height}}" {% endif %}
             />
    </div>
    {% if description %}
    <figcaption>{{description}}</figcaption>
    {% endif %}
</figure.>
{% endif %}
EOF;

    }

    protected function context(array $attributes = []): array
    {
        // TODO: Implement context() method.
        $id = (int)($attributes['image'] ?? 0);
        $result = [
            'image' => null,
            'alt' => $attributes['alt'] ?? '',
            'width' => (int)($attributes['width'] ?? 0),
            'height' => (int)($attributes['height'] ?? 0),
            'rounded' => (bool)($attributes['rounded'] ?? false),
            'description' => (string) ($attributes['description'] ?? ''),
        ];
        if ($id < 1) {
            return $result;
        }
        $image = $this->getBridger()
            ->getPostRepository()
            ->findOneBy([
                'id' => $id,
                'type' => Post::TYPE_ATTACHMENT,
            ]);
        if ($image == null) {
            return $result;
        }
        $result['image'] = $image->getAttachment();
        $result['image']['url'] = $this->getBridger()->getPackages()->getUrl($result['image']['url']);
        return $result;
    }

    public function delayRegister(): void
    {
        // TODO: Implement delayRegister() method.
        $this->setCategory('media');
        $this->setLabel('图片');
        $this->setIcon('image-outline');
        $section = new Section('media', [
            'label' => '图像'
        ]);
        $section->addControl(
            new ImageControl('image', [
                'label' => '选择图像',
            ])
        );
        $this->addSection($section);
        $section = new Section('setting', [
            'label' => '设置'
        ]);
        $section->addControl(new Control('alt', [
                'type' => AbstractControl::TEXTAREA,
                'label' => 'ALT文本'
            ])
        )->addControl(new Control('rounded', [
                'type' => AbstractControl::SWITCH,
                'label' => '圆角'
            ])
        )->addControl(new Control('width', [
                'inputType' => 'number',
                'label' => '宽度'
            ])
        )->addControl(new Control('height', [
            'inputType' => 'number',
            'label' => '高度'
        ]));
        $this->addSection($section);
    }
}
