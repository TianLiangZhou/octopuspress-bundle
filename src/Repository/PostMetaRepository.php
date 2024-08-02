<?php

namespace OctopusPress\Bundle\Repository;

use OctopusPress\Bundle\Entity\PostMeta;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method PostMeta|null find($id, $lockMode = null, $lockVersion = null)
 * @method PostMeta|null findOneBy(array $criteria, array $orderBy = null)
 * @method PostMeta[]    findAll()
 * @method PostMeta[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PostMetaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PostMeta::class);
    }

    /**
     * @param PostMeta $entity
     * @param bool $flush
     */
    public function add(PostMeta $entity, bool $flush = true): void
    {
        $this->getEntityManager()->persist($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * @param PostMeta $entity
     * @param bool $flush
     */
    public function remove(PostMeta $entity, bool $flush = true): void
    {
        $this->getEntityManager()->remove($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    // /**
    //  * @return PostMeta[] Returns an array of PostMeta objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?PostMeta
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
