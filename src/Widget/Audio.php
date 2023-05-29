<?php

namespace OctopusPress\Bundle\Widget;

use OctopusPress\Bundle\Customize\AbstractControl;
use OctopusPress\Bundle\Customize\Control;
use OctopusPress\Bundle\Customize\MediaControl;
use OctopusPress\Bundle\Customize\Section;
use OctopusPress\Bundle\Entity\Post;
use Twig\TemplateWrapper;

class Audio extends AbstractWidget
{

    protected function template(): string|TemplateWrapper
    {
        // TODO: Implement template() method.
        return <<<EOF
{% if audio %}
<figure>
    <div>
        <audio src="{{audio.url}}" {% if loop %} loop {% endif %} {% if auto %} autoplay {% endif %} controls></audio>
    </div>
    {% if description %}
        <figcaption>{{description}}</figcaption>
    {% endif %}
</figure>
{% endif %}
EOF;

    }

    protected function context(array $attributes = []): array
    {
        // TODO: Implement context() method.
        $id = (int)($attributes['audio'] ?? 0);
        $result = [
            'audio' => null,
            'loop'  => (bool) ($attributes['loop'] ?? false),
            'auto'  => (bool) ($attributes['auto'] ?? false),
            'description' => (string) ($attributes['description'] ?? ''),
        ];
        if ($id < 1) {
            return $result;
        }
        $audio = $this->getBridger()
            ->getPostRepository()
            ->findOneBy([
                'id' => $id,
                'type' => Post::TYPE_ATTACHMENT,
            ]);
        if ($audio == null) {
            return $result;
        }
        $result['audio'] = $audio->getAttachment();
        $result['audio']['url'] = $this->getBridger()->getPackages()->getUrl($result['audio']['url']);
        return $result;
    }

    public function delayRegister(): void
    {
        // TODO: Implement delayRegister() method.
        $this->setCategory('media');
        $this->setLabel('音频');
        $this->setIcon('music-outline');
        $section = new Section('media', [
            'label' => '声音'
        ]);
        $section->addControl(
            new MediaControl('audio', [
                'label' => '选择音频',
                'type' => AbstractControl::AUDIO,
            ])
        );
        $this->addSection($section);
        $section = new Section('setting', [
            'label' => '设置'
        ]);
        $section->addControl(new Control('auto', [
                'label' => '自动播放',
                'type' => AbstractControl::SWITCH,
                'default' => false,
            ])
        )->addControl(new Control('loop', [
                'label' => '循环',
                'type' => AbstractControl::SWITCH,
                'default' => false,
            ])
        )->addControl(new Control('description', [
                'label' => '描述',
                'type' => AbstractControl::TEXTAREA,
            ])
        );

        $this->addSection($section);
    }
}
