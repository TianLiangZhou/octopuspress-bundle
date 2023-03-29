<?php

namespace OctopusPress\Bundle\Controller;

use Doctrine\ORM\Tools\Pagination\Paginator;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Repository\PostRepository;
use OctopusPress\Bundle\Repository\RelationRepository;
use OctopusPress\Bundle\Repository\TaxonomyRepository;
use OctopusPress\Bundle\Repository\UserRepository;
use OctopusPress\Bundle\Support\ArchiveDataSet;
use OctopusPress\Bundle\Widget\Pagination;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

/**
 *
 */
class PostController extends Controller
{
    private PostRepository $post;
    private TaxonomyRepository $taxonomy;
    private UserRepository $user;
    private RelationRepository $relation;
    private OptionRepository $option;

    public function __construct(Bridger $bridger)
    {
        parent::__construct($bridger);
        $this->taxonomy = $bridger->getTaxonomyRepository();
        $this->user     = $bridger->getUserRepository();
        $this->post     = $bridger->getPostRepository();
        $this->relation = $bridger->getRelationRepository();
        $this->option   = $bridger->getOptionRepository();
    }

    /**
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @throws \Doctrine\ORM\NoResultException
     */
    #[Route('/tag/{slug}', name: 'tag', requirements: [
        'slug' => '[a-z0-9\-_%]{2,}'
    ])]
    public function tag(string $slug, Request $request): ArchiveDataSet
    {
        $taxonomy = $this->taxonomy->slug($slug, TermTaxonomy::TAG);
        if ($taxonomy == null) {
            throw new NotFoundHttpException();
        }
        return new ArchiveDataSet(
            $taxonomy,
            $this->filterTaxonomyResult($taxonomy, $request)
        );
    }

    /**
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @throws \Doctrine\ORM\NoResultException
     */
    #[Route('/category/{slug}', name: 'category', requirements: [
        'slug' => '[a-z0-9\-_%]{2,}'
    ])]
    public function category(string $slug, Request $request): ArchiveDataSet
    {
        $taxonomy = $this->taxonomy->slug($slug, TermTaxonomy::CATEGORY);
        if ($taxonomy == null) {
            throw new NotFoundHttpException();
        }
        return new ArchiveDataSet(
            $taxonomy,
            $this->filterTaxonomyResult($taxonomy, $request)
        );
    }

    /**
     * @param string $slug
     * @param Request $request
     * @return ArchiveDataSet
     */
    #[Route('/author/{slug}', name: 'author', requirements: [])]
    public function author(string $slug, Request $request): ArchiveDataSet
    {
        $user = $this->user->findOneBy(['account' => $slug,]);
        if ($user == null) {
            throw new NotFoundHttpException();
        }
        return new ArchiveDataSet(
            $user,
            $this->filterPostsResult(['author' => $user], $request)
        );
    }

    /**
     * @param int $year
     * @param int $month
     * @param Request $request
     * @return ArchiveDataSet
     */
    #[Route('/archives/{year}-{month}', name: 'archives', requirements: ['year' => '[\d+]{4}', 'month' => '[\d+]{2}'])]
    public function archives(int $year, int $month, Request $request): ArchiveDataSet
    {
        return new ArchiveDataSet(
            new \stdClass(),
            $this->filterPostsResult(['date' => $year . '-' . $month], $request)
        );
    }

    #[Route('/p/{id}', name: 'post_permalink_number', requirements: ['id' => '\d+'], methods: Request::METHOD_GET)]
    #[Route('/{year}/{month}/{name}', name: 'post_permalink_date', requirements: [
        'year' => '\d{4}',
        'month' => '\d{2}',
        'name' => '[a-z0-9\-%_]{2,}'
    ], methods: Request::METHOD_GET)]
    #[Route('/{name}', name: 'post_permalink_name', requirements: [
        'name' => '[a-z0-9\-%_]{2,}'
    ], methods: Request::METHOD_GET, priority: -127)]
    public function show(Request $request): Post
    {
        $attribute = $request->attributes->all();
        $post = null;
        if (!empty($attribute['id'])) {
            $post = $this->post->find((int)$attribute['id']);
        } elseif (!empty($attribute['name'])) {
            $post = $this->post->findOneBy(['name' => $attribute['name']]);
        }
        if ($post == null) {
            throw new NotFoundHttpException();
        }
        if (!empty($attribute['year'])) {
            [$year, $month] = explode('-', $post->getCreatedAt()->format('Y-m'));
            if ($year != $attribute['year'] && $month != $attribute['month']) {
                throw new NotFoundHttpException();
            }
        }
        if ($post->getType() == 'page') {
            $request->attributes->set('_route', 'page');
        }
        $this->post->thumbnails([$post]);
        return $post;
    }

    /**
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @throws \Doctrine\ORM\NoResultException
     */
    #[Route('/{taxonomy}/{slug}', name: 'taxonomy', requirements: [
        'taxonomy' => '[a-z_]{2,}',
        'slug' => '[a-z0-9\-_%]{2,}'
    ], priority: -127)]
    public function taxonomy(string $taxonomy, string $slug, Request $request): ArchiveDataSet
    {
        $termTaxonomy = $this->bridger->getTaxonomy();
        if (!$termTaxonomy->exists($taxonomy)) {
            throw new NotFoundHttpException();
        }
        $taxonomy = $this->taxonomy->slug($slug, $taxonomy);
        if ($taxonomy == null) {
            throw new NotFoundHttpException();
        }
        return new ArchiveDataSet(
            $taxonomy,
            $this->filterTaxonomyResult($taxonomy, $request)
        );
    }

    /**
     * @param TermTaxonomy $taxonomy
     * @param Request $request
     * @return array
     * @throws \Doctrine\ORM\NoResultException
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    private function filterTaxonomyResult(TermTaxonomy $taxonomy, Request $request): iterable
    {
        $limit = $this->option->postsPerPage();
        $page = max(1, $request->query->getInt('paged', 1));
        $count = $this->relation->getTaxonomyObjectCount($taxonomy->getId());
        $records = [];
        if ($count > 0 && ceil($count / $limit) >= $page) {
            $objects = $this->relation->getTaxonomyObjectQuery($taxonomy->getId())
                ->setFirstResult($page * $limit - $limit)
                ->setMaxResults($limit)
                ->getArrayResult();
            $ids = array_map(function ($item) {
                return $item['object_id'];
            }, $objects);
            $records = $this->post->createQuery([
                'id' => $ids,
                '_sort' => 'id',
                '_order'=> 'DESC',
            ])->getResult();
        }
        if ($records) {
            $this->post->thumbnails($records);
        }
        $this->bridger->getWidget()->get('pagination')
            ->put([
                'limit' => $limit,
                'total' => $count,
                'currentPage' => $page,
                'currentCount'=> count($records),
            ]);
        return $records;
    }

    /**
     * @param array $filter
     * @param Request $request
     * @return Pagination
     */
    private function filterPostsResult(array $filter, Request $request): iterable
    {
        $filter['_sort'] = 'id';
        $filter['_order'] = 'DESC';
        $limit = $this->option->postsPerPage();
        $page = max(1, $request->query->getInt('paged', 1));
        $query = $this->post->createQuery($filter);
        $paginator = new Paginator($query);
        $count = $paginator->count();
        $records = [];
        if ($count > 0 && ceil($count / $limit) >= $page) {
            $records = $paginator->getQuery()
                ->setFirstResult($page * $limit - $limit)
                ->setMaxResults($limit)
                ->getResult();
        }
        if ($records) {
            $this->post->thumbnails($records);
        }
        $this->bridger->getWidget()->get('pagination')
            ->put([
                'limit' => $limit,
                'total' => $count,
                'currentPage' => $page,
                'currentCount'=> count($records),
            ]);
        return $records;
    }
}
