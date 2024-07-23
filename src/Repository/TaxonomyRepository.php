<?php

namespace OctopusPress\Bundle\Repository;

use Doctrine\ORM\AbstractQuery;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use OctopusPress\Bundle\Entity\Term;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Util\RepositoryTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\Query;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method TermTaxonomy|null find($id, $lockMode = null, $lockVersion = null)
 * @method TermTaxonomy|null findOneBy(array $criteria, array $orderBy = null)
 * @method TermTaxonomy[]    findAll()
 * @method TermTaxonomy[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TaxonomyRepository extends ServiceEntityRepository
{
    use RepositoryTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TermTaxonomy::class);
    }

    /**
     * @param string $slug
     * @param string $taxonomy
     * @return TermTaxonomy|null
     * @throws NoResultException
     * @throws NonUniqueResultException
     */
    public function slug(string $slug, string $taxonomy): ?TermTaxonomy
    {
        $queryBuilder = $this->createQueryBuilder('tt');
        return $queryBuilder->where('tt.taxonomy = :taxonomy')
            ->setParameter('taxonomy', $taxonomy)
            ->leftJoin(
                Term::class,
                't',
                Join::WITH,
                'tt.term = t.id'
            )->andWhere('t.slug = :slug')
            ->setParameter('slug', $slug)
            ->getQuery()
            ->setMaxResults(1)
            ->getOneOrNullResult();
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(TermTaxonomy $entity, bool $flush = true): void
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
    public function remove(TermTaxonomy $entity, bool $flush = true): void
    {
        $this->_em->remove($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    /**
     * @param string $name
     * @return ?TermTaxonomy
     * @throws NonUniqueResultException
     */
    public function getNavigationTaxonomy(string $name): ?TermTaxonomy
    {
        return $this->createQueryBuilder('tt')
            ->leftJoin(Term::class, 't', Join::WITH, 'tt.term = t.id')
            ->andWhere('tt.taxonomy = :taxonomy AND t.name = :name')
            ->setParameter('taxonomy', TermTaxonomy::NAV_MENU)
            ->setParameter('name', $name)
            ->getQuery()
            ->getOneOrNullResult(AbstractQuery::HYDRATE_OBJECT);
    }

    /**
     * @return TermTaxonomy[]
     */
    public function categories(): array
    {
        return $this->taxonomies(TermTaxonomy::CATEGORY);
    }

    /**
     * @return TermTaxonomy[]
     */
    public function tags(): array
    {
        return $this->taxonomies(TermTaxonomy::TAG);
    }

    /**
     * @param string $taxonomy
     * @param array $otherCondition
     * @param int $limit
     * @param int $offset
     * @return array
     */
    public function taxonomies(string $taxonomy, array $otherCondition = [], int $limit = 50, int $offset = 1): array
    {
        $otherCondition['taxonomy'] = $taxonomy;
        $queryBuilder = $this->createQueryBuilder('a');
        $this->addFilters($queryBuilder, $otherCondition);
        return $queryBuilder->getQuery()
            ->enableResultCache(mt_rand(120, 240), 'taxonomy_query_' . md5(serialize($otherCondition)))
            ->setFetchMode(TermTaxonomy::class, 'term', ClassMetadata::FETCH_EAGER)
            ->setHint(Query::HINT_READ_ONLY, true)
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getResult();
    }

    /**
     * @param QueryBuilder $qb
     * @param array $filters
     * @return void
     */
    private function addFilters(QueryBuilder $qb, array $filters): void
    {
        // TODO: Implement addFilters() method.
        if (!empty($filters['_sort'])) {
            $qb->addOrderBy('a.id', 'DESC');
        }
        if (!empty($filters['id'])) {
            if (is_array($filters['id'])) {
                $qb->andWhere('a.id IN (:id)');
            }  else {
                $qb->andWhere('a.id = :id');
            }
            $qb->setParameter('id', is_array($filters['id']) ? array_map('intval', $filters['id']) : (int)$filters['id']);
        }
        if (!empty($filters['taxonomy'])) {
            if (is_array($filters['taxonomy'])) {
                $qb->andWhere('a.taxonomy IN (:taxonomies)');
            }  else {
                $qb->andWhere('a.taxonomy = :taxonomies');
            }
            $qb->setParameter('taxonomies', $filters['taxonomy']);
        }
        if (!empty($filters['parent']) && (is_integer($filters['parent']) || $filters['parent'] instanceof TermTaxonomy)) {
            $qb->andWhere('a.parent =:parent')->setParameter('parent', $filters['parent']);
        }
        if (!empty($filters['slug']) || !empty($filters['name'])) {
            if (!in_array('t', $qb->getAllAliases())) {
                $qb->leftJoin(Term::class, 't', Join::WITH, 'a.term=t.id');
            }
            if (!empty($filters['slug'])) {
                $qb->andWhere('t.slug = :slug')->setParameter('slug', $filters['slug']);
            }
            if (!empty($filters['name'])) {
                $qb->andWhere('t.name LIKE :name')->setParameter('name', $filters['name'] . '%');
            }
        }
    }

    /**
     * @param array<int, TermTaxonomy> $records
     * @return array
     */
    public function handleRecords(array $records): array
    {
        // TODO: Implement handleRecords() method.
        $items = [];
        foreach ($records as  $record) {
            $items[] = array_merge(
                $record->jsonSerialize(),
                $record->getTerm()->jsonSerialize(),
            );
        }
        return $items;
    }
}
