<?php

namespace OctopusPress\Bundle\Asset;

use OctopusPress\Bundle\Support\ActivatedTheme;
use Symfony\Component\Asset\VersionStrategy\VersionStrategyInterface;

class ThemeVersionStrategy implements VersionStrategyInterface
{
    private ActivatedTheme $theme;

    private string $format;

    public function __construct(ActivatedTheme $theme, ?string $format = null)
    {
        $this->format = $format ?: '%s?%s';
        $this->theme = $theme;
    }

    public function getVersion(string $path): string
    {
        return $this->theme->getVersion();
    }

    public function applyVersion(string $path): string
    {
        $versionized = sprintf($this->format, ltrim($path, '/'), $this->getVersion($path));

        if ($path && '/' === $path[0]) {
            return '/'.$versionized;
        }

        return $versionized;
    }
}
