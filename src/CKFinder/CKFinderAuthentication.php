<?php

namespace OctopusPress\Bundle\CKFinder;

use CKSource\Bundle\CKFinderBundle\Authentication\AuthenticationInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 *
 */
class CKFinderAuthentication implements AuthenticationInterface
{

    /**
     * @return bool
     */
    public function authenticate(): bool
    {
        // TODO: Implement authenticate() method.
        return true;
    }

    public function setContainer(?ContainerInterface $container)
    {
        // TODO: Implement setContainer() method.
    }
}
