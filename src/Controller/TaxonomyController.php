<?php

namespace OctopusPress\Bundle\Controller;

use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Repository\TaxonomyRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

class TaxonomyController extends Controller
{
    private TaxonomyRepository $taxonomyRepository;

    public function __construct(Bridger $bridger)
    {
        parent::__construct($bridger);
        $this->taxonomyRepository = $bridger->getTaxonomyRepository();
    }

    /**
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @throws \Doctrine\ORM\NoResultException
     */
    #[Route('/tag/{slug}', name: 'tag', requirements: [
        'slug' => '[a-z0-9\-_%]{2,}'
    ])]
    public function tag(string $slug): TermTaxonomy
    {
        $taxonomy = $this->taxonomyRepository->slug($slug, TermTaxonomy::TAG);
        if ($taxonomy == null) {
            throw new NotFoundHttpException();
        }
        return $taxonomy;
    }

    /**
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @throws \Doctrine\ORM\NoResultException
     */
    #[Route('/category/{slug}', name: 'category', requirements: [
        'slug' => '[a-z0-9\-_%]{2,}'
    ])]
    public function category(string $slug): TermTaxonomy
    {
        $taxonomy = $this->taxonomyRepository->slug($slug, TermTaxonomy::CATEGORY);
        if ($taxonomy == null) {
            throw new NotFoundHttpException();
        }
        return $taxonomy;
    }

    /**
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @throws \Doctrine\ORM\NoResultException
     */
    #[Route('/{taxonomy}/{slug}', name: 'taxonomy', requirements: [
        'taxonomy' => '[a-z_]{2,}',
        'slug' => '[a-z0-9\-_%]{2,}'
    ], priority: -127)]
    public function taxonomy(string $taxonomy, string $slug): TermTaxonomy
    {
        $termTaxonomy = $this->bridger->getTaxonomy();
        if (!$termTaxonomy->exists($taxonomy)) {
            throw new NotFoundHttpException();
        }
        $taxonomy = $this->taxonomyRepository->slug($slug, $taxonomy);
        if ($taxonomy == null) {
            throw new NotFoundHttpException();
        }
        return $taxonomy;
    }
}
