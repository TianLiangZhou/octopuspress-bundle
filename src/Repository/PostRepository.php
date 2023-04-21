<?php

namespace OctopusPress\Bundle\Repository;

use Doctrine\ORM\AbstractQuery;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\Tools\Pagination\Paginator;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\PostMeta;
use OctopusPress\Bundle\Entity\TermRelationship;
use OctopusPress\Bundle\Entity\User;
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
        if (empty($filters['status'])) {
            $filters['status'] = Post::STATUS_PUBLISHED;
        }
        if (empty($filters['type']) && empty($filters['id'])) {
            $filters['type'] = Post::TYPE_POST;
        }
        $this->addFilters($queryBuilder, $filters);
        if ($closure != null) {
            call_user_func($closure, $queryBuilder);
        }
        $query = $queryBuilder->getQuery()
            ->enableResultCache(mt_rand(180, 300), 'post_query_' . md5(serialize($filters)))
            ->setFetchMode(Post::class, "author", ClassMetadata::FETCH_EAGER)
            ->setFetchMode(Post::class, "parent", ClassMetadata::FETCH_EAGER);
        return $query->setHint(Query::HINT_READ_ONLY, true);
    }

    /**
     * @param array $filters
     * @param callable|null $closure
     * @return array
     */
    public function createThumbnailQuery(array $filters = [], callable $closure = null): array
    {
        $records = $this->createQuery($filters, $closure)->getResult();
        if ($records) {
            $this->thumbnails($records);
        }
        return $records;
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
        $attachments = $this->createQuery([
            'id' => array_values($attachmentIdArray),
            'type' => Post::TYPE_ATTACHMENT,
        ])->getResult();
        $mapAttachment = [];
        foreach ($attachments as $attachment) {
            $mapAttachment[$attachment->getId()] = $attachment;
        }
        foreach ($posts as $post) {
            if (!isset($attachmentIdArray[$post->getId()])) {
                continue;
            }
            $thumbnailId = $attachmentIdArray[$post->getId()];
            if (!isset($mapAttachment[$thumbnailId])) {
                continue;
            }
            $post->setThumbnail($mapAttachment[$thumbnailId]);
        }
    }

    public function addFilters(QueryBuilder $qb, array $filters): void
    {
        if (isset($filters['_sort']) && $filters['_sort']) {
            $order = isset($filters['_order']) && $filters['_order'] ? 'DESC' : 'ASC';
            switch ($filters['_sort']) {
                case 'id':
                    $qb->addOrderBy('a.id', $order);
                    break;
                case 'title':
                    $qb->addOrderBy('a.title', $order);
                    break;
                case 'createdAt':
                    $qb->addOrderBy('a.createdAt', $order);
                    break;
                case 'menuOrder';
                    $qb->addOrderBy('a.menuOrder', $order);
                    break;
            }
        }
        // Priority setting conditions
        if (!empty($filters['id'])) {
            if (is_array($filters['id'])) {
                $qb->andWhere('a.id IN (:id)')->setParameter('id', array_map('intval', $filters['id']));
            }  else {
                $qb->andWhere('a.id = :id')->setParameter('id', (int) $filters['id']);
            }
        }
        if (!empty($filters['author'])) {
            if (is_array($filters['author'])) {
                $qb->andWhere('a.author IN (:author)')->setParameter('author', array_map('intval', $filters['author']));
            }  else {
                $qb->andWhere('a.author = :author')->setParameter('author', (int) $filters['author']);
            }
        }
        if (!empty($filters['type'])) {
            if (is_array($filters['type'])) {
                $qb->andWhere('a.type IN (:type)')->setParameter('type', $filters['type']);
            }  else {
                $qb->andWhere('a.type = :type')->setParameter('type',  $filters['type']);
            }
        }
        if (!empty($filters['status'])) {
            if (is_array($filters['status'])) {
                $qb->andWhere('a.status IN (:status)')->setParameter('status', $filters['status']);
            }  else {
                if ($filters['status'] === Post::STATUS_PUBLISHED) {
                    $qb->andWhere('(a.status = :publish OR a.status = :private)');
                    $qb->setParameter('publish', Post::STATUS_PUBLISHED)
                        ->setParameter('private', Post::STATUS_PRIVATE);
                } else {
                    $qb->andWhere('a.status = :status')->setParameter('status',  $filters['status']);
                }
            }
        }
        if (isset($filters['parent'])) {
            if (empty($filters['parent'])) {
                $qb->andWhere('a.parent IS NULL');
            } else {
                $qb->andWhere('a.parent = :parent')->setParameter('parent', (int) $filters['parent']);
            }
        }
        if (!empty($filters['date'])) {
            $yearMonth = explode('-', $filters['date']);
            if (count($yearMonth) === 2) {
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
            }
        }
        if (!empty($filters['title'])) {
            $qb->andWhere($qb->expr()->like('a.title', ':title'))
                ->setParameter('title', $filters['title'] . '%');
        }
    }

    /**
     * @param Post[] $records
     * @return array
     */
    public function handleRecords(array $records): array
    {
        // TODO: Implement handleRecords() method.
        $items = [];
        foreach ($records as $record) {
            $author = $record->getAuthor();
            $collection = $record->getTermRelationships();
            $taxonomies = [];
            foreach ($collection as $item) {
                $termTaxonomy = $item->getTaxonomy();
                $taxonomies[] = array_merge($termTaxonomy->jsonSerialize(), $termTaxonomy->getTerm()->jsonSerialize());
            }
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
