<?php

namespace OctopusPress\Bundle\Repository;

use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\PostMeta;
use OctopusPress\Bundle\Util\RepositoryTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\ORM\Query;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Post|null find($id, $lockMode = null, $lockVersion = null)
 * @method Post|null findOneBy(array $criteria, array $orderBy = null)
 * @method Post[]    findAll()
 * @method Post[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PostRepository extends ServiceEntityRepository
{
    use RepositoryTrait;


    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Post::class);
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(Post $entity, bool $flush = true): void
    {
        $this->_em->persist($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    /**
     * @param array $filters
     * @param callable|null $closure
     * @return Query
     */
    public function createQuery(array $filters = [], callable $closure = null): Query
    {
        $queryBuilder = $this->createQueryBuilder('a');
        $queryBuilder->leftJoin(PostMeta::class, 'm', Join::WITH, 'a.id = m.post');
        if ($filters) {
            $this->addFilters($queryBuilder, $filters);
        }
        if ($closure != null) {
            call_user_func($closure, $queryBuilder);
        }
        return $queryBuilder->getQuery();
    }


    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function remove(Post $entity, bool $flush = true): void
    {
        $this->_em->remove($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }


    /**
     * @param Post[] $posts
     * @return void
     */
    public function thumbnails(array $posts): void
    {
        $attachmentIdArray = [];
        foreach ($posts as $post) {
            if (!($post instanceof Post) || ($id = $post->getThumbnailId()) < 1) {
                continue;
            }
            $attachmentIdArray[$post->getId()] = $id;
        }
        if (count($attachmentIdArray) < 1) {
            return ;
        }
        $attachments = $this->findBy([
            'id' => array_values($attachmentIdArray),
            'type'=> Post::TYPE_ATTACHMENT,
        ]);
        $mapAttachment = [];
        foreach ($attachments as $attachment) {
            $mapAttachment[$attachment->getId()] = $attachment;
        }
        foreach ($posts as $post) {
            if (!isset($mapAttachment[$post->getId()])) {
                continue;
            }
            $post->setThumbnail($mapAttachment[$post->getId()]);
        }
    }

    public function addFilters(QueryBuilder $qb, array $filters): void
    {
        if (isset($filters['_sort']) && $filters['_sort']) {
            $order = isset($filters['_order']) && $filters['_order'] === 'DESC' ? 'DESC' : 'ASC';
            switch ($filters['_sort']) {
                case 'id':
                    $qb->addOrderBy('a.id', $order);
                    break;
                case 'modifiedAt':
                    $qb->addOrderBy('a.modifiedAt', $order);
                    break;
            }
        }

        // TODO: Implement addFilters() method.
        foreach ($filters as $name => $value) {
            if ('' === $value) {
                continue;
            }
            switch ($name) {
                case 'id':
                    is_array($value) ? $qb->andWhere("a.id IN (:id)") : $qb->andWhere("a.id = :id");
                    break;
                case 'type':
                    $qb->andWhere("a.type = :type");
                    break;
                case 'author':
                    $qb->andWhere("a.author = :author");
                    break;
                case 'status':
                    is_array($value) ? $qb->andWhere("a.status IN (:status)") : $qb->andWhere("a.status = :status");
                    break;
                case 'date':
                    $yearMonth = explode('-', $value);
                    if (count($yearMonth) !== 2) {
                        continue 2;
                    }
                    $year = (int) $yearMonth[0];
                    $month = (int) $yearMonth[1];
                    [$cYear, $cMonth] = explode('|', date('Y|m'));
                    if ($year < 1970 || $year > $cYear) {
                        $year = (int) $cYear;
                    }
                    if ($month < 1 || $month > 12) {
                        $month = (int) $cMonth;
                    }
                    $nextMonth = $month + 1;
                    if ($nextMonth > 12) {
                        $nextMonth = 1;
                    }
                    $qb->andWhere(
                      'a.createdAt >= :start AND a.createdAt < :end'
                    );
                    $qb->setParameter('start', sprintf('%d-%d-1 00:00:00', $year, $month))
                        ->setParameter('end', sprintf('%d-%d-1 00:00:00', $year, $nextMonth));
                    continue 2;
                case 'title':
                    $qb->andWhere($qb->expr()->like('a.title', ':title'));
                    $value = '%' . $value . '%';
                    break;
                default:
                    continue 2;
            }
            $qb->setParameter($name, $value);
        }

    }

    /**
     * @param array<int, Post> $records
     * @return array
     */
    public function handleRecords(array $records): array
    {
        // TODO: Implement handleRecords() method.
        $items = [];
        foreach ($records as $record) {
            $author = $record->getAuthor();
//            $termRelationships = $record->getTermRelationships();
            $taxonomies = [];
//            foreach ($termRelationships as $relationship) {
//                $taxonomy = $relationship->getTaxonomy();
//                $taxonomies[] = array_merge(
//                    $taxonomy->jsonSerialize(),
//                    $taxonomy->getTerm()->jsonSerialize()
//                );
//            }
            $items[] = array_merge(
                $record->jsonSerialize(),
                [
                    'author' => [
                        'id' => $author->getId(),
                        'account'  => $author->getAccount(),
                        'nickname' => $author->getNickname(),
                    ],
                    'relationships' => $taxonomies,
                    'createdAt' => $record->getCreatedAt()->format('Y-m-d H:i'),
                    'modifiedAt' => $record->getModifiedAt()->format('Y-m-d H:i'),
                ]
            );
        }
        return $items;
    }
}
