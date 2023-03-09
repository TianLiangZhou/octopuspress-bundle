<?php

namespace OctopusPress\Bundle\Event;

use OctopusPress\Bundle\Entity\TermTaxonomy;

class TaxonomyEvent extends OctopusEvent
{
    private TermTaxonomy $taxonomy;

    public function __construct(TermTaxonomy $taxonomy)
    {
        $this->taxonomy = $taxonomy;
    }

    /**
     * @return TermTaxonomy
     */
    public function getTaxonomy(): TermTaxonomy
    {
        return $this->taxonomy;
    }
}
