<?php

namespace OctopusPress\Bundle\Customize;

class Section implements \JsonSerializable
{
    private string $id;

    private string $label = '';

    private string $description = '';

    private int $priority = 0;

    /**
     * @var array<string, AbstractControl>
     */
    private array $controls = [];


    /**
     * @param string $id
     * @param array{label?:string, description?:string, priority?:integer} $args
     */
    public function __construct(string $id, array $args = [])
    {
        $this->id = $id;
        if ($args) {
            foreach ($args as $key => $value) {
                if (property_exists($this, $key)) {
                    $this->$key = $value;
                }
            }
        }
    }

    /**
     * @param AbstractControl $control
     * @return $this
     */
    public function addControl(AbstractControl $control): static
    {
        $this->controls[$control->getId()] = $control;
        return $this;
    }

    /**
     * @param string $id
     * @return ?AbstractControl
     */
    public function getControl(string $id): ?AbstractControl
    {
        return $this->controls[$id] ?? null;
    }

    /**
     * @return array<string, AbstractControl>
     */
    public function getControls(): array
    {
        return $this->controls;
    }

    /**
     * @param string $id
     * @return $this
     */
    public function removeControl(string $id): static
    {
        unset($this->controls[$id]);
        return $this;
    }

    /**
     * @return $this
     */
    public function clearControl(): static
    {
        $this->controls = [];
        return $this;
    }
    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        $priorities = [];
        foreach ($this->controls as $control) {
            $priorities[$control->getPriority()][] = $control->jsonSerialize();
        }
        krsort($priorities, SORT_NUMERIC);
        return [
            'id' => $this->id,
            'label' => $this->getLabel(),
            'description' => $this->getDescription(),
            'controls' => array_merge(...array_values($priorities)),
        ];
    }

    /**
     * @param int $priority
     * @return $this
     */
    public function setPriority(int $priority): static
    {
        $this->priority = $priority;
        return $this;
    }

    /**
     * @param string $description
     * @return $this
     */
    public function setDescription(string $description): static
    {
        $this->description = $description;
        return $this;
    }

    /**
     * @param string $label
     * @return $this
     */
    public function setLabel(string $label): static
    {
        $this->label = $label;
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
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @return int
     */
    public function getPriority(): int
    {
        return $this->priority;
    }

    /**
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }
}
