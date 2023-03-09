<?php

namespace OctopusPress\Bundle\Scalable\Features;

final class Block implements \JsonSerializable
{


    private string $label;
    private string $name;
    private string $description;
    private string $className;


    public function __construct(string $name, array $args = [])
    {
        $this->name = $name;
        $this->buildProps($args);
    }

    private function buildProps(array $args)
    {
        $defaults = [
            'label'  => '',
            'description'    => '',
            'className'          => '',
        ];
        $args = array_merge($defaults, $args);
        $this->label = (string) $args['label'];
        $this->description = (string) $args['description'];
        $this->className = (string) $args['className'];
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        return [
            'name' => $this->name,
            'label'=> $this->label,
            'className' => $this->className,
            'description'=> $this->description,
        ];
    }
}
