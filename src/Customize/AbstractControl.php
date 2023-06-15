<?php

namespace OctopusPress\Bundle\Customize;

use OctopusPress\Bundle\Model\CustomizeManager;

abstract class AbstractControl implements \JsonSerializable
{
    const INPUT = 'input';
    const FILE = 'file';
    const IMAGE = 'image';
    const VIDEO = 'video';
    const AUDIO = 'audio';
    const TEXTAREA = 'textarea';
    const AUTOCOMPLETE = 'autocomplete';
    const DATE = 'date';
    const DATETIME = 'datetime';
    const RANGE_DATE = 'range_date';
    const SELECT = 'select';
    const CHECKBOX = 'checkbox';
    const RADIO = 'radio';
    const SWITCH = 'switch';
    const COLOR = 'color';
    const GROUP = 'group';
    const CUSTOM = 'custom';

    private ?CustomizeManager $manager = null;

    private string $id;

    private int $priority = 0;

    /**
     * @var array<int, string>|string[]
     */
    private array $depends = [];


    /**
     * @var array<int, string>|string[]
     */
    private array $resources = [];

    private string $label = '';

    private bool $required = false;

    private string $inputType = 'text';

    private string $type = self::INPUT;

    private string $description = "";

    private bool $multiple = false;

    private string $placeholder = "";

    /**
     * @var array<int, array{value?:string|int,label?:string}>
     */
    private array $options = [];

    /**
     * @var array<int|string, mixed>
     */
    private array $validators = [];

    private string $format = '';

    /**
     * @var string
     */
    private string $template = '';

    /**
     * @var array<string, mixed>
     */
    private array $settings = [];

    /**
     * @var AbstractControl[]
     */
    private array $children = [];

    /**
     * @var mixed|string
     */
    private mixed $default = null;

    /**
     * @var string
     */
    private string $storage = 'theme_mod';

    /**
     * @var AbstractControl|null
     */
    private ?AbstractControl $parent = null;

    /**
     * @var callable|null
     */
    private $validateCallback = null;
    /**
     * @var callable|null
     */
    private $sanitizeCallback = null;

    /**
     * @param string $id
     * @param array{label?:string,description?:string,default?:mixed,validateCallback?:callable,sanitizeCallback?:callable,priority?:int,template?:string,inputType?:string,placeholder?:string,type?:string,format?:string,required?:bool,multiple?:bool,options?:array<string|int,string>} $args
     */
    public function __construct(string $id, array $args = [])
    {
        $this->id = $id;
        if (isset($args['type']) && !isset($args['format'])) {
            $this->setType($args['type']);
            unset($args['type']);
        }
        if (isset($args['required']) && !isset($args['placeholder'])) {
            $this->setRequired($args['required']);
            unset($args['required']);
        }
        if (isset($args['validateCallback']) && is_callable($args['validateCallback'])) {
            $this->validateCallback = $args['validateCallback'];
            unset($args['validateCallback']);
        }
        if (isset($args['sanitizeCallback']) && is_callable($args['sanitizeCallback'])) {
            $this->sanitizeCallback = $args['sanitizeCallback'];
            unset($args['sanitizeCallback']);
        }
        if ($args) {
            $keys = array_keys(get_object_vars($this));
            foreach ($keys as $key) {
                if (isset($args[$key])) {
                    $this->$key = $args[$key];
                }
            }
        }
        if (!isset($args['default'])) {
            $this->default = $this->isMultiple() ? [] : ($this->getType() == self::INPUT ? '' : null);
        }
    }

    /**
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * @param string $id
     * @param bool $exclusive
     * @return $this
     */
    public function addDepend(string $id, bool $exclusive = false, string|int|bool|null $value = null): static
    {
        $this->depends[] = $id . ':' . ($exclusive ? 'e' : 'd') . ($value !== null ? ':' . $value : '');
        return $this;
    }


    /**
     * @return array<int, string>|string[]
     */
    public function getResources(): array
    {
        return $this->resources;
    }

    /**
     * @param string $resource
     * @return static
     */
    public function addResource(string $resource): static
    {
        $this->resources[] = $resource;
        return $this;
    }

    /**
     * @return array<int, string>|string[]
     */
    public function getDepends(): array
    {
        return $this->depends;
    }

