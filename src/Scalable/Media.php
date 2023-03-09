<?php
namespace OctopusPress\Bundle\Scalable;

use OctopusPress\Bundle\Repository\OptionRepository;

final class Media
{
    private OptionRepository $optionRepository;
    private Hook $hook;


    /**
     * @var array<string, array<string, int|string>>
     */
    private array $additionalImageSizes = [];

    public function __construct(
        Hook             $hook,
        OptionRepository $optionRepository
    ) {
        $this->optionRepository = $optionRepository;
        $this->hook = $hook;
    }


    /**
     * @param int $width
     * @param int $height
     * @param bool $crop
     * @return Media
     */
    public function setPostThumbnailSize(int $width = 0, int $height = 0, bool $crop = false): Media
    {
        $this->addImageSize('post-thumbnail', $width, $height, $crop);
        return $this;
    }

    /**
     * @param string $name
     * @param int $width
     * @param int $height
     * @param bool $crop
     * @return $this
     */
    public function addImageSize(string $name, int $width, int $height, bool $crop = false): self
    {
        $this->additionalImageSizes[$name] = [
            'width' => $width,
            'height'=> $height,
            'crop'  => $crop,
        ];
        return $this;
    }

    /**
     * @return array<string, array<string, int|string>
     */
    public function getImageSizes(): array
    {
        return $this->additionalImageSizes;
    }

    /**
     * @return array
     */
    public function getRegisteredImageSubsizes(): array
    {
        $additionalSizes = $this->getImageSizes();
        $allSizes       = [];
        foreach ($this->getIntermediateImageSizes() as $sizeName) {
            $sizeData = [
                'width'  => 0,
                'height' => 0,
                'crop'   => false,
            ];

            if (isset($additionalSizes[$sizeName]['width'])) {
                // For sizes added by plugins and themes.
                $sizeData['width'] = (int) $additionalSizes[$sizeName]['width'];
            } else {
                // For default sizes set in options.
                $sizeData['width'] = (int) $this->optionRepository->value("{$sizeName}_size_w", 0);
            }

            if (isset($additionalSizes[$sizeName]['height'])) {
                $sizeData['height'] = (int) $additionalSizes[$sizeName]['height'];
            } else {
                $sizeData['height'] = (int) $this->optionRepository->value("{$sizeName}_size_h", 0);
            }

            if (empty($sizeData['width']) && empty($sizeData['height'])) {
                // This size isn't set.
                continue;
            }

            if (isset($additionalSizes[$sizeName]['crop'])) {
                $sizeData['crop'] = $additionalSizes[ $sizeName ]['crop'];
            } else {
                $sizeData['crop'] = (int) $this->optionRepository->value("{$sizeName}_crop", 0);
            }

            if (!is_array($sizeData['crop']) || empty($sizeData['crop'])) {
                $sizeData['crop'] = (bool) $sizeData['crop'];
            }
            $allSizes[$sizeName] = $sizeData;
        }

        return $allSizes;
    }

    /**
     * @return array
     */
    public function getIntermediateImageSizes(): array
    {
        $defaultSizes    = ['thumbnail', 'medium', 'large'];
        $additionalSizes = $this->getImageSizes();

        if (! empty($additionalSizes)) {
            $defaultSizes = array_merge($defaultSizes, array_keys($additionalSizes));
        }
        return $this->hook->filter('intermediate_image_sizes', $defaultSizes);
    }
}
