<?php

namespace OctopusPress\Bundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\DescriptorHelper;
use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class PluginCommand extends Command
{
    public const NAME = 'octopus:plugin';

    public function __construct()
    {
        parent::__construct(self::NAME);
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
}