    /**
     * @return mixed
     */
    public function getValue(): mixed
    {
        $manager = $this->getManager();
        if ($manager == null) {
            return $this->default;
        }
        if ($this->getParent() == null) {
            return match ($this->getStorage()) {
                "option" => $manager->getOption($this->getId(), $this->default),
                "theme_mod" => $manager->getThemeMod()[$this->getId()] ?? $this->default,
                "widget" => "",
                default => $manager->getHook()
                    ->filter('customize_value_' . $this->getId(), $this->default, $this),
            };
        }
        return $this->default;
    }

    /**
     * @param array $values
     * @param $id
     * @return array|mixed|string|null
     */
    private function getChildrenValue(array $values, $id): mixed
    {
        foreach ($values as $key => $value) {
            if ($key == $id) {
                return $value;
            }
            if (isset($value[$id])) {
                $valueSet[] = $value[$id];
            }
        }
        if (isset($valueSet)) {
            return $valueSet;
        }
        return $this->default;
    }

    /**
     * @return CustomizeManager|null
     */
    public function getManager(): ?CustomizeManager
    {
        return $this->manager;
    }

    /**
     * @param CustomizeManager|null $manager
     */
    public function setManager(?CustomizeManager $manager): void
    {
        $this->manager = $manager;
    }

    /**
     * @param string $id
     */
    public function setId(string $id): void
    {
        $this->id = $id;
    }

