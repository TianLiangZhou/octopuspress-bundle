<?php

namespace OctopusPress\Bundle\Support;

use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Entity\User;
use stdClass;

class ArchiveDataSet
{
    private TermTaxonomy|User|stdClass $archiveTaxonomy;
    private iterable $collection;

    public function __construct(TermTaxonomy|User|stdClass $archiveTaxonomy, iterable $collection)
    {
        $this->archiveTaxonomy = $archiveTaxonomy;
        $this->collection = $collection;
    }

    /**
     * @return stdClass|TermTaxonomy|User
     */
    public function getArchiveTaxonomy(): stdClass|TermTaxonomy|User
    {
        return $this->archiveTaxonomy;
    }

    /**
     * @return iterable
     */
    public function getCollection(): iterable
    {
        return $this->collection;
    }
}
