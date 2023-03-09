<?php

namespace Octopus\PressBundle\Tests\Model;

use Octopus\PressBundle\Model\ThemeManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ThemeManagerTest extends KernelTestCase
{

    public function setUp(): void
    {
        parent::setUp(); // TODO: Change the autogenerated stub

        self::bootKernel();
    }

    /**
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     */
    public function testActivate()
    {
        $container = static::getContainer();

        /**
         * @var $manager ThemeManager
         */
        $manager = $container->get(ThemeManager::class);

        $manager->activate(ThemeManager::DEFAULT_THEME);

        $this->assertDirectoryExists($manager->targetDir(ThemeManager::DEFAULT_THEME));
    }

    public function testInactivation()
    {
        $container = static::getContainer();

        /**
         * @var $manager ThemeManager
         */
        $manager = $container->get(ThemeManager::class);

        $manager->deactivate(ThemeManager::DEFAULT_THEME);

        $this->assertDirectoryDoesNotExist($manager->targetDir(ThemeManager::DEFAULT_THEME));
    }
}