    /**
     * @param AbstractControl $control
     * @return AbstractControl
     */
    private function getRootControl(AbstractControl $control): AbstractControl
    {
        if ($control->getParent() == null) {
            return $control;
        }
        return $this->getRootControl($control->getParent());
    }

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type ?? 'input';
    }

    /**
     * @param string $type
     * @return static
     */
    public function setType(string $type): static
    {
        $this->type = $type;
        if ($type == self::DATETIME && empty($this->getFormat())) {
            $this->setFormat('yyyy-MM-dd HH:mm:ss');
        }
        if ($type == self::DATE && empty($this->getFormat())) {
            $this->setFormat('yyyy-MM-dd');
        }
        if ($type == self::RANGE_DATE && empty($this->getFormat())) {
            $this->setFormat('yyyy/MM/dd');
        }
        return $this;
    }

    /**
     * @return bool
     */
    public function isRequired(): bool
    {
        return $this->required;
    }

    /**
     * @param bool $required
     * @return AbstractControl
     */
    public function setRequired(bool $required): static
    {
        $this->required = $required;
        if ($required && empty($this->getPlaceholder())) {
            $this->setPlaceholder('必填项');
        }
        return $this;
    }

    /**
     * @return string
     */
    public function getLabel(): string
    {
        return $this->label;
    }

    /**
     * @param string $label
     * @return AbstractControl
     */
    public function setLabel(string $label): static
    {
        $this->label = $label;
        return $this;
    }

    /**
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @param string $description
     * @return AbstractControl
     */
    public function setDescription(string $description): static
    {
        $this->description = $description;
        return $this;
    }

    /**
     * @return string
     */
    public function getInputType(): string
    {
        return $this->inputType;
    }

    /**
     * @param string $inputType
     * @return AbstractControl
     */
    public function setInputType(string $inputType): static
    {
        $this->inputType = $inputType;
        return $this;
    }

    /**
     * @return bool
     */
    public function isMultiple(): bool
    {
        return $this->multiple;
    }

    /**
     * @param bool $multiple
     * @return AbstractControl
     */
    public function setMultiple(bool $multiple): static
    {
        $this->multiple = $multiple;
        return $this;
    }

    /**
     * @return string
     */
    public function getPlaceholder(): string
    {
        return $this->placeholder;
    }

    /**
     * @param string $placeholder
     * @return AbstractControl
     */
    public function setPlaceholder(string $placeholder): static
    {
        $this->placeholder = $placeholder;
        return $this;
    }

    /**
     * @return array<int, array{value?:string|int,label?:string}>
     */
    public function getOptions(): array
    {
        return $this->options;
    }

    /**
     * @param string|int $value
     * @param string $label
     * @return AbstractControl
     */
    public function addOption(string|int $value, string $label): static
    {
        $this->options[] = ['value' => $value, 'label' => $label];
        return $this;
    }

    /**
     * @param array{array{value?:string|int, label?:string}} $options
     * @return AbstractControl
     */
    public function setOptions(array $options): static
    {
        $this->options = isset($options[0]) ? $options : [$options];
        return $this;
    }

    /**
     * @return array<int|string, mixed>
     */
    public function getValidators(): array
    {
        return $this->validators;
    }

    /**
     * @param array<int|string, mixed> $validators
     * @return AbstractControl
     */
    public function setValidators(array $validators): static
    {
        $this->validators = $validators;
        return $this;
    }

    /**
     * @param string $format
     * @return AbstractControl
     */
    public function setFormat(string $format): static
    {
        $this->format = $format;
        return $this;
    }

    /**
     * @return string
     */
    public function getFormat(): string
    {
        return $this->format;
    }

    /**
     * @return int
     */
    public function getPriority(): int
    {
        return $this->priority;
    }

    /**
     * @param int $priority
     * @return AbstractControl
     */
    public function setPriority(int $priority): static
    {
        $this->priority = $priority;
        return $this;
    }

    /**
     * @param string $template
     * @return AbstractControl
     */
    public function setTemplate(string $template): static
    {
        $this->template = $template;
        return $this;
    }

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return $this->template;
    }

    /**
     * @param array<string, mixed> $settings
     * @return AbstractControl
     */
    public function setSettings(array $settings): static
    {
        $this->settings = $settings;
        return $this;
    }

    /**
     * @param string $name
     * @param mixed $value
     * @return $this
     */
    public function setSetting(string $name, mixed $value): static
    {
        $this->settings[$name] = $value;
        return $this;
    }

    /**
     * @return array<string, mixed>
     */
    public function getSettings(): array
    {
        return $this->settings;
    }

    /**
     * @param string $name
     * @return bool
     */
    public function hasSetting(string $name): bool
    {
        return isset($this->settings[$name]);
    }

    /**
     * @param AbstractControl[] $elements
     * @return $this
     */
    public function setChildren(array $elements): static
    {
        $this->children = isset($elements[0]) ? $elements : [$elements];
        return $this;
    }

    /**
     * @param AbstractControl $control
     * @return void
     */
    private function setParent(AbstractControl $control): void
    {
        $this->parent = $control;
    }

    /**
     * @return AbstractControl|null
     */
    public function getParent(): ?AbstractControl
    {
        return $this->parent;
    }

    /**
     * @param AbstractControl $control
     * @return $this
     */
    public function addChild(AbstractControl $control): static
    {
        if ($control->getManager() == null) {
            $control->setManager($this->getManager());
        }
        $control->setParent($this);
        $this->children[] = $control;
        return $this;
    }

    /**
     * @param string $id
     * @return AbstractControl|null
     */
    public function getChild(string $id): ?AbstractControl
    {
        foreach ($this->children as $element) {
            if ($element->getId() === $id) {
                return $element;
            }
        }
        return null;
    }

    /**
     * @param string $id
     * @return $this
     */
    public function removeChild(string $id): static
    {
        foreach ($this->children as $index => $element) {
            if ($element->getId() == $id) {
                unset($this->children[$index]);
            }
        }
        return $this;
    }

    /**
     * @return AbstractControl[]
     */
    public function getChildren(): array
    {
        return $this->children;
    }

    /**
     * @return string
     */
    public function getStorage(): string
    {
        return $this->storage;
    }

    /**
     * @param string $storage
     * @return AbstractControl
     */
    public function setStorage(string $storage): static
    {
        $this->storage = $storage;
        return $this;
    }

    /**
     * @param mixed $value
     * @return bool
     */
    public function validate(mixed $value): bool
    {
        $validity = true;
        if ($this->validateCallback) {
            $validity = call_user_func($this->validateCallback, $value, $this->getManager());
            if (!is_bool($validity)) {
                return false;
            }
        }
        return $validity;
    }

    /**
     * @param mixed $value
     * @return mixed
     */
    public function sanitize(mixed $value): mixed
    {
        if ($this->sanitizeCallback) {
            return call_user_func($this->sanitizeCallback, $value, $this->getManager()) ?? $this->default;
        }
        return $value;
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        // TODO: Implement jsonSerialize() method.
        return [
            'id' => $this->getId(),
            'depends' => $this->getDepends(),
            'resources' => $this->getResources(),
            'label' => $this->getLabel(),
            'description' => $this->getDescription(),
            'type' => $this->getType(),
            'value'=> $this->getValue(),
            'template' => $this->getTemplate(),
            'required' => $this->isRequired(),
            'inputType' => $this->getInputType(),
            'multiple' => $this->isMultiple(),
            'placeholder' => $this->getPlaceholder(),
            'options' => $this->getOptions(),
            'format'  => $this->getFormat(),
            'validators' => $this->getValidators(),
            'children' => array_map(function ($child) {
                if ($child->getManager() == null) {
                    $child->setManager($this->getManager());
                }
                return $child->jsonSerialize();
            }, $this->getChildren()),
            'settings' => (object) $this->getSettings(),
        ];
    }
}
