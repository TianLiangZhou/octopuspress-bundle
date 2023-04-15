<?php

namespace OctopusPress\Bundle\Util;

use Doctrine\ORM\AbstractQuery;
use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Symfony\Component\HttpFoundation\Request;

trait RepositoryTrait
{
    /**
     * @param Request $request
     * @param int $hydrationMode
     * @param callable|null $builderCallable
     * @return array Returns an array of Option objects
     */
    public function pagination(Request $request, int $hydrationMode = AbstractQuery::HYDRATE_ARRAY, callable $builderCallable = null): array
    {
        $all = $request->query->all();
        $builderQuery = $this->createQueryBuilder('a');
        if ($builderCallable) {
            call_user_func($builderCallable, $builderQuery, $all);
        }
        $this->addFilters($builderQuery, $all);
        $query = $builderQuery->getQuery();
        if (!isset($all['page'])) {
            $records = $query->getResult();
            return ['total' => count($records), 'records' => $this->handleRecords($records)];
        }
        $page = max((int) $all['page'], 1);
        $size = max((int) ($all['size'] ?? 30), 30);
        $paginator = new Paginator($query);
        if (($count = $paginator->count()) < 1) {
            return ['total' => 0, 'records' => []];
        }
        $records = $paginator->getQuery()
            ->setFirstResult($page * $size - $size)
            ->setMaxResults($size)
            ->getResult($hydrationMode);
        return [
            'total' => $count,
            'records' => $this->handleRecords($records),
        ];
    }
    /**
     * @param QueryBuilder $qb
     * @param array<string, string|int|null> $filters
     */
    abstract public function addFilters(QueryBuilder $qb, array $filters): void;

    /**
     * @param array<int, object> $records
     */
    abstract public function handleRecords(array $records): array;
}
