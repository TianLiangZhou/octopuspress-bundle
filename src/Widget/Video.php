<?php

namespace OctopusPress\Bundle\Widget;

use OctopusPress\Bundle\Customize\AbstractControl;
use OctopusPress\Bundle\Customize\Control;
use OctopusPress\Bundle\Customize\ImageControl;
use OctopusPress\Bundle\Customize\MediaControl;
use OctopusPress\Bundle\Customize\Section;
use OctopusPress\Bundle\Entity\Post;
use Twig\TemplateWrapper;

class Video extends AbstractWidget
{

    protected function template(): string|TemplateWrapper
    {
        // TODO: Implement template() method.
        return <<<EOF
{% if video %}
<figure>
    <div>
        <video src="{{video.url}}"
            {% if loop %} loop {% endif %}
            {% if auto %} autoplay {% endif %}
            {% if mute %} muted {% endif %}
            {% if inline %} playsinline {% endif %}
            {% if back %} controls {% endif %}
            preload="{{preload}}"
            {% if poster %} poster="{{poster.url}}" {% endif %}
            ></video>
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
        $id = (int)($attributes['video'] ?? 0);
        $result = [
            'video' => null,
            'loop'  => (bool) ($attributes['loop'] ?? false),
            'auto'  => (bool) ($attributes['auto'] ?? false),
            'mute'  => (bool) ($attributes['mute'] ?? false),
            'back'  => (bool) ($attributes['back'] ?? false),
            'inline'  => (bool) ($attributes['inline'] ?? false),
            'description' => (string) ($attributes['description'] ?? ''),
            'poster' => null,
            'preload'=> (string) ($attributes['preload'] ?? 'none'),
        ];
        if ($id < 1) {
            return $result;
        }
        $video = $this->getBridger()
            ->getPostRepository()
            ->findOneBy([
                'id' => $id,
                'type' => Post::TYPE_ATTACHMENT,
            ]);
        if ($video == null) {
            return $result;
        }
        $result['video'] = $video->getAttachment();
        $result['video']['url'] = $this->getBridger()->getPackages()->getUrl($result['video']['url']);
        if (!empty($attributes['poster'])) {
            $image = $this->getBridger()
                ->getPostRepository()
                ->findOneBy([
                    'id' => (int)$attributes['poster'],
                    'type' => Post::TYPE_ATTACHMENT,
                ]);
            $result['poster'] = $image?->getAttachment();
            if ($result['poster']) {
                $result['poster']['url'] = $this->getBridger()->getPackages()->getUrl($result['poster']['url']);
            }
        }
        return $result;
    }

    public function delayRegister(): void
    {
        // TODO: Implement delayRegister() method.
        $this->setCategory('media');
        $this->setLabel('视频');
        $this->setIcon('video-outline');
        $section = new Section('media', [
            'label' => '视频',
        ]);
        $section->addControl(
            new MediaControl('video', [
                'label' => '选择视频',
                'type'  => AbstractControl::VIDEO,
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
        )->addControl(new Control('mute', [
                'label' => '静音',
                'type' => AbstractControl::SWITCH,
                'default' => false,
            ])
        )->addControl(new Control('back', [
                'label' => '回放控制',
                'type' => AbstractControl::SWITCH,
                'default' => true,
            ])
        )->addControl(new Control('inline', [
                'label' => '内联播放',
                'type' => AbstractControl::SWITCH,
                'default' => false,
            ])
        )->addControl(new Control('preload', [
                'label' => '预加载',
                'type' => AbstractControl::SELECT,
                'default' => 'none',
                'options' => [
                    ['label' => '无', 'value' => 'none'],
                    ['label' => '自动', 'value' => 'auto'],
                    ['label' => '元数据', 'value' => 'metadata'],
                ]
            ])
        )->addControl(new ImageControl('poster', [
                'label' => '海报图片',
            ])
        )->addControl(new Control('description', [
                'label' => '描述',
                'type' => AbstractControl::TEXTAREA,
            ])
        );
        $this->addSection($section);



    }
}
