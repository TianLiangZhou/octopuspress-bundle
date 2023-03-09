<?php

namespace OctopusPress\Bundle\Customize\Layout;

use JsonSerializable;

class Tabs implements JsonSerializable
{
    /**
     * @var array{array{title:string,tab:JsonSerializable,icon:string}}
     */
    private array $tabs = [];

    /**
     * @throws \Exception
     */
    public function addTab(string $title, JsonSerializable $tab, string $icon = ''): static
    {
        if ($tab instanceof Tabs) {
            throw new \Exception("Not nested tabs");
        }
        $this->tabs[] = [
            'title' => $title,
            'icon' => $icon,
            'tab'  => $tab
        ];
        return $this;
    }

    /**
     * @return array<int, mixed>
     */
    public function jsonSerialize(): array
    {
        // TODO: Implement build() method.
        $canvas = [];
        foreach ($this->tabs as $item) {
            $tab = [
                'title' => $item['title'],
                'icon' => $item['icon'],
                'container' => '',
            ];
            if ($item['tab'] instanceof Table) {
                $tab['container'] = 'table';
                $tab['table'] = $item['tab']->jsonSerialize();
            } elseif($item['tab'] instanceof Form) {
                $tab['container'] = 'form';
                $tab['form'] = $item['tab']->jsonSerialize();
            }
            $canvas[] = $tab;
        }
        return $canvas;
    }
}
