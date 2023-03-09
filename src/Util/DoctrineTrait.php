<?php declare(strict_types=1);

namespace OctopusPress\Bundle\Util;

use Doctrine\ORM\EntityManager;

/**
 * Requires a property doctrine or type Doctrine\Persistence\ManagerRegistry to be present
 */
trait DoctrineTrait
{
    /**
     * @return EntityManager
     */
    protected function getEM(): EntityManager
    {
        /** @var EntityManager $em */
        $em = $this->doctrine->getManager();

        return $em;
    }
}
