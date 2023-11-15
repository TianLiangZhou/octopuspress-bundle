<?php

namespace OctopusPress\Bundle\Model;

use Doctrine\ORM\ORMException;
use InvalidArgumentException;
use OctopusPress\Bundle\Entity\Option;
use OctopusPress\Bundle\OctopusPressKernel;
use Closure;
use Symfony\Component\Filesystem\Exception\IOException;
use Symfony\Component\Finder\Exception\DirectoryNotFoundException;
use Symfony\Component\Finder\Finder;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class ThemeManager extends PackageManager
{

    /**
     * @return void
     */
    public function boot(): void
    {
        $this->load($this->theme());
    }

    /**
     * @return string
     */
    public function theme(): string
    {
        return $this->optionRepository->theme();
    }

    /**
     * @return array<int, array<string, mixed>>
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function themes(): array
    {
        $currentTheme = $this->optionRepository->theme();
        $installedThemes = $this->optionRepository->installedThemes();
        $themes = $registeredInfo = [];
        if ($installedThemes) {
            $response = $this->market('theme', [
                'name' => array_keys($installedThemes),
            ]);
            if (!empty($response['packages'])) {
                $registeredInfo = array_column($response['packages'], null, 'packageName');
            }
        }
        foreach ($installedThemes as $name => $theme) {
            $theme['enabled'] = $currentTheme == $name;
            $theme['upgradeable'] = false;
            if (isset($registeredInfo[$name])) {
                if (version_compare($registeredInfo[$name]['version'], $theme['version'], '>')) {
                    $theme['upgradeable'] = true;
                }
            }
            $themes[] = $theme;
        }
        return $themes;
    }

    /**
     * @param array $packageInfo
     * @return string
     * @throws ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    protected function setup(array $packageInfo): string
    {
        $name = $packageInfo['packageName'];
        $themeRootPath = dirname($packageInfo['packageFile']);
        $templateDir = $this->getTemplateDir();
        $themePath = $templateDir . DIRECTORY_SEPARATOR . $name;
        if (!file_exists($themePath)) {
            if (!is_writable($templateDir)) {
                throw new InvalidArgumentException('The template directory is not writable');
            }
            mkdir($themePath, 0755);
        }
        $this->filesystem->mirror($themeRootPath, $themePath, null, ['override' => true]);
        if (($currentTheme = $this->theme()) && $currentTheme == $name) {
            $this->migrateTo($name);
        }
        $option = $this->optionRepository->findOneByName('installed_themes');
        if ($option == null) {
            $option = new Option();
            $option->setName('installed_themes');
        }
        unset($packageInfo['composerFile'], $packageInfo['packageFile'], $packageInfo['tempDir']);
        $installed = $this->optionRepository->value('installed_themes', []);
        $installed[$name] = $packageInfo;
        $option->setValue($installed);
        $this->optionRepository->add($option);
        return $name;
    }

    /**
     * @param string $themeName
     * @return void
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function activate(string $themeName): void
    {
        $installedThemes = $this->optionRepository->installedThemes();
        if (!isset($installedThemes[$themeName])) {
            throw new \InvalidArgumentException('主题还未安装!');
        }
        $currentTheme = $this->optionRepository->findOneByName('theme');
        if ($currentTheme == null) {
            $currentTheme = new Option();
            $currentTheme->setName('theme')
                ->setAutoload('yes');
        }
        if ($currentTheme->getValue() === $themeName) {
            throw new \InvalidArgumentException('主题已激活!');
        }
        $themePath = $this->getThemePath($themeName);
        if (!file_exists($themePath)) {
            throw new DirectoryNotFoundException("Theme directory does not exist");
        }
        $themeInfo = $installedThemes[$themeName];
        $minVersion = $themeInfo['miniOP'];
        $minPhpVersion = $themeInfo['miniPHP'];
        if (version_compare(PHP_VERSION, $minPhpVersion) < 0) {
            throw new \RuntimeException("The PHP minimum version is " . $minPhpVersion);
        }
        if (version_compare(OctopusPressKernel::OCTOPUS_PRESS_VERSION, $minVersion) < 0) {
            throw new \RuntimeException("The octopus minimum version is " . $minVersion);
        }
        $originTheme = $currentTheme->getValue();
        $currentTheme->setValue($themeName);
        $this->migrateTo($themeName);
        $this->optionRepository->add($currentTheme);
        if ($originTheme && strcasecmp($themeName, $originTheme) !== 0) {
            $this->deactivate($originTheme);
        }
    }

    /**
     * @param string $name
     * @return void
     */
    public function uninstall(string $name): void
    {
        $option = $this->optionRepository->findOneByName('installed_themes');
        $installedThemes = $this->optionRepository->value('installed_themes', []);
        if (!isset($installedThemes[$name])) {
            throw new \InvalidArgumentException("主题没有被安装!");
        }
        $currentTheme = $this->optionRepository->findOneByName('theme');
        if ($name === $currentTheme->getValue()) {
            throw new InvalidArgumentException("Invalid `$name` params");
        }
        if (!file_exists($this->getThemePath($name))) {
            throw new InvalidArgumentException("Invalid `$name` params, It's not exists");
        }
        $this->filesystem->remove([$this->getThemePath($name)]);
        if ($this->targetDir($name)) {
            $this->filesystem->remove([$this->targetDir($name)]);
        }
        unset($installedThemes[$name]);
        $option->setValue($installedThemes);
        $this->optionRepository->add($installedThemes);
    }

    /**
     * @param string $theme
     * @return string
     */
    public function targetDir(string $theme): string
    {
        $targetDir = !empty($bad = $this->bridger->getBuildAssetsDir()) ? $bad : $this->bridger->getPublicDir();
        if (!is_writable($targetDir . DIRECTORY_SEPARATOR . 'themes')) {
            throw new IOException(sprintf('Directory `%s/themes` does not have write permission', $targetDir));
        }
        return $targetDir . DIRECTORY_SEPARATOR . 'themes' . DIRECTORY_SEPARATOR . $theme;
    }

    /**
     * @param string $theme
     * @return void
     */
    public function deactivate(string $theme): void
    {
        $targetDir = $this->targetDir($theme);
        $this->filesystem->remove([$targetDir]);
    }

    /**
     * @return string
     */
    private function getTemplateDir(): string
    {
        return $this->bridger->getTemplateDir();
    }

    /**
     * @param string $theme
     * @return string
     */
    public function getThemePath(string $theme): string
    {
        return $this->getTemplateDir() . DIRECTORY_SEPARATOR . $theme . DIRECTORY_SEPARATOR;
    }

    /**
     * @param string $theme
     * @return string
     */
    public function getThemePackage(string $theme): string
    {
        return $this->getThemePath($theme) . 'package.json';
    }

    /**
     * 迁移静态资源文件到web公共目录
     *
     * @param string $theme
     * @return void
     */
    private function migrateTo(string $theme): void
    {
        $themeTargetDir = $this->targetDir($theme);
        if (!\file_exists($themeTargetDir)) {
            \mkdir($themeTargetDir, 0755, true);
        }
        $themeDir = $this->getThemePath($theme);
        $allowExt = [
            '*.html', '*.css', '*.js', '*.jpg', '*.jpeg', '*.png', '*.webp', '*.svg', '*.bmp', '*.ico', '*.gif',
            '*.flv', '*.mp4', '*.wav', '*.mp3', '*.ogg', '*.webm', '*.flac', '*.ttf', '*.woff', '*.eot', '*.woff2'
        ];
        $iterator = Finder::create()->name($allowExt)->in($themeDir)->exclude(['dev', 'node_modules'])->getIterator();
        $this->filesystem->mirror($themeDir, $themeTargetDir, $iterator);
    }

    /**
     * @param string $theme
     * @return void
     */
    private function load(string $theme): void
    {
        $entryFile = $this->getTemplateDir() . DIRECTORY_SEPARATOR . $theme . '/functions.php';
        if (!file_exists($entryFile)) {
            return;
        }
        $closure = Closure::bind(function (string $entryFile) {
            $return = include $entryFile;
            if (is_callable($return)) {
                call_user_func($return, $this);
            }
        }, $this->bridger);
        call_user_func($closure, $entryFile);
        $this->bridger->getHook()->action('setup_theme', $theme);
    }
}
