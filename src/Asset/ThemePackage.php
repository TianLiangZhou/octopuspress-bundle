<?php

namespace OctopusPress\Bundle\Asset;

use JsonException;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Repository\OptionRepository;
use Symfony\Component\Asset\Context\ContextInterface;
use Symfony\Component\Asset\Exception\RuntimeException;
use Symfony\Component\Asset\UrlPackage;

class ThemePackage extends UrlPackage
{
    private string $templateDir;
    private OptionRepository $repository;

    private static bool $isLoaderVersion = false;
    private static ?string $theme = null;

    public function __construct(
        Bridger $bridger,
        ThemeStaticVersionStrategy $versionStrategy,
        ContextInterface $context = null,
    )
    {
        $this->templateDir = $bridger->getTemplateDir();
        $this->repository = $bridger->getOptionRepository();
        parent::__construct($bridger->getAssetsUrl(), $versionStrategy, $context);
    }

    /**
     * @return string
     */
    private function getTheme(): string
    {
        return self::$theme ??= $this->repository->theme();
    }

    /**
     * @return void
     */
    private function loaderThemeVersion()
    {
        if (self::$isLoaderVersion) {
            return ;
        }
        $packagePath = $this->templateDir. DIRECTORY_SEPARATOR . $this->getTheme() . DIRECTORY_SEPARATOR . 'package.json';
        if (!file_exists($packagePath)) {
            throw new RuntimeException(sprintf('Asset manifest file "%s" does not exist. Did you forget to build the assets with npm or yarn?', $packagePath));
        }
        try {
            $manifestData = json_decode(file_get_contents($packagePath) ?: '[]', true, flags: \JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            throw new RuntimeException(sprintf('Error parsing JSON from asset manifest file "%s": ', $packagePath).$e->getMessage(), previous: $e);
        }
        if (($version = $this->getVersionStrategy()) instanceof ThemeStaticVersionStrategy) {
            $version->setVersion($manifestData['version'] ?? 'v1.0.0');
        }
        self::$isLoaderVersion = true;
    }


    public function getVersion(string $path): string
    {
        // TODO: Implement getVersion() method.
        $this->loaderThemeVersion();
        return parent::getVersion('themes' . DIRECTORY_SEPARATOR . $this->getTheme(). DIRECTORY_SEPARATOR . $path);
    }

    public function getUrl(string $path): string
    {
        // TODO: Implement getUrl() method.
        $this->loaderThemeVersion();
        return parent::getUrl('themes' . DIRECTORY_SEPARATOR . $this->getTheme(). DIRECTORY_SEPARATOR . $path);
    }
}
