<?php

namespace OctopusPress\Bundle\Customize;

class CarouselControl extends GroupControl
{

    public function __construct(string $id, array $args = [])
    {
        $args['multiple'] = true;
        parent::__construct($id, $args);
        $this->settingDefaultChildren();
    }


    /**
     * @return void
     */
    private function settingDefaultChildren(): void
    {
        $this->addChild(new ImageControl('image', ['label' => '图片']))
            ->addChild(new Control('summary', ['label' => '描述', 'required' => true]))
            ->addChild(new Control('link', ['label' => '链接', 'required' => false]));
    }
}
