<?php

namespace OctopusPress\Bundle\Model;

use InvalidArgumentException;
use OctopusPress\Bundle\Controller\Controller;
use OctopusPress\Bundle\Entity\Option;
use OctopusPress\Bundle\OctopusPressKernel;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Plugin\Plugin;
use OctopusPress\Bundle\Plugin\PluginInterface;
use OctopusPress\Bundle\Plugin\PluginProviderInterface;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use OctopusPress\Bundle\Support\ActivatedPlugin;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

class PluginManager extends PackageManager
{
    /**
     * @var array
     */
    private array $registered = [];


    /**
     * @param string $name
     * @return bool
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function activate(string $name): bool
    {
        $installedPlugins = $this->optionRepository->installedPlugins();
        if (!isset($installedPlugins[$name])) {
            throw new \InvalidArgumentException('插件还未安装!');
        }
        $plugins = $this->getActivatedPlugins();
        if (in_array($name, $plugins)) {
            throw new \InvalidArgumentException('插件已激活!');
        }
        $pluginInfo = $installedPlugins[$name];
        $minVersion = $pluginInfo['miniOP'];
        $minPhpVersion = $pluginInfo['miniPHP'];
        if (version_compare(PHP_VERSION, $minPhpVersion) < 0) {
            throw new \RuntimeException("The PHP minimum version is " . $minPhpVersion);
        }
        if (version_compare(OctopusPressKernel::OCTOPUS_PRESS_VERSION, $minVersion) < 0) {
            throw new \RuntimeException("The octopus minimum version is " . $minVersion);
        }
        if (empty($pluginInfo['entrypoint'])) {
            throw new \InvalidArgumentException("插件入口不存在!");
        }
        $plugin = $this->getPlugin($name, $pluginInfo['entrypoint']);
        if ($plugin == null) {
            throw new \InvalidArgumentException("插件入口加载失败!");
        }
        $meta = $this->optionRepository->findOneByName('active_plugins');
        assert($meta != null);
        $plugin->activate($this->bridger);
        $this->bridger->getHook()->action('plugin.activation', $name);
        $plugins = $this->optionRepository->value('active_plugins', []);
        $plugins[] = $name;
        $meta->setValue(json_encode($plugins) ?: '[]');
        $this->optionRepository->add($meta);
        $this->migrateTo($name);
        return true;
    }

    /**
     * 迁移静态资源文件到web公共目录
     *
     * @param string $pluginName
     * @return void
     */
    private function migrateTo(string $pluginName): void
    {
        $openPluginDir = $this->getBridger()->getPublicDir(). DIRECTORY_SEPARATOR .'plugins';
        if (!is_writable($openPluginDir)) {
            throw new \UnexpectedValueException(sprintf("Directory `%s/plugins` does not have write permission", $openPluginDir), );
        }
        $publicPluginDir = $openPluginDir . DIRECTORY_SEPARATOR . $pluginName;
        if (!\file_exists($publicPluginDir)) {
            \mkdir($publicPluginDir, 0755, true);
        }
        $pluginDir = $this->getBridger()->getPluginDir() . DIRECTORY_SEPARATOR . $pluginName;
        $allowExt = [
            '*.html', '*.css', '*.js', '*.jpg', '*.jpeg', '*.png', '*.webp', '*.svg', '*.bmp', '*.ico', '*.gif',
            '*.flv', '*.mp4', '*.wav', '*.mp3', '*.ogg', '*.webm', '*.flac', '*.ttf', '*.woff', '*.eot', '*.woff2'
        ];
        $iterator = Finder::create()->name($allowExt)->in($pluginDir)->exclude(['dev', 'node_modules'])->getIterator();
        (new Filesystem())->mirror($pluginDir, $publicPluginDir, $iterator);
    }


