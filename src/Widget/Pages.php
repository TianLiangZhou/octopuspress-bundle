<?php

namespace OctopusPress\Bundle\Widget;

use OctopusPress\Bundle\Entity\Post;

class Pages extends AbstractWidget
{

    protected function template(): string
    {
        // TODO: Implement template() method.
        return <<<EOF
<ul class="pages-list">
    {% for item in pages %}
    <li class="pages-list-item">
        <a href="{{ permalink(item) }}">{{item.title}}</a>
    </li>
    {% else %}
    <li class="pages-list-item">无记录</li>
    {% endfor %}
</ul>
EOF;
    }

    protected function context(array $attributes = []): array
    {
        // TODO: Implement context() method.
        $postRepository = $this->getBridger()->getPostRepository();
        $result = [
            'pages' => []
        ];
        $result['pages'] = $postRepository->findBy([
            'type' => Post::TYPE_PAGE,
            'status' => Post::STATUS_PUBLISHED,
        ]);
        return $result;
    }

    public function delayRegister(): void
    {
        // TODO: Implement registerForm() method.
        $this->setLabel("页面列表");
        $this->setIcon('fa-newspaper');
    }
}
