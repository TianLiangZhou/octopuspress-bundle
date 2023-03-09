<?php

namespace OctopusPress\Bundle\Asset;

use Symfony\Component\Asset\VersionStrategy\VersionStrategyInterface;

class ThemeStaticVersionStrategy implements VersionStrategyInterface
{
    private string $version;
    private string $format;

    /**
     * @param string $version Version number
     * @param string|null $format Url format
     */
    public function __construct(string $version, string $format = null)
    {
        $this->version = $version;
        $this->format = $format ?: '%s?%s';
    }

    /**
     * {@inheritdoc}
     */
    public function getVersion(string $path): string
    {
        return $this->version;
    }

    /**
     * {@inheritdoc}
     */
    public function applyVersion(string $path): string
    {
        $versionized = sprintf($this->format, ltrim($path, '/'), $this->getVersion($path));

        if ($path && '/' === $path[0]) {
            return '/'.$versionized;
        }

        return $versionized;
    }

    /**
     * @param string $version
     */
    public function setVersion(string $version): void
    {
        $this->version = $version;
    }

    /**
     * @param string $format
     */
    public function setFormat(string $format): void
    {
        $this->format = $format;
    }
}
