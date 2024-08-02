<?php

namespace OctopusPress\Bundle\Repository;

use OctopusPress\Bundle\Entity\UserMeta;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method UserMeta|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserMeta|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserMeta[]    findAll()
 * @method UserMeta[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserMetaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserMeta::class);
    }

    /**
     * @param UserMeta $entity
     * @param bool $flush
     */
    public function add(UserMeta $entity, bool $flush = true): void
    {
        $this->getEntityManager()->persist($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * @param UserMeta $entity
     * @param bool $flush
     */
    public function remove(UserMeta $entity, bool $flush = true): void
    {
        $this->getEntityManager()->remove($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    // /**
    //  * @return UserMeta[] Returns an array of UserMeta objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?UserMeta
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
