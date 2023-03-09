<?php

namespace Octopus\PressBundle\Tests\Model;

use Octopus\PressBundle\Model\PluginManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class PluginManagerTest extends KernelTestCase
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
    public function testDownloadUrlMaster()
    {
        $container = static::getContainer();

        /**
         * @var $manager PluginManager
         */
        $manager = $container->get(PluginManager::class);

        $targetUrl = 'https://github.com/TianLiangZhou/ffi-pinyin/archive/refs/heads/master.zip';

        $this->assertTrue($manager->getGithubDownloadUrl('https://github.com/TianLiangZhou/ffi-pinyin') == $targetUrl);
    }

    /**
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     */
    public function testDownloadUrlTag()
    {
        $container = static::getContainer();

        /**
         * @var $manager PluginManager
         */
        $manager = $container->get(PluginManager::class);

        $targetUrl = 'https://github.com/TianLiangZhou/ffi-pinyin/archive/refs/tags/v1.2.0.zip';

        $this->assertTrue($manager->getGithubDownloadUrl('https://github.com/TianLiangZhou/ffi-pinyin/tree/v1.2.0') == $targetUrl);
    }

    /**
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     */
    public function testDownloadUrlBranch()
    {
        $container = static::getContainer();

        /**
         * @var $manager PluginManager
         */
        $manager = $container->get(PluginManager::class);

        $targetUrl = 'https://github.com/TianLiangZhou/ffi-pinyin/archive/refs/heads/develop.zip';

        $this->assertTrue($manager->getGithubDownloadUrl('https://github.com/TianLiangZhou/ffi-pinyin/tree/develop') == $targetUrl);
    }


    public function testDown()
    {
        $container = static::getContainer();

        /**
         * @var $manager PluginManager
         */
        $manager = $container->get(PluginManager::class);

        $this->assertTrue($manager->down('test'));

    }
}
