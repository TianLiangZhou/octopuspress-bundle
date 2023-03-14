<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Controller\Admin;


use Doctrine\ORM\AbstractQuery;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\OptimisticLockException;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\Term;
use OctopusPress\Bundle\Entity\TermMeta;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Event\OctopusEvent;
use OctopusPress\Bundle\Event\TaxonomyEvent;
use OctopusPress\Bundle\Form\Type\TaxonomyType;
use OctopusPress\Bundle\Repository\TaxonomyRepository;
use Exception;
use OctopusPress\Bundle\Repository\TermRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\AsciiSlugger;
use function Symfony\Component\String\u;

/**
 * Class CategoryController
 * @package App\Controller\Backend
 */
#[Route('/taxonomy', name: 'taxonomy_')]
class TaxonomyController extends AdminController
{

    /**
     * @var TaxonomyRepository
     */
    protected TaxonomyRepository $repository;
    protected TermRepository $termRepository;

    /**
     * @param Bridger $bridger
     */
    public function __construct(Bridger $bridger)
    {
        parent::__construct($bridger);
        $this->repository = $bridger->getTaxonomyRepository();
        $this->termRepository = $bridger->getTermRepository();
    }

    /**
     * @param array $categories
     * @param array $children
     * @param int $parent
     * @param int $level
     * @param array $result
     * @return array
     */
    protected function rows(array $categories, array $children, int $parent = 0, int $level = 0, array $result = []): array
    {
        foreach ($categories as $key => $taxonomy) {
            if ($taxonomy['parent'] != $parent) {
                continue;
            }
            $taxonomy['level'] = $level;
            $result[] = $taxonomy;
            unset($categories[$key]);
            if (isset($children[$taxonomy['id']])) {
                $result = $this->rows($categories, $children, $taxonomy['id'], $level + 1, $result);
            }
        }
        return $result;
    }

    #[Route('/{taxonomy}', name: 'sets', requirements: ['taxonomy' => '[a-z0-9\-_%]{2,}'], methods: Request::METHOD_GET, priority: -1)]
    public function sets(string $taxonomy, Request $request): JsonResponse
    {
        if (!$this->bridger->getTaxonomy()->exists($taxonomy)) {
            return $this->json([
                'message' => 'error',
            ], Response::HTTP_NOT_FOUND);
        }
        $termTaxonomy = $this->bridger->getTaxonomy()->getTaxonomy($taxonomy);
        if (!$termTaxonomy->isShowUi()) {
            return $this->json([
                'message' => 'error',
            ], Response::HTTP_FORBIDDEN);
        }
        $request->query->set('taxonomy', $taxonomy);
        $sets = $this->repository->pagination($request, AbstractQuery::HYDRATE_OBJECT);
        if ($termTaxonomy->isHierarchical()) {
            $children = [];
            if ($sets['total'] > 0) {
                foreach ($sets['records'] as $category) {
                    if ($category['parent'] > 0) {
                        $children[$category['parent']][] = $category['id'];
                    }
                }
                $sets['records'] = $this->rows($sets['records'], $children);
            }
        }
        return $this->json($sets);
    }

    /**
     * @param TermTaxonomy $taxonomy
     * @return JsonResponse
     */
    #[Route('/{id}', name: 'show', requirements: ['id' => '\d+'])]
    public function show(TermTaxonomy $taxonomy): JsonResponse
    {
        $jsonSerialize = array_merge(
            $taxonomy->jsonSerialize(),
            $taxonomy->getTerm()->jsonSerialize()
        );
        $registeredMeta = $this->bridger->getMeta()->getTermTaxonomy($taxonomy->getTaxonomy());
        $keyRegisteredMetaMap = $registeredMeta ? array_column($registeredMeta, null, 'key') : [];
        $metas = [];
        $collection = $taxonomy->getTerm()->getMetas();
        foreach ($collection as $meta) {
            if (isset($keyRegisteredMetaMap[$meta->getMetaKey()])) {
                continue;
            }
            $metaSetting = $keyRegisteredMetaMap[$meta->getMetaKey()];
            if (!$metaSetting['showUi']) {
                continue;
            }
            $metas[$meta->getMetaKey()] = $meta->getMetaValue();
        }
        $jsonSerialize['meta'] = (object) $metas;
        return $this->json($jsonSerialize);
    }


