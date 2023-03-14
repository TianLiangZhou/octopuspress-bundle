<?php

namespace OctopusPress\Bundle\Controller;

use OctopusPress\Bundle\Bridge\Bridger;

class TaxonomyController extends Controller
{
    public function __construct(Bridger $bridger)
    {
        parent::__construct($bridger);
    }
}
