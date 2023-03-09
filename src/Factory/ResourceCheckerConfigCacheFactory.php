<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace OctopusPress\Bundle\Factory;

use Symfony\Component\Config\ConfigCacheFactoryInterface;
use Symfony\Component\Config\ConfigCacheInterface;
use Symfony\Component\Config\ResourceCheckerConfigCache;
use Symfony\Component\Config\ResourceCheckerInterface;
use Symfony\Component\Routing\RouterInterface;

/**
 * A ConfigCacheFactory implementation that validates the
 * cache with an arbitrary set of ResourceCheckers.
 *
 * @author Matthias Pigulla <mp@webfactory.de>
 */
class ResourceCheckerConfigCacheFactory implements ConfigCacheFactoryInterface
{
    private RouterInterface $router;
    /**
     * @var array|iterable|ResourceCheckerInterface[]
     */
    private iterable $resourceCheckers;

    /**
     * @param iterable<int, ResourceCheckerInterface> $resourceCheckers
     */
    public function __construct(RouterInterface $router, iterable $resourceCheckers = [])
    {
        $this->router = $router;
        $this->resourceCheckers = $resourceCheckers;
    }

    /**
     * {@inheritdoc}
     */
    public function cache(string $file, callable $callable): ConfigCacheInterface
    {
        $cache = new ResourceCheckerConfigCache($file, $this->resourceCheckers);
        $isFresh = $cache->isFresh();
        if (!$isFresh) {
            $callable($cache);
        }
        if ($isFresh) {
            $count = $this->router->getRouteCollection()->count();
            $config = require $file;
            $existCount = count($config);
            if (isset($config[1])) {
                $existCount = count($config[1]) + count($config[3]);
            }
            if ($existCount != $count) {
                $callable($cache);
            }
        }
        return $cache;
    }
}