    /**
     * @param string $name
     * @return bool|void
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function deactivate(string $name)
    {
        $installedPlugins = $this->optionRepository->installedPlugins();
        if (!isset($installedPlugins[$name])) {
            throw new \InvalidArgumentException('插件还未安装!');
        }
        $plugins = $this->getActivatedPlugins();
        if (!in_array($name, $plugins)) {
            throw new \InvalidArgumentException('插件还未激活!');
        }
        $pluginInfo = $installedPlugins[$name];
        $plugin = $this->getPlugin($name, $pluginInfo['meta']['entrypoint']);
        if ($plugin == null) {
            throw new \InvalidArgumentException("插件入口不存在");
        }
        $meta = $this->optionRepository->findOneByName('active_plugins');
        assert($meta != null);
        $this->bridger->getHook()->action('plugin.deactivate', $name);
        $plugins = $this->optionRepository->value('active_plugins', []);
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
        $activePlugins = $this->optionRepository->activePlugins();
        $installedPlugins = $this->optionRepository->installedPlugins();
        $settingPages = $this->bridger->getPlugin()->getSettingPages();
        if ($settingPages) {
            $settingPages = array_column($settingPages, null, 'plugin');
        }
        $plugins = [];
        $registeredInfo = [];
        if ($installedPlugins) {
            $response = $this->market('plugin', [
                'name' => array_keys($installedPlugins),
            ]);
            if (!empty($response['packages'])) {
                $registeredInfo = array_column($response['packages'], null, 'packageName');
            }
        }
        foreach ($installedPlugins as $name => $plugin) {
            $actions = [];
            if (isset($settingPages[$name])) {
                $actions[] = [
                    'link' => '/app/system/setting/general',
                    'query'=> ['page' => $settingPages[$name]['path']],
                ];
            }
            $plugin['enabled'] = in_array($name, $activePlugins);
            $plugin['actions'] = in_array($name, $activePlugins)
                ? $this->bridger->getHook()->filter('plugin_action_links', $actions, $name)
                : [];
            $plugin['upgradeable'] = false;
            if (isset($registeredInfo[$name])) {
                if (version_compare($registeredInfo[$name]['version'], $plugin['version'], '>')) {
                    $plugin['upgradeable'] = true;
                }
            }
            $plugins[] = $plugin;
        }
        return $plugins;
    }

    /**
     * @param array $packageInfo
     * @return string
     * @throws ORMException
     * @throws OptimisticLockException
     */
    protected function setup(array $packageInfo): string
    {
        $name = $packageInfo['packageName'];
        $pluginPath = $this->getPluginDir(). DIRECTORY_SEPARATOR . $name;
        if (!file_exists($pluginPath)) {
            if (!is_writable($this->getPluginDir())) {
                throw new InvalidArgumentException('The plugin directory is not writable');
            }
            mkdir($pluginPath, 0755);
        }
        $pluginRootPath = dirname($packageInfo['composerFile']);
        $filesystem = new FileSystem();
        $filesystem->mirror($pluginRootPath, $pluginPath, null, ['override' => true]);
        $activatedPlugins = $this->getActivatedPlugins();
        if (in_array($name, $activatedPlugins)) {
            $this->migrateTo($name);
        }
        $option = $this->optionRepository->findOneByName('installed_plugins');
        if ($option == null) {
            $option = new Option();
            $option->setName('installed_plugins');
        }
        $installed = $this->optionRepository->value('installed_plugins', []);
        unset($packageInfo['composerFile'], $packageInfo['packageFile'], $packageInfo['tempDir']);
        $installed[$name] = $packageInfo;
        $option->setValue($installed);
        $this->optionRepository->add($option);
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
     * @return bool
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function down(string $name): bool
    {
        $option = $this->optionRepository->findOneByName('installed_plugins');
        $installedPlugins = $this->optionRepository->value('installed_plugins', []);
        if (!isset($installedPlugins[$name])) {
            throw new \InvalidArgumentException("插件没有被安装!");
        }
        $plugin = $this->getPlugin($name, $installedPlugins[$name]['meta']['entrypoint']);
        if ($plugin == null) {
            throw new \InvalidArgumentException("插件入口不存在");
        }
        $plugin->uninstall($this->bridger);
        $this->bridger->getHook()->action('plugin.activation', $name);
        if (file_exists($this->getPluginDir() . DIRECTORY_SEPARATOR . $name)) {
            $fileSystem = new Filesystem();
            $fileSystem->remove([
                $this->getPluginDir() . DIRECTORY_SEPARATOR . $name
            ]);
        }
        unset($installedPlugins[$name]);
        $option->setValue($installedPlugins);
        $this->optionRepository->add($option);
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
        $installedPlugins = $this->optionRepository->installedPlugins();
        $doctrine = $this->bridger->getDoctrine();
        $hook = $this->bridger->getHook();
        $activatedPlugin = $this->bridger->get(ActivatedPlugin::class);
        foreach ($activePlugins as $name) {
            if (!isset($installedPlugins[$name])) {
                continue;
            }
            $plugin = $this->getPlugin($name, $installedPlugins[$name]['entrypoint']);
            if ($plugin == null) {
                continue;
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
            $activatedPlugin->add(new Plugin(
                $plugin,
                $name,
                $installedPlugins[$name]['version']
            ));
            $plugin->launcher($this->bridger);
            $hook->action('plugin_launcher', $name, $this);
            $hook->action('plugin_launcher_' . $name, $this);
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
     * @param string $entrypoint
     * @return PluginInterface|null
     */
    private function getPlugin(string $name, string $entrypoint): ?PluginInterface
    {
        $this->registerPlugin($name);
        // 不直接判断存不存在，如果真得不存在，直接判断会被composer标记为不存在。
        if (!class_exists($entrypoint)) {
            return null;
        }
        /**
         * @var PluginInterface $class
         */
        $class = new $entrypoint();
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
