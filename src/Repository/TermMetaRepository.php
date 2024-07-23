<?php

namespace OctopusPress\Bundle\Repository;

use Doctrine\ORM\Exception\ORMException;
use OctopusPress\Bundle\Entity\TermMeta;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method TermMeta|null find($id, $lockMode = null, $lockVersion = null)
 * @method TermMeta|null findOneBy(array $criteria, array $orderBy = null)
 * @method TermMeta[]    findAll()
 * @method TermMeta[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TermMetaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TermMeta::class);
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(TermMeta $entity, bool $flush = true): void
    {
        $this->_em->persist($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function remove(TermMeta $entity, bool $flush = true): void
    {
        $this->_em->remove($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    // /**
    //  * @return TermMeta[] Returns an array of TermMeta objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('t.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?TermMeta
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
