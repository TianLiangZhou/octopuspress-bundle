<?php

namespace OctopusPress\Bundle\Repository;

use Doctrine\ORM\AbstractQuery;
use Doctrine\ORM\NonUniqueResultException;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\Term;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Util\RepositoryTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
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
     * @throws \Doctrine\ORM\NoResultException
     * @throws \Doctrine\ORM\NonUniqueResultException
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
     * @throws \Doctrine\ORM\NonUniqueResultException
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
     * @param int|null $limit
     * @param int|null $offset
     * @return array
     */
    public function taxonomies(string $taxonomy, array $otherCondition = [], ?int $limit = null, ?int $offset = null): array
    {
        $otherCondition['taxonomy'] = $taxonomy;
        $queryBuilder = $this->createQueryBuilder('a');
        $this->addFilters($queryBuilder, $otherCondition);
        return $queryBuilder->getQuery()
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
        $qb->leftJoin(Term::class, 't', Join::WITH, 'a.term = t.id');
        $qb->addOrderBy('a.id', 'DESC');
        foreach ($filters as $name => $value) {
            if ('' === $value) {
                continue;
            }
            switch ($name) {
                case 'taxonomy':
                    $qb->andWhere($qb->expr()->eq('a.taxonomy', ':' . $name));
                    break;
                case 'name':
                    $qb->andWhere($qb->expr()->like('t.name', ':' . $name));
                    $value = '%' . $value . '%';
                    break;
                case 'parent':
                    $qb->andWhere('a.parent = :parent');
                    break;
                default:
                    continue 2;
            }
            $qb->setParameter($name, $value);
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
