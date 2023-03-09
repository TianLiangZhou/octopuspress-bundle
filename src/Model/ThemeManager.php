<?php

namespace OctopusPress\Bundle\Model;

use InvalidArgumentException;
use OctopusPress\Bundle\Entity\Option;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Repository\OptionRepository;
use Closure;
use OctopusPress\Bundle\Util\Formatter;
use Symfony\Component\Filesystem\Exception\IOException;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Exception\DirectoryNotFoundException;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Finder\SplFileInfo;
use ZipArchive;

class ThemeManager
{
    private Filesystem $filesystem;
    private Bridger $bridger;
    private OptionRepository $optionRepository;

    public function __construct(Bridger $bridger)
    {
        $this->bridger = $bridger;
        $this->filesystem = new Filesystem();
        $this->optionRepository = $this->bridger->getOptionRepository();
    }


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
     */
    public function themes(): array
    {
        $dirs = new \DirectoryIterator($this->getTemplateDir());
        $themes = [];
        $currentTheme = $this->optionRepository->theme();
        foreach ($dirs as $dir) {
            if (!$dir->isDir()) {
                continue;
            }
            $name = $dir->getFilename();
            if (in_array($name, ['.', '..', 'static'])) {
                continue;
            }
            $packageFile = $this->getThemePackage($name);
            if (!file_exists($packageFile)) {
                continue;
            }
            $manifest = json_decode(file_get_contents($packageFile) ?: '[]', true);
            $screenshot = "";
            if (!empty($manifest['screenshot'])) {
                if (str_starts_with($manifest['screenshot'], 'http://') ||
                    str_starts_with($manifest['screenshot'], 'https://') ||
                    str_starts_with($manifest['screenshot'], 'data:')) {
                    $screenshot = $manifest['screenshot'];
                } else {
                    $filename = $this->getThemePath($name) . ltrim($manifest['screenshot'], "./\\");
                    if (file_exists($filename) && @getimagesize($filename)) {
                        $screenshot = 'data:image/png;base64, ' . base64_encode(file_get_contents($filename) ?: '');
                    }
                }
            }
            $themes[] = [
                'name' => $manifest['name'],
                'alias' => $name,
                'version' => empty($manifest['version']) ? '1.0.0' : $manifest['version'],
                'description' => $manifest['description'] ?? '',
                'image' => $screenshot,
                'isUpgrade' => false,
                'enabled' => $currentTheme == $name,
            ];
        }
        return $themes;
    }

    /**
     * @param string $filename
     * @return string
     * @throws \Exception
     */
    public function setup(string $filename): string
    {
        $zipArchive = new ZipArchive();
        if ($zipArchive->open($filename) !== true) {
            unlink($filename);
            throw new InvalidArgumentException('Zip cannot be opened.');
        }
        $tempPath = rtrim(sys_get_temp_dir(), '\\/') . DIRECTORY_SEPARATOR . bin2hex(random_bytes(4));
        if (mkdir($tempPath) === false) {
            unlink($filename);
            throw new InvalidArgumentException('Permission denied.');
        }
        $zipArchive->extractTo($tempPath);
        $zipArchive->close();
        unlink($filename);
        $finder = Finder::create()
            ->files()
            ->name('package.json')
            ->in($tempPath);
        /**
         * @var SplFileInfo $packageFile
         */
        $packageFile = null;
        foreach ($finder as $file) {
            $packageFile = $file;
            break;
        }
        if ($packageFile == null) {
            throw new InvalidArgumentException('Zip archive manifest.json file does not exist.');
        }
        $pathName = $packageFile->getPathname();
        $manifest = json_decode(file_get_contents($pathName), true);
        $themeRootPath = dirname($pathName);
        $themeName = $manifest['name'] ?? pathinfo($themeRootPath, PATHINFO_BASENAME) ?? '';
        if (empty($themeName)) {
            throw new InvalidArgumentException('Not in theme pack format.');
        }
        if (!file_exists($themeRootPath . DIRECTORY_SEPARATOR . 'functions.php')) {
            throw new InvalidArgumentException('Not in theme pack format.');
        }
        $name = Formatter::sanitizeWithDashes($themeName);
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
        return $name;
    }

    /**
     * @param string $theme
     * @return void
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function activate(string $theme): void
    {
        $themePath = $this->getThemePath($theme);
        if (file_exists($themePath)) {
            throw new DirectoryNotFoundException("Theme directory does not exist");
        }
        $currentTheme = $this->optionRepository->findOneByName('theme');
        if ($currentTheme == null) {
            $currentTheme = new Option();
            $currentTheme->setName('theme')->setAutoload('yes');
        }
        $originTheme = $currentTheme->getValue();
        $currentTheme->setValue($theme);
        $this->migrateTo($theme);
        $this->optionRepository->add($currentTheme);
        if ($originTheme && strcasecmp($theme, $originTheme) !== 0) {
            $this->deactivate($originTheme);
        }
    }

    /**
     * @param string $theme
     * @return string
     */
    public function targetDir(string $theme): string
    {
        $targetDir = !empty($bad = $this->bridger->getBuildAssetDir()) ? $bad : $this->bridger->getPublicDir();
        if (!is_writable($targetDir)) {
            throw new IOException(sprintf('Directory `%s` does not have write permission', $targetDir));
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
            '*.flv', '*.mp4', '*.wav', '*.mp3', '*.ogg', '*.webm', '*.flac'
        ];
        $iterator = Finder::create()->name($allowExt)->in($themeDir)->getIterator();
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

    private function downloadPackage(string $name)
    {
        return "";
    }
}
