<?php

namespace OctopusPress\Bundle\Util;

use CKSource\CKFinder\Exception\CKFinderException;

class Image extends \CKSource\CKFinder\Image
{
    /**
     * @param $data
     * @param $bmpSupport
     * @return static
     * @throws CKFinderException
     */
    public static function create($data, $bmpSupport = false): static
    {
        return new static($data, $bmpSupport);
    }

    /**
     * @param int $maxWidth
     * @param int $maxHeight
     * @param bool|array $crop
     * @param int $quality
     * @param bool $useHigherFactor
     * @return $this|null
     */
    public function resizeCrop(int $maxWidth, int $maxHeight, bool|array $crop = false, int $quality = 80, bool $useHigherFactor = false): ?static
    {
        $this->resizeQuality = $quality;
        if ($this->width <= 0 || $this->height <= 0) {
            return null;
        }
        if ($maxHeight <= 0 && $maxWidth <= 0) {
            return null;
        }
        if (empty($maxHeight) && $this->width < $maxWidth) {
            return null;
        } elseif (empty($maxWidth) && $this->height < $maxHeight) {
            return null;
        }
        if ($this->width <= $maxWidth && $this->height <= $maxHeight) {
            return null;
        }
        if ($crop) {
            $aspectRatio = $this->width / $this->height;
            $targetWidth = min($maxWidth, $this->width);
            $targetHeight= min($maxHeight, $this->height);
            if (!$targetWidth) {
                $targetWidth = (int) round($targetHeight * $aspectRatio);
            }
            if (!$targetHeight) {
                $targetHeight = (int) round($targetWidth / $aspectRatio);
            }
            $sizeRatio = max($targetWidth / $this->width, $targetHeight / $this->height);

            $cropWidth = round($targetWidth / $sizeRatio);
            $cropHeight = round($targetHeight / $sizeRatio);

            if (!is_array($crop) || count($crop) !== 2) {
                $crop = ['center', 'center'];
            }
            list($x, $y) = $crop;
            if ('left' === $x) {
                $srcX = 0;
            } elseif ('right' === $x) {
                $srcX = $this->width - $cropWidth;
            } else {
                $srcX = floor(($this->width - $cropWidth) / 2);
            }

            if ('top' === $y) {
                $srcY = 0;
            } elseif ('bottom' === $y) {
                $srcY = $this->height - $cropHeight;
            } else {
                $srcY = floor(($this->height - $cropHeight) / 2);
            }
        } else {
            $srcX = $srcY = 0;
            $cropWidth = $this->width;
            $cropHeight= $this->height;
            $targetSize = static::calculateAspectRatio($maxWidth, $maxHeight, $this->width, $this->height, $useHigherFactor);
            $targetWidth = $targetSize['width'];
            $targetHeight = $targetSize['height'];
        }
        $targetImage = imagecreatetruecolor($targetWidth, $targetHeight);

        if ('image/png' === $this->mime) {
            $bg = imagecolorallocatealpha($targetImage, 255, 255, 255, 127);
            imagefill($targetImage, 0, 0, $bg);
            imagealphablending($targetImage, false);
            imagesavealpha($targetImage, true);
        }
        $this->fastCopyResampled(
            $targetImage,
            $this->gdImage,
            0,
            0,
            $srcX,
            $srcY,
            $targetWidth,
            $targetHeight,
            $cropWidth,
            $cropHeight,
            (int) max(floor($quality / 20), 6)
        );
        imagedestroy($this->gdImage);
        $this->gdImage = $targetImage;
        $this->width = $targetWidth;
        $this->height = $targetHeight;
        return $this;
    }

    public function save(string $file): bool
    {
        $data = $this->getData();
        if ($this->getDataSize() < 1) {
            return false;
        }
        return file_put_contents($file, $data) !== false;
    }
}
