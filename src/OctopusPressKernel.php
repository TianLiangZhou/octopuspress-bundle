<?php

namespace OctopusPress\Bundle;

use Composer\Autoload\ClassLoader;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as HttpKernel;

abstract class OctopusPressKernel extends HttpKernel
{
    use MicroKernelTrait;

    private static ?ClassLoader $loader = null;

    const OCTOPUS_PRESS_VERSION = "1.0.0";

    public function __construct(string $environment, bool $debug)
    {
        parent::__construct($environment, $debug);

        static::getLoader();
    }

    /**
     * @return ClassLoader|null
     */
    public static function getLoader(): ?ClassLoader
    {
        if (static::$loader == null) {
            $classes = get_declared_classes();
            for ($len = count($classes), $i = $len - 1; $i > -1; $i--) {
                if (str_starts_with($classes[$i], 'ComposerAutoloaderInit')) {
                    static::$loader = call_user_func([$classes[$i], 'getLoader']);
                    break;
                }
            }
        }
        return static::$loader;
    }
}
