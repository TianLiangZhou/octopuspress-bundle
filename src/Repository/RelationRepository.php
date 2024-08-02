<?php

namespace OctopusPress\Bundle\Repository;

use Doctrine\ORM\Exception\ORMException;
use OctopusPress\Bundle\Entity\TermRelationship;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\Query;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method TermRelationship|null find($id, $lockMode = null, $lockVersion = null)
 * @method TermRelationship|null findOneBy(array $criteria, array $orderBy = null)
 * @method TermRelationship[]    findAll()
 * @method TermRelationship[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RelationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TermRelationship::class);
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(TermRelationship $entity, bool $flush = true): void
    {
        $this->getEntityManager()->persist($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * @param array|int $taxonomyId
     * @return int
     */
    public function getTaxonomyObjectCount(array|int $taxonomyId): int
    {
        $queryBuilder = $this->createQueryBuilder('r')
            ->select('count(r.post) as object_id');
        if (is_array($taxonomyId)) {
            $queryBuilder->andWhere('r.taxonomy IN (:taxonomyId)')
                ->setParameter('taxonomyId', $taxonomyId);
        } else {
            $queryBuilder->andWhere('r.taxonomy = :taxonomyId')
                ->setParameter('taxonomyId', $taxonomyId);
        }
        return $queryBuilder->getQuery()->getSingleScalarResult();
    }

    /**
     * @param array|int $taxonomyId
     * @return Query
     */
    public function getTaxonomyObjectQuery(array|int $taxonomyId): Query
    {
        $queryBuilder = $this->createQueryBuilder('r')
            ->select('(r.post) as object_id');
        if (is_array($taxonomyId)) {
            $queryBuilder->andWhere('r.taxonomy IN (:taxonomyId)')
                ->setParameter('taxonomyId', $taxonomyId);
        } else {
            $queryBuilder->andWhere('r.taxonomy = :taxonomyId')
                ->setParameter('taxonomyId', $taxonomyId);
        }
        return $queryBuilder->addOrderBy('r.post', 'DESC')->getQuery();
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function remove(TermRelationship $entity, bool $flush = true): void
    {
        $this->getEntityManager()->remove($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
