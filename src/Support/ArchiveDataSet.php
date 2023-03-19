<?php

namespace OctopusPress\Bundle\Support;

use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Entity\User;
use stdClass;

class ArchiveDataSet
{
    private TermTaxonomy|User|stdClass $taxonomy;
    private iterable $collection;

    public function __construct(TermTaxonomy|User|stdClass $taxonomy, iterable $collection)
    {
        $this->taxonomy = $taxonomy;
        $this->collection = $collection;
    }

    /**
     * @return stdClass|TermTaxonomy|User
     */
    public function getTaxonomy(): stdClass|TermTaxonomy|User
    {
        return $this->taxonomy;
    }

    /**
     * @return iterable
     */
    public function getCollection(): iterable
    {
        return $this->collection;
    }
}
