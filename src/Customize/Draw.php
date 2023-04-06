<?php

namespace OctopusPress\Bundle\Customize;

use JsonSerializable;
use OctopusPress\Bundle\Customize\Layout\Form;
use OctopusPress\Bundle\Customize\Layout\Table;
use OctopusPress\Bundle\Customize\Layout\Tabs;

final class Draw implements JsonSerializable
{
    private static ?Draw $instance = null;

    private ?JsonSerializable $layout;

    private string $title = '';


    private function __construct()
    {
    }

    /**
     * @return static
     */
    static function builder(): Draw
    {
        if (self::$instance == null) {
            self::$instance = new Draw();
        }
        return self::$instance;
    }

    /**
     * @param string $title
     * @return $this
     */
    public function title(string $title): Draw
    {
        $this->title = $title;
        return $this;
    }

    /**
     * @return Table
     */
    public function table(): Table
    {
        return $this->layout = new Table();
    }

    /**
     * @return Form
     */
    public function form(): Form
    {
        return $this->layout = new Form();
    }

    /**
     * @return Tabs
     */
    public function tabs(): Tabs
    {
        return $this->layout = new Tabs();
    }

    /**
     * @return array<string, mixed>
     */
    public function build(): array
    {
        $layout = [
            'title' => $this->title,
            'container' => '',
        ];
        if ($this->layout == null) {
            return $layout;
        }
        $array = explode('\\', get_class($this->layout));
        $className = strtolower(array_pop($array));
        $layout['container'] = $className;
        $layout[$className] = $this->layout->jsonSerialize();
        return $layout;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        return $this->build();
    }

    /**
     * @return JsonSerializable|null
     */
    public function getLayout(): ?JsonSerializable
    {
        return $this->layout;
    }
}
