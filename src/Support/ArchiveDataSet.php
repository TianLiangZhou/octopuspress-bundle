<?php

namespace OctopusPress\Bundle\Support;

use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Entity\User;
use stdClass;

class ArchiveDataSet
{
    private TermTaxonomy|User|stdClass $taxonomy;
    private Pagination $pagination;

    public function __construct(TermTaxonomy|User|stdClass $taxonomy, Pagination $pagination)
    {
        $this->taxonomy = $taxonomy;
        $this->pagination = $pagination;
    }

    /**
     * @return stdClass|TermTaxonomy|User
     */
    public function getTaxonomy(): stdClass|TermTaxonomy|User
    {
        return $this->taxonomy;
    }

    /**
     * @return Pagination
     */
    public function getPagination(): Pagination
    {
        return $this->pagination;
    }
}