    /**
     * @param Request $request
     * @return JsonResponse
     */
    #[Route('/registered', name: 'registered', methods: Request::METHOD_GET)]
    public function registered(Request $request): JsonResponse
    {
        $termTaxonomy = $this->bridger->getTaxonomy();
        $data = [];
        if ($request->query->has('taxonomy') && ($taxonomy = $request->query->get('taxonomy'))) {
            $data[$taxonomy] = $termTaxonomy->getTaxonomy($taxonomy);
        } else {
            foreach ($termTaxonomy->getTaxonomies() as $slug => $taxonomy) {
                $data[$slug] = $taxonomy->jsonSerialize();
            }
        }
        return $this->json($data);
    }


    /**
     * @param Request $request
     * @param string $taxonomy
     * @return JsonResponse
     */
    #[Route('/{taxonomy}/store', name: 'store', methods: Request::METHOD_POST)]
    public function create(string $taxonomy, Request $request): JsonResponse
    {
        if (($response = $this->checkTaxonomy($taxonomy))) {
            return $response;
        }
        return $this->save(new TermTaxonomy(), $request);
    }

    /**
     * @param TermTaxonomy $termTaxonomy
     * @param Request $request
     * @param string $taxonomy
     * @return JsonResponse
     */
    #[Route('/{taxonomy}/{id}/update', name: 'update', requirements: ['id' => '\d+'], methods: Request::METHOD_POST)]
    public function edit(string $taxonomy, TermTaxonomy $termTaxonomy, Request $request): JsonResponse
    {
        if (($response = $this->checkTaxonomy($taxonomy))) {
            return $response;
        }
        return $this->save($termTaxonomy, $request);
    }


    /**
     * @param string $taxonomy
     * @param Request $request
     * @return JsonResponse
     * @throws ORMException
     * @throws OptimisticLockException
     */
    #[Route('/{taxonomy}/delete', name: 'delete', methods: [Request::METHOD_POST, Request::METHOD_DELETE])]
    public function remove(string $taxonomy, Request $request): JsonResponse
    {
        if (($response = $this->checkTaxonomy($taxonomy))) {
            return $response;
        }
        $sets = $request->toArray()['sets'] ?? [];
        $sets = array_map('intval', $sets);
        if (empty($sets)) {
            return $this->json(['message' => ''], Response::HTTP_NOT_ACCEPTABLE);
        }
        $taxonomies = $this->repository->findBy([
            'id' => $sets,
            'taxonomy' => $taxonomy,
        ]);
        $eventDispatcher = $this->bridger->getDispatcher();
        foreach ($taxonomies as $taxonomy) {
            $postDeleteEvent = new TaxonomyEvent($taxonomy);
            $eventDispatcher->dispatch($postDeleteEvent, OctopusEvent::TAXONOMY_DELETE);
            $this->getEM()->remove($taxonomy);
        }
        $this->getEM()->flush();
        return $this->json([]);
    }

    /**
     * @param string $taxonomy
     * @return JsonResponse|null
     */
    private function checkTaxonomy(string $taxonomy): ?JsonResponse
    {
        $termTaxonomy = $this->bridger->getTaxonomy();
        if (!$termTaxonomy->exists($taxonomy)) {
            return $this->json([
                'message' => "未注册的类别: '$taxonomy'",
            ], Response::HTTP_NOT_ACCEPTABLE);
        }
        if (!$termTaxonomy->getTaxonomy($taxonomy)->isShowUi()) {
            return $this->json([
                'message' => "该类别不支持操作",
            ], Response::HTTP_NOT_ACCEPTABLE);
        }
        return null;
    }

