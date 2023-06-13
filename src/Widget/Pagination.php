<?php

namespace OctopusPress\Bundle\Widget;

use IteratorAggregate;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use Traversable;
use Twig\TemplateWrapper;

/**
 * @template T
 * @implements IteratorAggregate<int, Post|TermTaxonomy>
 */
class Pagination extends AbstractWidget implements IteratorAggregate
{
    /**
     * @return Traversable
     */
    public function getIterator(): Traversable
    {
        return new \ArrayIterator([]);
    }


    /**
     * @return array<string, int>
     */
    private function getPaginationData(int $total, int $limit, int $currentPage = 1, int $pageRange = 7, int $currentCount = 0): array
    {
        $pageCount = (int) \ceil($total / $limit);
        if ($pageRange > $pageCount) {
            $pageRange = $pageCount;
        }
        $delta = \ceil($pageRange / 2);
        if ($currentPage - $delta > $pageCount - $pageRange) {
            $pages = \range($pageCount - $pageRange + 1, $pageCount);
        } else {
            if ($currentPage - $delta < 0) {
                $delta = $currentPage;
            }
            $offset = $currentPage - $delta;
            $pages = \range($offset + 1, $offset + $pageRange);
        }
        $proximity = \floor($pageRange / 2);
        $startPage = $currentPage - $proximity;
        $endPage = $currentPage + $proximity;
        if ($startPage < 1) {
            $endPage = \min($endPage + (1 - $startPage), $pageCount);
            $startPage = 1;
        }

        if ($endPage > $pageCount) {
            $startPage = \max($startPage - ($endPage - $pageCount), 1);
            $endPage = $pageCount;
        }

        $viewData = [
            'last' => $pageCount,
            'current' => $currentPage,
            'numItemsPerPage' => $limit,
            'first' => 1,
            'pageCount' => $pageCount,
            'totalCount' => $total,
            'pageRange' => $pageRange,
            'startPage' => $startPage,
            'endPage' => $endPage,
        ];

        if ($currentPage > 1) {
            $viewData['previous'] = $currentPage - 1;
        }

        if ($currentPage < $pageCount) {
            $viewData['next'] = $currentPage + 1;
        }
        $viewData['pagesInRange'] = $pages;
        $viewData['firstPageInRange'] = \min($pages);
        $viewData['lastPageInRange'] = \max($pages);
        if ($currentCount > 0) {
            $viewData['currentItemCount'] = $currentCount;
            $viewData['firstItemNumber'] = 0;
            $viewData['lastItemNumber'] = 0;
            if ($viewData['totalCount'] > 0) {
                $viewData['firstItemNumber'] = (($currentPage - 1) * $limit) + 1;
                $viewData['lastItemNumber'] = $viewData['firstItemNumber'] + $viewData['currentItemCount'] - 1;
            }
        }
        return $viewData;
    }

    protected function template(): string|TemplateWrapper
    {
        // TODO: Implement template() method.
        return '';
    }

    protected function context(array $attributes = []): array
    {
        // TODO: Implement context() method.
        $limit = (int) ($attributes['limit'] ?? 30);
        $total = (int) ($attributes['total'] ?? 0);
        if ($total < 0 || $total < $limit || $limit < 1) {
            return [
                'previous' => null,
                'last'  => null,
                'links' => [],
                'startLinks' => [],
                'endLinks'  => [],
            ];
        }
        $pageRange = max(7, (int) ($attributes['pageRange'] ?? 7));
        $pageName = (string) ($attributes['pageName'] ?? 'paged');
        $request = $this->getBridger()
            ->getRequest();
        $currentPage = $request->query->getInt($pageName, 1);
        $currentCount = (int) ($attributes['currentCount'] ?? $limit);
        $data = $this->getPaginationData($total, $limit, $currentPage, $pageRange, $currentCount);
        $all = $request->query->all();
        $requestURI = $request->server->get('ORIGIN_REQUEST_URI');
        $uri = $request->getUriForPath(parse_url($requestURI, PHP_URL_PATH));

        $previous = $next = null;
        if (isset($data['previous'])) {
            $previous = [
                'link' => $uri . '?' . http_build_query(array_merge($all, [$pageName => $data['previous']])),
                'text' => $attributes['previous'] ?? 'Previous',
            ];
        }
        if (isset($data['next'])) {
            $next = [
                'link' => $uri . '?' . http_build_query(array_merge($all, [$pageName => $data['next']])),
                'text' => $attributes['next'] ?? 'Next',
            ];
        }
        $links = [];
        foreach ($data['pagesInRange'] as $datum) {
            $links[] = [
                'link' => $datum == $currentPage
                    ? null
                    : $uri . '?' . http_build_query(array_merge($all, [$pageName => $datum])),
                'text' => $datum,
            ];
        }
        $startLinks = $endLinks = [];
        if ($data['startPage'] > 1) {
            $startLinks[] = [
                'link' => $uri . '?' . http_build_query(array_merge($all, [$pageName => 1])),
                'text' => 1,
            ];
            if ($data['startPage'] == 3) {
                $startLinks[] = [
                    'link' => $uri . '?' . http_build_query(array_merge($all, [$pageName => 2])),
                    'text' => 2,
                ];
            } else {
                $startLinks[] = ['link' => null, 'text' => '...',];
            }
        }

        if ($data['pageCount'] > $data['endPage']) {
            if ($data['pageCount'] > ($data['endPage'] + 1)) {
                if ($data['pageCount'] > ($data['endPage'] + 2)) {
                    $endLinks[] = [
                        'link' => null,
                        'text' => '...',
                    ];
                } else {
                    $endLinks[] = [
                        'link' => $uri . '?' . http_build_query(array_merge($all, [$pageName => $data['pageCount'] - 1])),
                        'text' => $data['pageCount'] - 1,
                    ];
                }
            }
            $endLinks[] = [
                'link' => $uri . '?' . http_build_query(array_merge($all, [$pageName => $data['pageCount']])),
                'text' => $data['pageCount'],
            ];
        }



        return [
            'previous' => $previous,
            'links' => $links,
            'next'  => $next,
            'startLinks' => $startLinks,
            'endLinks'  => $endLinks,
        ];
    }

    public function delayRegister(): void
    {
        // TODO: Implement delayRegister() method.
        $this->setLabel("分页");
        $this->setIcon('more-horizontal-outline');
        $this->addTemplate('@OctopusPressBundle/default/bootstrap.pagination.twig');
    }
}
