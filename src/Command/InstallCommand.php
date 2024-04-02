<?php
namespace OctopusPress\Bundle\Command;

use OctopusPress\Bundle\Model\PluginManager;
use OctopusPress\Bundle\Model\ThemeManager;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Throwable;

class InstallCommand extends Command
{
    private PluginManager $pluginManager;
    private ThemeManager $themeManager;

    public function __construct(PluginManager $pluginManager, ThemeManager $themeManager)
    {
        parent::__construct(null);
        $this->pluginManager = $pluginManager;
        $this->themeManager = $themeManager;
    }


    protected function configure(): void
    {
        $this->setName('octopus:install')
            ->setDefinition([
                new InputArgument('uri', InputArgument::REQUIRED, 'It can ask for a local file or a remote url.')
            ])
            ->setDescription('Install remote or local plugins.');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $uri = $input->getArgument('uri');

        if (filter_var($uri, FILTER_VALIDATE_URL) === false && !is_file($uri)) {
            return Command::FAILURE;
        }
        if (filter_var($uri, FILTER_VALIDATE_URL) === false) {
            $filepath = $this->pluginManager->getBridger()->getTempDir() . DIRECTORY_SEPARATOR . $uri;
        } else {
            $filepath = $this->pluginManager->downloadGithubPackage($uri);
        }
        if (!file_exists($filepath)) {
            return Command::FAILURE;
        }
        if (strtolower(pathinfo($filepath, PATHINFO_EXTENSION)) != 'zip') {
            return Command::FAILURE;
        }
        try {
            $this->pluginManager->externalInstall($filepath);
        } catch (Throwable $exception) {
            return Command::FAILURE;
        }
        return Command::SUCCESS;
    }
}
