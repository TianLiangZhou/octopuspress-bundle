<?php

namespace OctopusPress\Bundle\Widget;

use Doctrine\ORM\QueryBuilder;
use OctopusPress\Bundle\Customize\AbstractControl;
use OctopusPress\Bundle\Customize\Control;
use OctopusPress\Bundle\Customize\Section;
use OctopusPress\Bundle\Entity\Post;
use Traversable;

class LatestPosts extends AbstractWidget implements \IteratorAggregate
{

    protected function template(): string
    {
        // TODO: Implement template() method.
        return <<<EOF
    <ul class="latest-posts-list">
        {% for item in posts %}
            <li class="latest-posts-list-item">
                {% set thumbnail = item.getThumbnail() %}
                {% if displayFeaturedImage and thumbnail %}
                <div class="latest-post-list-item-thumbnail">
                    <img src="{{thumbnail.attachment.url}}" alt="{{item.getTitle()}}" />
                </div>
                {% endif %}
                <a href="{{ permalink(item) }}">{{ item.title }}</a>
                {% if displayAuthor %}
                <div class="latest-post-list-item-author">
                    <span>作者：</span>{{item.getAuthor().getNickname()}}
                </div>
                {% endif %}
                {% if displayDate %}
                <div class="latest-post-list-item-date">
                    {{item.getCreatedAt()|date('Y-m-d H:i')}}
                </div>
                {% endif %}
                {% if displayExcerpt %}
                <div class="latest-post-list-item-excerpt">
                    {{item.getExcerpt()|slice(0, excerptLimit)}}
                </div>
                {% endif %}
                {% if displayContent %}
                <div class="latest-post-list-item-content">
                    {{item.getContent()|raw}}
                </div>
                {% endif %}
            </li>
        {% else %}
            <li class="latest-posts-list-item">无记录</li>
        {% endfor %}
    </ul>
EOF;
    }

    protected function context(array $attributes = []): array
    {
        // TODO: Implement context() method.

        $postRepository = $this->getBridger()->getPostRepository();

        $limit = (int) ($attributes['limit'] ?? 5);
        if ($limit < 1 || $limit > 100) {
            $limit = 5;
        }
        $order = (int) ($attributes['order'] ?? 1);
        if ($order < 1 || $order > 4) {
            $order = 1;
        }
        $author = (int) ($attributes['author'] ?? 0);

        $filters = [
            'type' => (array) ($attributes['type'] ?? Post::TYPE_POST),
        ];
        if ($author > 0) {
            $filters['author'] = $author;
        }
        $filters['_sort'] = $order > 2 ? 'name' : 'createdAt';
        $filters['_order']= ['DESC', '', 'DESC', ''][$order - 1];
        $filters['status'] = Post::STATUS_PUBLISHED;
        $posts = $postRepository->createQuery($filters)
            ->setMaxResults($limit)
            ->getResult();
        $context = [
            'posts' => $posts,
            'displayAuthor'=> isset($attributes['display_author']) && (bool)$attributes['display_author'],
            'displayDate'  => isset($attributes['display_date']) && (bool)$attributes['display_date'],
            'displayFeaturedImage'  => isset($attributes['display_featured_image']) && (bool)$attributes['display_featured_image'],
            'displayExcerpt'=> isset($attributes['display_excerpt']) && (bool)$attributes['display_excerpt'],
            'displayContent'=> isset($attributes['display_content']) && (bool)$attributes['display_content'],
            'excerptLimit' => (int) ($attributes['excerpt_limit'] ?? 55)
        ];
        if ($context['displayFeaturedImage'] && $posts) {
            $postRepository->thumbnails($posts);
        }
        return $context;
    }

    public function delayRegister(): void
    {
        // TODO: Implement delayRegister() method.
        $bridger = $this->getBridger();
        $user = $bridger->getUserRepository();
        $users = $user->findAll();
        $userOptions = [];
        foreach ($users as $user) {
            $userOptions[] = ['label' => $user->getNickname(), 'value' => $user->getId()];
        }
        $this->setIcon('fa-newspaper');
        $this->setLabel("近期文章");
        $section = new Section('content', [
            'label' => '文章内容设置'
        ]);
        $post = $bridger->getPost();
        $showFrontTypes = $post->getShowFrontTypes();
        $typeOptions = [];
        foreach ($showFrontTypes as $name) {
            $typeOptions[] = [
                'value' => $name,
                'label' => $post->getType($name)->getLabel(),
            ];
        }
        $section->addControl(Control::create('type', '文章类型', [
            'type'  => AbstractControl::SELECT,
            'multiple' => true,
            'options' => $typeOptions,
        ],))->addControl(
            (new Control('display_excerpt', [
                'type' => AbstractControl::SWITCH,
                'label' => '文章摘要',
                'default' => false,
            ]))->addDepend('display_content', true)
        )->addControl(
            new Control('excerpt_limit', [
                'type' => AbstractControl::INPUT,
                'label' => '摘要最大字数',
                'default' => 55,
                'inputType'=> 'number',
            ])
        )->addControl(
            (new Control('display_content', [
                'type' => AbstractControl::SWITCH,
                'label' => '文章内容',
                'default' => false,
            ]))->addDepend('display_excerpt', true)
        );
        $this->addSection($section);
        $section2 = new Section('append_column', [
            'label' => '文章元数据设置'
        ]);
        $section2->addControl(
            new Control('display_author', [
                'type' => AbstractControl::SWITCH,
                'label' => '文章作者',
                'default' => false,
            ])
        )->addControl(
            new Control('display_date', [
                'type' => AbstractControl::SWITCH,
                'label' => '文章时间',
                'default' => false,
            ])
        );
        $this->addSection($section2);
        $section3 = new Section('featured_image', [
            'label' => '特色图片设置'
        ]);
        $section3->addControl(
            new Control('display_featured_image', [
                'type' => AbstractControl::SWITCH,
                'label' => '显示特色图片',
                'default' => false,
            ])
        );
        $this->addSection($section3);
        $section4 = new Section('order_filter', [
            'label' => '排序和筛选'
        ]);
        $section4->addControl(
            new Control('order', [
                'type' => AbstractControl::SELECT,
                'label' => '排序',
                'default'=> 1,
                'options' => [
                    ['label' => '最新到最旧', 'value' => 1],
                    ['label' => '最旧到最新', 'value' => 2],
                    ['label' => '标题升序', 'value' => 3],
                    ['label' => '标题降序', 'value' => 4],
                ],
            ])
        )->addControl(
            new Control('author', [
                'type' => AbstractControl::SELECT,
                'label' => '作者',
                'options' => $userOptions,
            ])
        )->addControl(new Control('limit', [
            'type' => AbstractControl::INPUT,
            'inputType' => 'number',
            'label' => '最大数量',
            'default' => 5,
        ]));
        $this->addSection($section4);
    }

    public function getIterator(): Traversable
    {
        // TODO: Implement getIterator() method.
        return new \ArrayIterator($this->getContext()['posts'] ?? []);
    }
}
