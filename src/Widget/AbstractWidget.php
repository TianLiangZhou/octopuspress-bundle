<?php

namespace OctopusPress\Bundle\Widget;

use JsonSerializable;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Customize\AbstractControl;
use OctopusPress\Bundle\Customize\Control;
use OctopusPress\Bundle\Customize\Section;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;
use Twig\TemplateWrapper;

/**
 *
 */
abstract class AbstractWidget implements WidgetInterface, JsonSerializable
{
    /**
     * @var array<int, array>
     */
    private array $attributes = [];
    private Bridger $bridger;
    private string $name;

    protected array $options = [
        'label'           => '',
        'category'        => '',
        'icon'            => '',
        'description'     => '',
        'keywords'        => [],
        'sections'        => [],
        'supports'        => [],
        'styles'          => [],
        'templates'       => [],
    ];

    /**
     * @param Bridger $bridger
     * @param string $name
     * @param array $args
     */
    public function __construct(Bridger $bridger, string $name, array $args = [])
    {
        $this->name = $name;
        $this->bridger = $bridger;
        if (isset($args['label'])) {
            $this->setLabel((string) $args['label']);
        }
        if (isset($args['icon'])) {
            $this->setIcon((string) $args['icon']);
        }
        if (isset($args['category'])) {
            $this->setCategory((string) $args['category']);
        }
        if (isset($args['description'])) {
            $this->setDescription((string) $args['description']);
        }
        if (isset($args['keywords']) && is_array($args['keywords'])) {
            foreach ($args['keywords'] as $word) {
                if (is_string($word)) {
                    $this->addKeyword($word);
                }
            }
        }
        if (isset($args['sections']) && is_array($args['sections'])) {
            foreach ($args['sections'] as $section) {
                if ($section instanceof Section) {
                    $this->addSection($section);
                }
            }
        }
        if (isset($args['styles']) && is_array($args['styles'])) {
            foreach ($args['styles'] as $style) {
                if (is_string($style)) {
                    $this->addStyle($style);
                }
            }
        }
        if (isset($args['templates']) && is_array($args['templates'])) {
            foreach ($args['templates'] as $template) {
                if (is_string($template)) {
                    $this->addTemplate($template);
                }
            }
        }
    }

    abstract protected function template(): string|TemplateWrapper;
    abstract protected function context(array $attributes = []): array;
    abstract public function delayRegister(): void;

    /**
     * @return string
     * @throws LoaderError
     * @throws SyntaxError
     * @throws RuntimeError
     */
    public function render(): string
    {
        $twig = $this->getTwig();
        $context = $this->getContext();
        $templateWrapper = null;
        if (!empty($context['template']) && $this->hasExistsTemplate($context['template'])) {
            $templateName = $this->options['templates'][$context['template']];
            if ($twig->getLoader()->exists($templateName)) {
                $templateWrapper = $twig->load($templateName);
            }
        }
        if ($templateWrapper == null) {
            $templateWrapper = $this->template();
        }
        if (!$templateWrapper instanceof TemplateWrapper) {
            $templateWrapper = $twig->createTemplate($templateWrapper, $this->name);
        }
        return $templateWrapper->render($context);
    }

    /**
     * @return array
     */
    public function getContext(): array
    {
        $attributes = [];
        if (count($this->attributes)) {
            $attributes = array_pop($this->attributes);
        }
        $context = $this->context($attributes);
        $context['className'] = '';
        if (!empty($attributes['class_name'])) {
            $context['className'] = $attributes['class_name'];
        }
        if (!empty($attributes['template']) && $this->hasExistsTemplate($attributes['template'])) {
            $context['template'] = $attributes['template'];
        }
        return $context;
    }

    /**
     * @param array $attributes
     * @return AbstractWidget
     */
    public function put(array $attributes = []): static
    {
        $this->attributes[] = $attributes;
        return $this;
    }

    /**
     * @param string $name
     * @return bool
     */
    private function hasExistsTemplate(string $name): bool
    {
        return isset($this->options['templates'][$name]);
    }

    /**
     * @param string $label
     * @return static
     */
    public function setLabel(string $label): static
    {
        $this->options['label'] = $label;
        return $this;
    }


    /**
     * @param string $category
     * @return static
     */
    public function setCategory(string $category): static
    {
        $this->options['category'] = $category;
        return $this;
    }


    /**
     * @param string $icon
     * @return static
     */
    public function setIcon(string $icon): static
    {
        $this->options['icon'] = $icon;
        return $this;
    }


    /**
     * @param string $description
     * @return static
     */
    public function setDescription(string $description): static
    {
        $this->options['description'] = $description;
        return $this;
    }


    /**
     * @param string $word
     * @return static
     */
    public function addKeyword(string $word): static
    {
        $this->options['keywords'][] = $word;
        return $this;
    }

    /**
     * @param Section $section
     * @return $this
     */
    public function addSection(Section $section): static
    {
        $this->options['sections'][] = $section;
        return $this;
    }

    /**
     * @param string $link
     * @return $this
     */
    public function addStyle(string $link): static
    {
        $this->options['styles'][] = $link;
        return $this;
    }


    /**
     * @param string $key
     * @param mixed $value
     * @return $this
     */
    public function addSupport(string $key, mixed $value): static
    {
        $this->options['supports'][$key] = $value;
        return $this;
    }

    /**
     * @param string $name
     * @return $this
     */
    public function addTemplate(string $name): static
    {
        $this->options['templates'][$name] = $name;
        return $this;
    }

    /**
     * @return string
     * @throws LoaderError
     * @throws SyntaxError
     * @throws RuntimeError
     */
    public function __toString(): string
    {
        return $this->render();
    }

    /**
     * @return Environment
     */
    public function getTwig(): Environment
    {
        return $this->getBridger()->getTwig();
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return Bridger
     */
    public function getBridger(): Bridger
    {
        return $this->bridger;
    }

    /**
     * @return void
     */
    private function additional(): void
    {
        if ($this->options['templates']) {
            $section = new Section('section_template', [
                'label' => '模板'
            ]);
            $options = [
                ['label' => '默认', 'value' => '']
            ];
            foreach ($this->options['templates'] as $template) {
                $options[] = ['label' => $template, 'value' => $template];
            }
            $section->addControl(new Control('template', [
                'type' => AbstractControl::SELECT,
                'label'   => '指定模板',
                'default' => '',
                'options' => $options,
            ]));
            $this->addSection($section);
        }
        $section = new Section('section_advanced', [
            'label' => '高级'
        ]);
        $section->addControl(
            new Control('class_name', [
                'type' => AbstractControl::INPUT,
                'label'   => '额外的CSS类',
                'description' => '多个类请用空格分开',
            ])
        );
        $this->addSection($section);
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        $this->additional();
        return [
            'name'            => $this->name,
            'label'           => $this->options['label'] ?: $this->name,
            'category'        => $this->options['category'] ?: 'widgets',
            'icon'            => $this->options['icon'],
            'description'     => $this->options['description'],
            'keywords'        => $this->options['keywords'],
            'sections'        => $this->options['sections'],
            'supports'        => $this->options['supports'],
            'styles'          => $this->options['styles'],
        ];
    }

}
