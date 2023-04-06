<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Customize\Layout;

use OctopusPress\Bundle\Customize\AbstractControl;
use OctopusPress\Bundle\Customize\Control;
use OctopusPress\Bundle\Customize\MediaControl;

class Form implements \JsonSerializable
{
    /**
     * @var array<int, Control>|Control[]
     */
    private array $controls = [];

    /**
     * @var string
     */
    private string $direction = 'column';


    /**
     * @var array{name:string,link:string,valid:bool}
     */
    private array $submit = [
        'name' => '保存',
        'link' => '#',
        'valid' => true,
    ];

    /**
     * @var array{name?:string}
     */
    private array $reset = [];
    /**
     * @var array<int, string>|string[]
     */
    private array $className = [];

    /**
     * @param string $name
     * @return $this
     */
    public function addClass(string $name): static
    {
        $this->className[] = $name;
        return $this;
    }

    /**
     * @param string $id
     * @param string $label
     * @param string $type
     * @param array<string, mixed> $options
     * @return Control
     */
    public function add(string $id, string $label, string $type = AbstractControl::INPUT, array $options = []): Control
    {
        if (in_array($type, [AbstractControl::AUDIO, AbstractControl::VIDEO, AbstractControl::IMAGE, AbstractControl::FILE, ])) {
            $control = new MediaControl($id, [
                'type' => $type,
                'label' => $label,
                'storage' => 'option',
            ] + $options);
        } else {
            $control = new Control($id, [
                'type' => $type,
                'label' => $label,
                'storage' => 'option',
            ] + $options);
        }
        $this->addControl($control);
        return $control;
    }

    /**
     * @param AbstractControl $control
     * @return $this
     */
    public function addControl(AbstractControl $control): static
    {
        $this->controls[] = $control;
        return $this;
    }

    /**
     * @param string $direction
     * @return $this
     */
    public function setDirection(string $direction): static
    {
        $this->direction = $direction;
        return $this;
    }

    /**
     * @param string $name
     * @param string $link
     * @param bool $isValid
     * @return Form
     */
    public function setSubmit(string $link, string $name = '提交', bool $isValid = true): Form
    {
        $this->submit = [
            'name' => $name,
            'link' => $link,
            'valid' => $isValid,
        ];
        return $this;
    }

    /**
     * @param string $name
     * @return $this
     */
    public function addReset(string $name = '重置'): Form
    {
        $this->reset = [
            'name' => $name,
        ];
        return $this;
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        // TODO: Implement build() method.
        $canvas = [
            'controls' => [],
            'direction'=> $this->direction,
            'submit' => $this->submit,
            'class'  => implode(' ', $this->className)
        ];
        if (isset($this->reset['name'])) {
            $canvas['reset'] = $this->reset;
        }
        foreach ($this->controls as $form) {
            $canvas['controls'][] = $form->jsonSerialize();
        }
        return $canvas;
    }

    /**
     * @return array<int, string>|string[]
     */
    public function getClassName(): array
    {
        return $this->className;
    }

    /**
     * @return Control[]
     */
    public function getControls(): array
    {
        return $this->controls;
    }
}
