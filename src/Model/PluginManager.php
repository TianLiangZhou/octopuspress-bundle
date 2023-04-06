<?php

namespace OctopusPress\Bundle\Model;

use InvalidArgumentException;
use OctopusPress\Bundle\Controller\Controller;
use OctopusPress\Bundle\OctopusPressKernel;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Plugin\PluginInterface;
use OctopusPress\Bundle\Plugin\PluginProviderInterface;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Util\Formatter;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Finder\SplFileInfo;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use ZipArchive;
use function Symfony\Component\String\u;

class PluginManager
{
    private Bridger $bridger;
    private OptionRepository $optionRepository;

    /**
     * @var array
     */
    private array $registered = [];

    public function __construct(Bridger $bridger)
    {
        $this->bridger = $bridger;
        $this->optionRepository = $bridger->getOptionRepository();
    }

    /**
     * @param string $name
     * @return bool
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function activate(string $name): bool
    {
        $plugin = $this->getPlugin($name);
        if ($plugin == null) {
            throw new \InvalidArgumentException("Invalid param `$name`");
        }
        $manifest = $plugin::manifest();
        $minVersion = $manifest->getMinVersion();
        $minPhpVersion = $manifest->getMinPhpVersion();
        if (empty($minPhpVersion) || empty($minVersion)) {
            throw new \RuntimeException("Minimum version number not set");
        }
        if (version_compare(PHP_VERSION, $minPhpVersion) < 0) {
            throw new \RuntimeException("The PHP minimum version is " . $minPhpVersion);
        }
        if (version_compare(OctopusPressKernel::OCTOPUS_PRESS_VERSION, $minVersion) < 0) {
            throw new \RuntimeException("The octopus minimum version is " . $minVersion);
        }
        $meta = $this->optionRepository->findOneByName('active_plugins');
        assert($meta != null);
        $plugin->activate($this->bridger);
        $this->bridger->getHook()->action('plugin.activation', $name);
        $plugins = Formatter::reverseTransform($meta->getValue() ?: '', true);
        $plugins[] = $name;
        $meta->setValue(json_encode($plugins) ?: '');
        $this->optionRepository->add($meta);
        return true;
    }


    /**
     * @param string $name
     * @return bool|void
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function deactivate(string $name)
    {
        $plugin = $this->getPlugin($name);
        if ($plugin == null) {
            throw new \InvalidArgumentException("Invalid param `$name`");
        }
        $meta = $this->optionRepository->findOneByName('active_plugins');
        assert($meta != null);
        $this->bridger->getHook()->action('plugin.deactivate', $name);
        $plugins = Formatter::reverseTransform($meta->getValue() ?: '', true);
        if (($key = array_search($name, $plugins)) !== false) {
            unset($plugins[$key]);
        }
        $meta->setValue(json_encode($plugins) ?: '');
        $this->optionRepository->add($meta);
        return true;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function plugins(): array
    {
        if (!file_exists($this->getPluginDir())) {
            return [];
        }
        $activePlugins = $this->optionRepository->activePlugins();
        $dirs = new \DirectoryIterator($this->getPluginDir());
        $plugins = [];
        $settingPages = $this->bridger->getPlugin()->getSettingPages();
        if ($settingPages) {
            $settingPages = array_column($settingPages, null, 'plugin');
        }
        foreach ($dirs as $dir) {
            if (!$dir->isDir()) {
                continue;
            }
            $name = $dir->getFilename();
            if (in_array($name, ['.', '..'])) {
                continue;
            }
            $plugin = $this->getPlugin($name);
            if ($plugin == null) {
                continue;
            }
            $information = $plugin::manifest();
            $alias = u($name)->replaceMatches('/[^A-Za-z0-9_\-]++/', '')->lower()->toString();
            $actions = [];
            if (isset($settingPages[$alias])) {
                $actions[] = [
                    'link' => '/app/system/setting/general',
                    'query'=> ['page' => $settingPages[$alias]['path']],
                ];
            }
            $plugins[] = array_merge($information->jsonSerialize(), [
                'alias' => $name,
                'enabled' => in_array($name, $activePlugins),
                'actions' => in_array($name, $activePlugins)
                    ? $this->bridger->getHook()->filter('plugin_action_links', $actions, $alias)
                    : [],
            ]);
        }
        return $plugins;
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
            ->name('composer.json')
            ->in($tempPath);
        /**
         * @var SplFileInfo $composerFile
         */
        $composerFile = null;
        foreach ($finder as $file) {
            $composerFile = $file;
            break;
        }
        if ($composerFile == null) {
            throw new InvalidArgumentException('Zip archive composer.json file does not exist.');
        }
        $pathName = $composerFile->getPathname();
        $composer = json_decode(file_get_contents($pathName), true);
        $pluginRootPath = dirname($pathName);
        $pluginName = $composer['name'] ?? pathinfo($pluginRootPath, PATHINFO_BASENAME) ?? '';
        if (empty($pluginName)) {
            throw new InvalidArgumentException('Not in plugin pack format.');
        }
        $pluginName = explode('/', $pluginName)[1] ?? $pluginName;
        $name = Formatter::sanitizeWithDashes($pluginName);
        $pluginClassName = $this->getNameForClass($name);
        if (!file_exists($pluginRootPath . DIRECTORY_SEPARATOR . $pluginClassName . '.php')) {
            throw new InvalidArgumentException('Not in plugin pack format. File `' . $pluginClassName . '.php` not exist ');
        }
        $pluginPath = $this->getPluginDir(). DIRECTORY_SEPARATOR . $name;
        if (!file_exists($pluginPath)) {
            if (!is_writable($this->getPluginDir())) {
                throw new InvalidArgumentException('The plugin directory is not writable');
            }
            mkdir($pluginPath, 0755);
        }
        $filesystem = new FileSystem();
        $filesystem->mirror($pluginRootPath, $pluginPath, null, ['override' => true]);
        return $name;
    }

    /**
     * @return string[]
     */
    public function getActivatedPlugins(): array
    {
        return $this->optionRepository->activePlugins();
    }

    /**
     * @param string $name
     * @return string
     */
    public function getNameForClass(string $name): string
    {
        return u($name)->camel()->title()->toString();
    }

    /**
     * @param string $name
     * @return bool
     */
    public function down(string $name): bool
    {
        $plugin = $this->getPlugin($name);
        if ($plugin == null) {
            return false;
        }
        $plugin->uninstall($this->bridger);
        $this->bridger->getHook()->action('plugin.activation', $name);
        return true;
    }

    /**
     * @param ContainerInterface $container
     * @param Application|null $application
     * @return void
     */
    public function launchers(ContainerInterface $container, ?Application $application = null): void
    {
        $dispatcher = $this->bridger->getDispatcher();
        $activePlugins = $this->getActivatedPlugins();
        $pluginDir = $this->getPluginDir();
        $doctrine = $this->bridger->getDoctrine();
        $hook = $this->bridger->getHook();
        foreach ($activePlugins as $name) {
            $plugin = $this->getPlugin($name);
            if ($plugin == null) {
                continue;
            }
            $alias = u($name)->replaceMatches('/[^A-Za-z0-9_\-]++/', '')->lower()->toString();
            $manifest = $plugin::manifest();
            $manifest->setAlias($alias);
            if (empty($manifest->getPluginDir())) {
                $manifest->setPluginDir($pluginDir . DIRECTORY_SEPARATOR . $name);
            }
            if ($plugin instanceof EventSubscriberInterface) {
                $dispatcher->addSubscriber($plugin);
            }
            $services = $plugin->getServices($this->bridger);
            foreach ($services as $service) {
                $className = get_class($service);
                if ($container->has($className)) {
                    continue;
                }
                if ($service instanceof Command && $application) {
                    $application->add($service);
                } elseif ($application == null && $service instanceof Controller) {
                    $service->setDeps($doctrine);
                    $service->setContainer($container);
                    $container->set($className, $service);
                }
                if ($service instanceof EventSubscriberInterface) {
                    $dispatcher->addSubscriber($service);
                }
            }
            $this->registered[$alias] = [
                'plugin'   => $plugin,
                'manifest' => $manifest,
                'provider' => $plugin->provider($this->bridger),
            ];
            $plugin->launcher($this->bridger);
            $hook->action('plugin_launcher', $alias, $this);
            $hook->action('plugin_launcher_' . $alias, $this);
        }
    }

    /**
     * @param string $name
     * @return bool
     */
    public function isRegistered(string $name): bool
    {
        return isset($this->registered[$name]);
    }

    /**
     * @param string $name
     * @return PluginProviderInterface|null
     */
    public function provider(string $name): ?PluginProviderInterface
    {
        return $this->registered[$name]['provider'] ?? null;
    }


    /**
     * @return Bridger
     */
    public function getBridger(): Bridger
    {
        return $this->bridger;
    }

    /**
     * @param string $name
     * @return PluginInterface|null
     */
    public function getPlugin(string $name): ?PluginInterface
    {
        $pluginClassName = $this->getNameForClass($name);
        $classString = sprintf('OctopusPress\\Plugin\\%s\\%s', $pluginClassName, $pluginClassName);
        $this->registerPlugin($name);
        // 不直接判断存不存在，如果真得不存，直接判断会被composer标记为不存在。
        if (!class_exists($classString)) {
            return null;
        }
        /**
         * @var PluginInterface $class
         */
        $class = new $classString();
        if (!$class instanceof PluginInterface) {
            return null;
        }
        return $class;
    }

    /**
     * @return string
     */
    public function getPluginDir(): string
    {
        return $this->bridger->getPluginDir();
    }

    /**
     * @param string $name
     * @return void
     */
    private function registerPlugin(string $name): void
    {
        $loader = OctopusPressKernel::getLoader();
        if ($loader == null) {
            return ;
        }
        $composerFile = $this->getPluginDir() . DIRECTORY_SEPARATOR . $name . DIRECTORY_SEPARATOR . 'composer.json';
        if (!file_exists($composerFile)) {
            return ;
        }
        $composer = json_decode(file_get_contents($composerFile) ?: '[]', true);
        if (empty($composer['autoload'])) {
            return ;
        }
        $pluginPath = dirname($composerFile);
        foreach ($composer['autoload'] as $type => $maps) {
            switch (strtolower($type)) {
                case 'psr-4':
                    foreach ($maps as $namespace => $path) {
                        $loader->addPsr4($namespace, $pluginPath . '/' . $path);
                    }
                    break;
                case 'classmap':
                    // todo
                    $loader->addClassMap($maps);
                    break;
                case 'files':
                    foreach ($maps as $file) {
                        if (file_exists($pluginPath . '/' . $file)) {
                            include $pluginPath . '/' . $file;
                        }
                    }
                    break;
            }
        }
    }
}
