<?php

namespace OctopusPress\Bundle\Repository;

use OctopusPress\Bundle\Entity\CommentMeta;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method CommentMeta|null find($id, $lockMode = null, $lockVersion = null)
 * @method CommentMeta|null findOneBy(array $criteria, array $orderBy = null)
 * @method CommentMeta[]    findAll()
 * @method CommentMeta[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CommentMetaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CommentMeta::class);
    }

    /**
     * @param CommentMeta $entity
     * @param bool $flush
     */
    public function add(CommentMeta $entity, bool $flush = true): void
    {
        $this->getEntityManager()->persist($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * @param CommentMeta $entity
     * @param bool $flush
     */
    public function remove(CommentMeta $entity, bool $flush = true): void
    {
        $this->getEntityManager()->remove($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    // /**
    //  * @return CommentMeta[] Returns an array of CommentMeta objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?CommentMeta
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