    /**
     * @param TermTaxonomy $taxonomy
     * @param Request $request
     * @return JsonResponse
     * @throws NonUniqueResultException
     */
    private function save(TermTaxonomy $taxonomy, Request $request): JsonResponse
    {
        $taxonomies = $this->bridger->getTaxonomy()->getNames();
        try {
            $form = $this->validation(TaxonomyType::class, $taxonomy, $request->toArray(), [
                'taxonomies' => array_combine($taxonomies, $taxonomies),
            ]);
        } catch (\Throwable $exception) {
            return $this->json([
                'message' => $exception->getMessage(),
            ], Response::HTTP_NOT_ACCEPTABLE);
        }
        if (($parentId = (int) $form->get('parent')->getNormData()) > 0) {
            $parent = $this->repository->find($parentId);
            if ($parent && $parent->getTaxonomy() === $taxonomy->getTaxonomy() && $parentId != $taxonomy->getId()) {
                $taxonomy->setParent($parent);
            }
        }
        $name = $form->get('name')->getNormData();
        $slug = $form->get('slug')->getNormData();
        if (empty($slug)) {
            $slug = (new AsciiSlugger('zh'))->slug($name)->lower()->toString();
        }
        $slug = $this->bridger->getHook()->filter('taxonomy_slug', $slug, $name);
        $term = $taxonomy->getTerm();
        $existSource = $this->termRepository->findOneBy([
            'name' => $name,
            'slug' => $slug,
        ]);
        if ($existSource) {
            $existTaxonomy = $this->repository->findOneBy([
                'taxonomy' => $taxonomy->getTaxonomy(),
                'term'     => $existSource,
            ]);
            if ($existTaxonomy && $term == null) {
                return $this->json(['message' => '已存在相同的类目',], Response::HTTP_NOT_ACCEPTABLE);
            }
        }
        $queryBuilder = $this->termRepository->createQueryBuilder('t')
            ->where('t.slug = :slug')
            ->setParameter('slug', $slug);
        if ($term) {
            $queryBuilder->andWhere('t.id != :id')
                ->setParameter('id', $term->getId());
        }
        $existSlug = $queryBuilder->getQuery()->setMaxResults(1)->getOneOrNullResult();
        $suffix = 2;
        $slugSuffix = null;
        while ($existSlug != null) {
            $slugSuffix = $slug . '-' . $suffix;
            $existSlug = $this->termRepository->findOneBy(['slug' => $slugSuffix]);
            $suffix++;
        }
        if ($slugSuffix) {
            $slug = $slugSuffix;
        }
        if ($term == null) {
            $term = new Term();
            $term->setTermGroup(0);
        }
        $term->setName($name)->setSlug($slug);
        try {
            $taxonomy->setTerm($term);
            $this->metas($form->get('metas')->getNormData(), $taxonomy);
            $this->repository->add($taxonomy);
        } catch (Exception $exception) {
            return $this->json([
                'message' => $exception->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        $eventDispatcher = $this->bridger->getDispatcher();
        $taxonomyEvent = new TaxonomyEvent($taxonomy);
        $taxonomyEvent->setRequest($request);
        $eventDispatcher->dispatch($taxonomyEvent, OctopusEvent::TAXONOMY_SAVE_AFTER);
        return $this->json(
            array_merge($taxonomy->jsonSerialize(), $taxonomy->getTerm()->jsonSerialize())
        );
    }

    /**
     * @param TermMeta[] $normData
     * @param TermTaxonomy $entity
     * @return void
     */
    private function metas(array $normData, TermTaxonomy $entity): void
    {
        /**
         * @var $normData
         */
        if (empty($normData)) {
            return ;
        }
        $keys = array_map(function (TermMeta $meta) {
            return $meta->getMetaKey();
        }, $normData);
        $registeredMeta = $this->bridger->getMeta()->getTermTaxonomy($entity->getTaxonomy());
        if (empty($registeredMeta)) {
            return ;
        }
        $keyRegisteredMetaMap = array_column($registeredMeta, null, 'key');
        foreach ($entity->getTerm()->getMetas() as $metaEntity) {
            if (($index = array_search($metaEntity->getMetaKey(), $keys)) !== false) {
                $metaSetting = $keyRegisteredMetaMap[$metaEntity->getMetaKey()] ?? null;
                if (!is_array($metaSetting) || !$metaSetting['showUi'] || !$metaSetting['isUpdated']) {
                    continue;
                }
                $metaEntity->setMetaValue($normData[$index]->getMetaValue());
            } else {
                $metaSetting = $keyRegisteredMetaMap[$normData[$index]->getMetaKey()] ?? null;
                if (!is_array($metaSetting) || $metaSetting['showUi'] || !$metaSetting['isCreated']) {
                    continue;
                }
                $entity->getTerm()->addMeta($normData[$index]);
            }
        }
    }
}
