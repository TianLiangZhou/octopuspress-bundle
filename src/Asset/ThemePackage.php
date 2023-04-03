<?php

namespace OctopusPress\Bundle\Asset;

use JsonException;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Repository\OptionRepository;
use Symfony\Component\Asset\Context\ContextInterface;
use Symfony\Component\Asset\Exception\RuntimeException;
use Symfony\Component\Asset\Package;
use Symfony\Component\Asset\VersionStrategy\StaticVersionStrategy;

class ThemePackage extends Package
{
    private OptionRepository $repository;
    private string $templateDir;
    private static ?string $theme = null;
    private string $assetUrl;

    public function __construct(Bridger $bridger, ContextInterface $context = null)
    {
        $this->templateDir = $bridger->getTemplateDir();
        $this->repository = $bridger->getOptionRepository();
        $this->assetUrl = $bridger->getAssetUrl();
        parent::__construct(new StaticVersionStrategy($this->loaderThemeVersion(), '%s?v=%s'), $context);
    }

    /**
     * @return string
     */
    private function getTheme(): string
    {
        return self::$theme ??= $this->repository->theme();
    }

    /**
     * @return string
     */
    private function loaderThemeVersion(): string
    {
        $packagePath = $this->templateDir. DIRECTORY_SEPARATOR . $this->getTheme() . DIRECTORY_SEPARATOR . 'package.json';
        if (!file_exists($packagePath)) {
            throw new RuntimeException(sprintf('Asset manifest file "%s" does not exist. Did you forget to build the assets with npm or yarn?', $packagePath));
        }
        try {
            $manifestData = json_decode(file_get_contents($packagePath) ?: '[]', true, flags: \JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            throw new RuntimeException(sprintf('Error parsing JSON from asset manifest file "%s": ', $packagePath).$e->getMessage(), previous: $e);
        }
        return $manifestData['version'] ?? 'v1.0.0';
    }


    /**
     * @param string $path
     * @return string
     */
    public function getVersion(string $path): string
    {
        // TODO: Implement getVersion() method.
        return $this->assetUrl . parent::getVersion('themes' . DIRECTORY_SEPARATOR . $this->getTheme(). DIRECTORY_SEPARATOR . $path);
    }

    /**
     * @param string $path
     * @return string
     */
    public function getUrl(string $path): string
    {
        // TODO: Implement getUrl() method.
        return $this->assetUrl . parent::getUrl('themes' . DIRECTORY_SEPARATOR . $this->getTheme(). DIRECTORY_SEPARATOR . $path);
    }
}
