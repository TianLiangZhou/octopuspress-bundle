<?php

namespace OctopusPress\Bundle\Command;

use OctopusPress\Bundle\Model\PluginManager;
use OctopusPress\Bundle\Bridge\Bridger;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Command\HelpCommand;
use Symfony\Component\Console\ConsoleEvents;
use Symfony\Component\Console\Event\ConsoleCommandEvent;
use Symfony\Component\Console\Helper\DescriptorHelper;
use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class PluginCommand extends Command implements EventSubscriberInterface
{
    private PluginManager $manager;
    private Bridger $bridger;

    private const NAME = 'octopus:plugin';

    public function __construct(PluginManager $pluginManager, Bridger $bridger)
    {
        parent::__construct(self::NAME);
        $this->manager = $pluginManager;
        $this->bridger = $bridger;
    }

    protected function configure(): void
    {
        $this->setDescription("Some usages of plugin commands")
            ->setDefinition([
                new InputArgument('directive', InputArgument::OPTIONAL, 'Plugin commands to execute.'),
                new InputOption('format', null, InputOption::VALUE_OPTIONAL, 'The output format (txt, xml, json, or md) [default: "txt"].', 'txt'),
                new InputOption('raw', null, InputOption::VALUE_OPTIONAL, 'To output raw command plugin list.'),
                new InputOption('short', null, InputOption::VALUE_OPTIONAL, ' To skip describing commands\' arguments.')
            ])
            ->ignoreValidationErrors();

    }

    /**
     * @param ConsoleCommandEvent $event
     * @return void
     */
    public function onBeforeCommand(ConsoleCommandEvent $event): void
    {
        $command = $event->getCommand();
        if ($command instanceof $this) {
            $this->registerCommands();
        }
        if ($command instanceof HelpCommand) {
            $input = $event->getInput();
            $commandString = $input->getArgument('command');
            if ($commandString !== self::NAME) {
                return ;
            }
            $this->registerCommands();
            $commandName = $input->getArgument('command_name');
            if ($commandName === 'help') {
                return ;
            }
            if (!str_starts_with($commandName, 'plugin:')) {
                $commandName = 'plugin:' . $commandName;
            }
            $subCommand = $this->getApplication()->get($commandName);
            $command->setCommand($subCommand);
        }
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     * @throws \Exception
     */
    public function execute(InputInterface $input, OutputInterface $output): int
    {
        $argv = $_SERVER['argv'];
        $directive = $input->getArgument('directive');
        array_shift($argv);
        if (empty($directive)) {
            $command = array_shift($argv);
            $directive = 'list';
            array_unshift($argv, $command, $directive);
        }
        if ($directive === 'list') {
            return $this->listCommand($input, $output);
        }
        if (!str_starts_with($argv[1], 'plugin:')) {
            $argv[1] = 'octopus:plugin:' . $argv[1];
        }
        $subInput = new ArgvInput($argv);
        return $this->getApplication()->run($subInput, $output);
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     */
    private function listCommand(InputInterface $input, OutputInterface $output): int
    {
        $helper = new DescriptorHelper();
        $helper->describe($output, $this->getApplication(), [
            'format' => $input->getOption('format'),
            'raw_text' => $input->getOption('raw'),
            'namespace' => 'plugin',
            'short' => $input->getOption('short'),
        ]);

        return 0;
    }

    /**
     * @return void
     */
    private function registerCommands(): void
    {
        $activatedPlugins = $this->manager->getActivatedPlugins();
        foreach ($activatedPlugins as $pluginName) {
            $plugin = $this->manager->getPlugin($pluginName);
            if ($plugin == null) {
                continue;
            }
            foreach ($plugin->getServices($this->bridger) as $command) {
                if ($command instanceof Command) {
                    $this->getApplication()->add($command);
                }
            }
        }
    }

    /**
     * @return \array[][]
     */
    public static function getSubscribedEvents(): array
    {
        // TODO: Implement getSubscribedEvents() method.
        return [
            ConsoleEvents::COMMAND => [['onBeforeCommand', 64]]
        ];
    }
}
