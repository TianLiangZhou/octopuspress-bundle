<?php

namespace OctopusPress\Bundle\Customize;

class ImageControl extends MediaControl
{
    public function __construct(string $id, array $args = [])
    {
        $args['type'] = self::IMAGE;
        parent::__construct($id, $args);
        if (isset($args['width']) && isset($args['height'])) {
            $this->cropped((int)$args['width'], (int)$args['height']);
        }
    }


    /**
     * @param int $width
     * @param int $height
     * @return ImageControl
     */
    public function cropped(int $width, int $height): ImageControl
    {
        $this->setSetting('cropped', [
            'width' => $width,
            'height'=> $height,
        ]);
        $description = $this->getDescription();
        $append = '图片最佳尺寸' . $width . 'x' . $height;
        if ($description) {
            $description .= ',';
        }
        $description = $description . $append;
        $this->setDescription($description);
        return $this;
    }
}
