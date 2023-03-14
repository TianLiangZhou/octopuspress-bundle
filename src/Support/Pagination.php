<?php

namespace OctopusPress\Bundle\Support;

use ArrayAccess;
use Countable;
use IteratorAggregate;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Widget\WidgetInterface;
use Traversable;
use Twig\Environment;

/**
 * @template T
 * @implements IteratorAggregate<int, Post|TermTaxonomy>
 */
class Pagination implements Countable, IteratorAggregate, ArrayAccess, WidgetInterface
{
    /**
     * @var iterable
     */
    private iterable $items;
    /**
     * @var array|bool[]|int[]|string[]
     */
    private array $options;

    private Environment $twig;

    public function __construct(Environment $twig, iterable $items, array $options = [])
    {
        $this->items = $items;
        $this->options = array_merge([
            'total' => 0,
            'limit' => 0,
            'currentPage' => 1,
            'pageName' => 'page',
            'pageRange'=> 7,
            'containerClass' => '',
            'activeClass' => '',
            'disabledClass' => '',
            'template' => '',
            'query'    => [],
        ], $options);
        $this->twig = $twig;
    }

    public function render(array $attributes = []): string
    {
        return "";
    }

    public function __toString(): string
    {
        return $this->render();
    }


    /**
     * @return Traversable
     */
    public function getIterator(): Traversable
    {
        if (is_array($this->items)) {
            return new \ArrayIterator($this->items);
        }
        return $this->items;
    }

    /**
     * @return int
     */
    public function count(): int
    {
        // TODO: Implement count() method.
        return count($this->items);
    }

    /**
     * @return int
     */
    public function getLimit(): int
    {
        return (int) $this->options['limit'];
    }

    /**
     * @return string
     */
    public function getPageName(): string
    {
        return (string) $this->options['pageName'];
    }

    /**
     * @return int
     */
    public function getCurrentPage(): int
    {
        return (int) $this->options['currentPage'];
    }

    /**
     * @return int
     */
    public function getTotal(): int
    {
        return (int) $this->options['total'];
    }

    /**
     * @return int
     */
    public function getPageRange(): int
    {
        return (int) $this->options['pageRange'];
    }

    /**
     * @return array<string, int>
     */
    private function getPaginationData(): array
    {
        $pageCount = $this->getPageCount();
        $current = $this->getCurrentPage();
        $pageRange = $this->getPageRange();
        if ($pageRange > $pageCount) {
            $pageRange = $pageCount;
        }
        $delta = \ceil($pageRange / 2);
        if ($current - $delta > $pageCount - $pageRange) {
            $pages = \range($pageCount - $pageRange + 1, $pageCount);
        } else {
            if ($current - $delta < 0) {
                $delta = $current;
            }
            $offset = $current - $delta;
            $pages = \range($offset + 1, $offset + $pageRange);
        }
        $proximity = \floor($pageRange / 2);
        $startPage = $current - $proximity;
        $endPage = $current + $proximity;
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
            'current' => $current,
            'numItemsPerPage' => $this->getLimit(),
            'first' => 1,
            'pageCount' => $pageCount,
            'totalCount' => $this->getTotal(),
            'pageRange' => $pageRange,
            'startPage' => $startPage,
            'endPage' => $endPage,
        ];

        if ($current > 1) {
            $viewData['previous'] = $current - 1;
        }

        if ($current < $pageCount) {
            $viewData['next'] = $current + 1;
        }
        $viewData['pagesInRange'] = $pages;
        $viewData['firstPageInRange'] = \min($pages);
        $viewData['lastPageInRange'] = \max($pages);
        if (($count = $this->count()) > 0) {
            $viewData['currentItemCount'] = $count;
            $viewData['firstItemNumber'] = 0;
            $viewData['lastItemNumber'] = 0;
            if ($viewData['totalCount'] > 0) {
                $viewData['firstItemNumber'] = (($current - 1) * $this->getLimit()) + 1;
                $viewData['lastItemNumber'] = $viewData['firstItemNumber'] + $viewData['currentItemCount'] - 1;
            }
        }
        return $viewData;
    }

    /**
     * @return int
     */
    public function getPageCount(): int
    {
        return (int) \ceil($this->getTotal() / $this->getLimit());
    }

    /**
     * @param mixed $offset
     * @return bool
     */
    public function offsetExists(mixed $offset): bool
    {
        return isset($this->items[$offset]);
    }

    /**
     * @param mixed $offset
     * @return Post|TermTaxonomy|null
     */
    public function offsetGet(mixed $offset): Post|TermTaxonomy|null
    {
        if ($this->offsetExists($offset)) {
            return $this->items[$offset];
        }
        return null;
    }

    /**
     * @param mixed $offset
     * @param mixed $value
     * @return void
     */
    public function offsetSet(mixed $offset, mixed $value): void
    {
        // TODO: Implement offsetSet() method. Not change
    }

    /**
     * @param mixed $offset
     * @return void
     */
    public function offsetUnset(mixed $offset): void
    {
        // TODO: Implement offsetUnset() method. Not delete
    }
}
