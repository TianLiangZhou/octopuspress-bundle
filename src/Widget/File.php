<?php

namespace OctopusPress\Bundle\Widget;

use OctopusPress\Bundle\Customize\AbstractControl;
use OctopusPress\Bundle\Customize\Control;
use OctopusPress\Bundle\Customize\MediaControl;
use OctopusPress\Bundle\Customize\Section;
use OctopusPress\Bundle\Entity\Post;
use Twig\TemplateWrapper;

class File extends AbstractWidget
{

    protected function template(): string|TemplateWrapper
    {
        // TODO: Implement template() method.
        return <<<EOF
{% if file %}
    <a
    class=""
    href="{% if link %}{{permalink(file)}}{%else%}{{attachment.url}}{% endif %}"
    {% if blank %} target="_blank" {% endif %}
    >{{ attachment.title }}</a>
    {% if download %}
        <a class="" href="{{attachment.url}}">下载</a>
    {%endif %}
{% endif %}
EOF;

    }

    protected function context(array $attributes = []): array
    {
        // TODO: Implement context() method.
        $id = (int)($attributes['file'] ?? 0);
        $result = [
            'file' => null,
            'attachment' => null,
            'link'   => (bool) ($attributes['link'] ?? false),
            'blank' => (bool) ($attributes['blank'] ?? false),
            'download' => (bool) ($attributes['download'] ?? false),
        ];
        if ($id < 1) {
            return $result;
        }
        $file = $this->getBridger()
            ->getPostRepository()
            ->findOneBy([
                'id' => $id,
                'type' => Post::TYPE_ATTACHMENT,
            ]);
        if ($file == null) {
            return $result;
        }
        $result['file'] = $file;
        $result['attachment'] = $file->getAttachment();
        $result['attachment']['url'] = $this->getBridger()->getPackages()->getUrl($result['attachment']['url']);
        return $result;
    }

    public function delayRegister(): void
    {
        // TODO: Implement delayRegister() method.
        $this->setCategory('media');
        $this->setLabel('文件');
        $this->setIcon('file-outline');
        $section = new Section('media', [
            'label' => '文件'
        ]);
        $section->addControl(
            new MediaControl('file', [
                'label' => '选择文件',
                'type'  => AbstractControl::FILE
            ])
        );
        $this->addSection($section);

        $section = new Section('setting', [
            'label' => '设置'
        ]);

        $section->addControl(
            new Control('link', [
                'label' => '链接到附件页',
                'type'  => AbstractControl::SWITCH,
                'default' => false,
            ])
        );
        $section->addControl(
            new Control('blank', [
                'label' => '新窗打开',
                'type'  => AbstractControl::SWITCH,
                'default' => false,
            ])
        );
        $section->addControl(
            new Control('download', [
                'label' => '显示下载',
                'type'  => AbstractControl::SWITCH,
                'default' => false,
            ])
        );
        $this->addSection($section);
    }
}
