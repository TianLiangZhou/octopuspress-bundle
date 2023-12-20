<?php

namespace OctopusPress\Bundle\Repository;

use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use OctopusPress\Bundle\Entity\Comment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Util\RepositoryTrait;

/**
 * @method Comment|null find($id, $lockMode = null, $lockVersion = null)
 * @method Comment|null findOneBy(array $criteria, array $orderBy = null)
 * @method Comment[]    findAll()
 * @method Comment[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CommentRepository extends ServiceEntityRepository
{
    use RepositoryTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Comment::class);
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(Comment $entity, bool $flush = true): void
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
    public function remove(Comment $entity, bool $flush = true): void
    {
        $this->_em->remove($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    /**
     * @param Post $post
     * @return Comment[]
     */
    public function findApprovedByPost(Post $post): array
    {
        /**
         * @var $results Comment[]
         */
        $results = $this->createQueryBuilder('c')
            ->where('c.post = :post AND c.approved = :approved')
            ->setParameter('post', $post)
            ->setParameter('approved', Comment::APPROVED)
            ->addOrderBy('c.createdAt', 'ASC')
            ->getQuery()
            ->setFetchMode(Comment::class, "user", ClassMetadata::FETCH_EAGER)
            ->setFetchMode(Comment::class, "parent", ClassMetadata::FETCH_EAGER)
            ->setFetchMode(Comment::class, "children", ClassMetadata::FETCH_EAGER)
            ->getResult();
        return $results;
    }


    private function addFilters(QueryBuilder $qb, array $filters): void
    {
        // TODO: Implement addFilters() method.
        $qb->addOrderBy('a.id', 'DESC');
        foreach ($filters as $name => $value) {
            if (null === $value) {
                continue;
            }
            switch ($name) {
                case 'type':
                    $qb->andWhere("a.type = :type");
                    break;
                case 'approved':
                    is_array($value) ? $qb->andWhere('a.approved IN (:approved)') : $qb->andWhere('a.approved = :approved');
                    break;
                case 'user':
                    is_array($value) ? $qb->andWhere('a.user IN (:user)') : $qb->andWhere('a.user = :user');
                    break;
                default:
                    continue 2;
            }
            $qb->setParameter($name, $value);
        }

    }

    /**
     * @param Comment[] $records
     * @return array
     */
    public function handleRecords(array $records): array
    {
        // TODO: Implement handleRecords() method.
        return $records;
    }
}
