<?php
namespace OctopusPress\Bundle\Command;

use OctopusPress\Bundle\Model\PluginManager;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Finder\Finder;

class AutoloadCommand extends Command
{

    private PluginManager $pluginManager;

    public function __construct(PluginManager $pluginManager)
    {
        parent::__construct(null);
        $this->pluginManager = $pluginManager;
    }

    protected function configure(): void
    {
        $this->setName('octopus:autoload')
            ->setDescription("Migrate plugin composer to app 'composer.json'.");
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $kernel = $this->getApplication()->getKernel();
        $pluginDir = $this->pluginManager->getPackageDir();

        $finder = Finder::create()
            ->in([$pluginDir])
            ->name(['composer.json'])
            ->depth([1]);
        $appComposerFile = $kernel->getProjectDir() . DIRECTORY_SEPARATOR . 'composer.json';
        $appComposer = json_decode(file_get_contents($appComposerFile) ?: '[]', true);
        $plugins = [];
        foreach ($finder as $item) {
            $composerFile = $item->getPathname();
            $composer = json_decode(file_get_contents($composerFile) ?: '[]', true);
            if (!empty($composer['require'])) {
                $appComposer['require'] = array_merge($appComposer['require'], $composer['require']);
            }
            $plugins[] = $item->getRelativePath();
            if (!empty($composer['autoload'])) {
                foreach ($composer['autoload'] as $type => $maps) {
                    switch ($type) {
                        case 'psr-4':
                            $psr = array_map(
                                function ($path) use ($item) {
                                    return 'plugins/' . $item->getRelativePath() . '/' . $path;
                                },
                                $maps
                            );
                            $appComposer['autoload']['psr-4'] = array_merge($appComposer['autoload']['psr-4'], $psr);
                            break;
                        case 'classmap':
                            $appComposer['autoload']['classmap'] = array_merge($appComposer['autoload']['classmap'] ?? [], $maps);
                            break;
                        case 'files':
                            $appComposer['autoload']['files'] = array_merge($appComposer['autoload']['files'] ?? [], $maps);
                            break;
                    }
                }
            }
        }
        $io = new SymfonyStyle($input, $output);
        if ($finder->count() > 0) {
            file_put_contents(
                $appComposerFile,
                json_encode($appComposer, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
            );
            $io->success("composer.json modified");
            $io->note("Please execute the 'composer install --no-dev' command");
        }
        if (count($plugins) > 0) {
            $loaded = $kernel->getCacheDir() . DIRECTORY_SEPARATOR . '.plugin_loaded';
            file_put_contents($loaded, implode("\n", $plugins));
        }
        return Command::SUCCESS;
    }
}
