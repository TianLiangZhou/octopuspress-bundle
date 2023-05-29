<?php

namespace OctopusPress\Bundle\Asset;

use OctopusPress\Bundle\Support\ActivatedTheme;
use Symfony\Component\Asset\Context\ContextInterface;
use Symfony\Component\Asset\UrlPackage;
use Symfony\Component\Asset\VersionStrategy\StaticVersionStrategy;

class ThemePackage extends UrlPackage
{
    private ActivatedTheme $activatedTheme;

    public function __construct(
        string|array     $assetsUrl,
        ActivatedTheme   $activatedTheme,
        ContextInterface $context = null
    )
    {

        $this->activatedTheme = $activatedTheme;
        parent::__construct($assetsUrl, new StaticVersionStrategy($this->activatedTheme->getVersion(), '%s?v=%s'), $context);
    }


    /**
     * @param string $path
     * @return string
     */
    public function getVersion(string $path): string
    {
        // TODO: Implement getVersion() method.
        return parent::getVersion('themes' . DIRECTORY_SEPARATOR . $this->activatedTheme->getName(). DIRECTORY_SEPARATOR . $path);
    }

    /**
     * @param string $path
     * @return string
     */
    public function getUrl(string $path): string
    {
        // TODO: Implement getUrl() method.
        return parent::getUrl('themes' . DIRECTORY_SEPARATOR . $this->activatedTheme->getName(). DIRECTORY_SEPARATOR . $path);
    }
}
