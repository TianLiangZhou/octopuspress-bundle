<?php
declare(strict_types=1);


namespace OctopusPress\Bundle\Controller\Admin;

use Doctrine\ORM\AbstractQuery;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\PostMeta;
use OctopusPress\Bundle\Entity\TermRelationship;
use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Form\Type\PostType;
use OctopusPress\Bundle\Model\PostManager;
use OctopusPress\Bundle\Repository\PostRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use OctopusPress\Bundle\Repository\RelationRepository;
use OctopusPress\Bundle\Repository\UserRepository;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

/**
 * Class PostsController
 * @package App\Controller\Backend
 */
#[Route('/post', name: 'post_',)]
class PostController extends AdminController
{
    protected PostRepository $repository;
    protected PostManager $postManager;
    protected RelationRepository $relationRepository;
    protected UserRepository $userRepository;

    public function __construct(Bridger $bridger, PostManager $postManager)
    {
        parent::__construct($bridger);
        $this->repository = $bridger->getPostRepository();
        $this->userRepository = $bridger->getUserRepository();
        $this->relationRepository = $bridger->getRelationRepository();
        $this->postManager = $postManager;
    }

    #[Route('/menu1', name: 'all', options: ['name' => '所有文章', 'parent' => 'post', 'sort' => 0, 'link' => '/app/content/post'])]
    #[Route('/menu2', name: 'new', options: ['name' => '写文章', 'parent' => 'post', 'sort' => 1, 'link' => '/app/content/post-new'])]
    public function menu(): Response
    {
        return new Response();
    }


    #[Route('', name: 'sets', options: ['name' => '文章列表', 'parent' => 'post_all'])]
    public function main(Request $request): JsonResponse
    {
        $this->filterRequest($request);
        return $this->json(
            $this->repository->pagination($request, AbstractQuery::HYDRATE_OBJECT)
        );
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    #[Route('/statistics', name: 'statistics')]
    public function statistics(Request $request): JsonResponse
    {
        $this->filterRequest($request);
        $all = $request->query->all();
        $queryBuilder = $this->repository->createQueryBuilder('a');
        $this->repository->addFilters($queryBuilder, $all);
        $ymResults = $queryBuilder->select('year(a.createdAt) as y, month(a.createdAt) as m')
                        ->addOrderBy('y', 'DESC')
                        ->addGroupBy('y')->addGroupBy('m')
            ->getQuery()
            ->getArrayResult();
        $yearMonths = $ymResults ? array_map(function ($item) {
            return ['label' => $item['y'] . '-' . $item['m'], 'value' => $item['y'] . '-' . $item['m']];
        }, $ymResults) : [];
        $data = [
            'all' => 0,
            'publish' => 0,
            'draft' => 0,
            'trash' => 0,
            'yearMonths' => $yearMonths,
        ];
        $qb = $this->repository->createQueryBuilder('a');
        $qb->select('COUNT(a.status) as cnt, a.status');
        unset($all['status']);
        $this->repository->addFilters($qb, $all);
        $results = $qb->addGroupBy('a.status')
            ->getQuery()->getArrayResult();
        $statusMap = array_column($results, 'cnt', 'status');
        $data['publish'] = ($statusMap['publish'] ?? 0) + ($statusMap['future'] ?? 0);
        $data['draft'] = ($statusMap['draft'] ?? 0);
        $data['trash'] = ($statusMap['trash'] ?? 0);
        $data['all'] = $data['publish'] + $data['draft'];
        return $this->json($data);
    }

    /**
     * @param Request $request
     * @return void
     */
    private function filterRequest(Request $request): void
    {
        if (!$request->query->has('type')) {
            $request->query->set('type', 'post');
        }
        $status = $request->query->get('status', '');
        switch ($status) {
            case Post::STATUS_PUBLISHED:
                $request->query->set('status', [
                    Post::STATUS_PUBLISHED,
                    Post::STATUS_FUTURE,
                    Post::STATUS_PRIVATE,
                ]);
                break;
            case Post::STATUS_DRAFT:
            case Post::STATUS_TRASH:
            case Post::STATUS_PRIVATE:
                break;
            default:
                $request->query->set('status', [
                    Post::STATUS_PUBLISHED,
                    Post::STATUS_DRAFT,
                    Post::STATUS_FUTURE,
                    Post::STATUS_PRIVATE,
                ]);
        }
        $taxonomyId = $request->query->getInt('taxonomy', 0);
        if ($taxonomyId > 0) {
            $relationResults = $this->relationRepository->getTaxonomyObjectQuery($taxonomyId)
                ->getResult();
            if ($relationResults) {
                $request->query->set('id', array_column($relationResults, 'object_id'));
            }
        }
    }


    #[Route('/{id}', name: 'show', requirements: ['id' => '\d+'])]
    public function show(int $id): JsonResponse
    {
        $post = $this->repository->find($id);
        if ($post == null) {
            return $this->json([], Response::HTTP_NOT_FOUND);
        }
        $registeredMeta = $this->bridger->getMeta()->getPostType($post->getType());
        $keyRegisteredMetaMap = $registeredMeta ? array_column($registeredMeta, null, 'key') : [];
        $metas = [];
        $thumbnailId = 0;
        foreach ($post->getMetas() as $meta) {
            if ($meta->getMetaKey() === '_thumbnail_id') {
                $thumbnailId = (int) $meta->getMetaValue();
                continue;
            }
            if (!isset($keyRegisteredMetaMap[$meta->getMetaKey()])) {
                continue;
            }
            $metaSetting = $keyRegisteredMetaMap[$meta->getMetaKey()];
            if (!$metaSetting['showUi']) {
                continue;
            }
            $metas[$meta->getMetaKey()] = $meta->getMetaValue();
        }
        $relationships = [];
        foreach ($post->getTermRelationships() as $relation) {
            $taxonomy = $relation->getTaxonomy();
            $relationships[] = array_merge($taxonomy->jsonSerialize(), $taxonomy->getTerm()->jsonSerialize());
        }
        $featuredImage = ['id' => null, 'url' => null];
        if ($thumbnailId > 0 && ($attachmentPost = $this->repository->find($thumbnailId))) {
            $featuredImage = $attachmentPost->getAttachment($this->bridger->getAssetsUrl());
        }
        return $this->json(
            array_merge(
                $post->jsonSerialize(),
                [
                    'content' => $post->getContent(),
                    'featuredImage' => $featuredImage,
                    'relationships' => $relationships,
                    'meta' => (object) $metas,
                ]
            ),
        );
    }

    /**
     * @param string $type
     * @return JsonResponse
     */
    #[Route('/type/{type}', name: 'type_setting', methods: Request::METHOD_GET)]
    public function setting(string $type): JsonResponse
    {
        $type = $type ?: 'post';
        $post = $this->bridger->getPost();
        if (!$post->typeExists($type)) {
            return $this->json(['message' => "'$type' is not registered"], Response::HTTP_NOT_FOUND);
        }
        return $this->json($post->getType($type)->jsonSerialize());
    }

    /**
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     */
    #[Route('/store', name: 'store', options: ['name' => '创建文章', 'parent' => 'post_all'], methods: Request::METHOD_POST)]
    public function store(Request $request, #[CurrentUser] User $user): JsonResponse
    {
        $post = new Post();
        return $this->update($post, $request, $user);
    }

    /**
     * @param Post $post
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     */
    #[Route('/{id}/update', name: 'update', options: ['name' => '更新文章', 'parent' => 'post_all'], methods: Request::METHOD_POST)]
    public function update(Post $post, Request $request, #[CurrentUser] User $user): JsonResponse
    {
        $data = $request->toArray();
        $postExtension = $this->bridger->getPost();
        $types = $postExtension->getNames();
        $postType = $postExtension->getType($data['type']);
        if ($postType == null || !$postType->isShowUi()) {
            return $this->json(null, Response::HTTP_NOT_ACCEPTABLE);
        }
        try {
            $form = $this->validation(PostType::class, $post, $data, [
                'types' => array_combine($types, $types)
            ]);
            $this->handle($form, $post);
            if ($post->getAuthor() == null) {
                $post->setAuthor($user);
            }
        } catch (\Throwable $exception) {
            return $this->json(['message' => $exception->getMessage()], Response::HTTP_NOT_ACCEPTABLE);
        }
        if (!$this->postManager->save($post)) {
            return $this->json(['message' => '保存内容发生错误，请查看日志文件修复!'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        return $this->json([
            'id' => $post->getId(),
        ]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    #[Route('/delete', name: 'delete', options: ['name' => '删除文章', 'parent' => 'post_all'], methods: [Request::METHOD_POST, Request::METHOD_DELETE])]
    public function delete(Request $request): JsonResponse
    {
        $sets = $request->toArray()['sets'] ?? [];
        $sets = array_map('intval', $sets);
        if (empty($sets)) {
            return $this->json(['message' => ''], Response::HTTP_NOT_ACCEPTABLE);
        }
        $this->postManager->delete($this->repository->findBy(['id' => $sets,]));
        return $this->json(null);
    }


    /**
     * @param Request $request
     * @return JsonResponse
     */
    #[Route('/trash', name: 'trash', options: ['name' => '移至回收站', 'parent' => 'post_all'], methods: [Request::METHOD_POST])]
    public function trash(Request $request): JsonResponse
    {
        return $this->updateStatus($request, Post::STATUS_TRASH);
    }


    /**
     * @param Request $request
     * @return JsonResponse
     */
    #[Route('/undo', name: 'undo', options: ['name' => '移出回收站', 'parent' => 'post_all'], methods: [Request::METHOD_POST])]
    public function undo(Request $request): JsonResponse
    {
        return $this->updateStatus($request, Post::STATUS_DRAFT);
    }

    /**
     * @param Request $request
     * @param string $status
     * @return JsonResponse
     */
    private function updateStatus(Request $request, string $status): JsonResponse
    {
        $sets = $request->toArray()['sets'] ?? [];
        $sets = array_map('intval', $sets);
        if (empty($sets)) {
            return $this->json(['message' => ''], Response::HTTP_NOT_ACCEPTABLE);
        }
        $this->repository->createQueryBuilder('a')
            ->set('a.status', ':status')
            ->andWhere('a.id IN (:sets)')
            ->setParameter('sets', $sets)
            ->setParameter('status', $status)
            ->update()
            ->getQuery()
            ->execute();
        return $this->json(null);
    }


    /**
     * @param FormInterface $form
     * @param Post $post
     * @return void
     * @throws \Doctrine\ORM\Exception\ORMException
     */
    private function handle(FormInterface $form, Post $post): void
    {
        $otherEntity = [
            'featuredImage' => $form->get('featuredImage')->getNormData(),
            'author'        => $form->get('author')->getNormData(),
            'parent'        => $form->get('parent')->getNormData(),
        ];
        $this->handleOtherEntity($post, $otherEntity);
        $this->handleMeta($post, $form->get('metas')->getNormData());
        $normData = $form->get('relationships')->getNormData();
        if (!is_array($normData)) {
            $normData = [];
        }
        $this->handleRelationship($post, $normData);
    }

    /**
     * @param Post $post
     * @param PostMeta[]|null $normData
     * @return void
     */
    private function handleMeta(Post $post, ?array $normData = []): void
    {
        if (empty($normData)) {
            return;
        }
        $keys = array_map(function (PostMeta $meta) {
            return $meta->getMetaKey();
        }, $normData);
        $registeredMeta = $this->bridger->getMeta()->getPostType($post->getType());
        if (empty($registeredMeta)) {
            return ;
        }
        $keyRegisteredMetaMap = array_column($registeredMeta, null, 'key');
        foreach ($post->getMetas() as $meta) {
            if (($index = array_search($meta->getMetaKey(), $keys)) !== false) {
                $metaSetting = $keyRegisteredMetaMap[$meta->getMetaKey()] ?? null;
                if (!is_array($metaSetting) || !$metaSetting['showUi'] || !$metaSetting['isUpdated']) {
                    continue;
                }
                $meta->setMetaValue($normData[$index]->getMetaValue());
            } else {
                $metaSetting = $keyRegisteredMetaMap[$normData[$index]->getMetaKey()] ?? null;
                if (!is_array($metaSetting) || !$metaSetting['showUi'] || !$metaSetting['isCreated']) {
                    continue;
                }
                $post->addMeta($normData[$index]);
            }
        }
    }

    /**
     * @param Post $post
     * @param TermRelationship[] $relationships
     * @return void
     * @throws \Doctrine\ORM\Exception\ORMException
     */
    private function handleRelationship(Post $post, array $relationships = []): void
    {
        $taxonomySetting = $this->bridger->getTaxonomy();
        $taxonomyRelationships = [];
        foreach ($relationships as $relationship) {
            if (($termTaxonomy = $relationship->getTaxonomy()) == null) {
                continue;
            }
            $taxonomy = $termTaxonomy->getTaxonomy();
            $setting = $taxonomySetting->getTaxonomy($taxonomy);
            if ($setting == null) {
                continue;
            }
            if (!in_array($post->getType(), $setting->getObjectType())) {
                continue;
            }
            $taxonomyRelationships[$termTaxonomy->getId()] = $relationship;
        }
        $taxonomies = $taxonomyRelationships ? array_keys($taxonomyRelationships) : [];
        foreach ($post->getTermRelationships() as $relationship) {
            $id = $relationship->getTaxonomy()->getId();
            if (!in_array($id, $taxonomies)) {
                $post->removeTermRelationship($relationship);
                $this->getEM()->remove($relationship);
            } else {
                unset($taxonomyRelationships[$id]);
            }
        }
        foreach ($taxonomyRelationships as $relationship) {
            if ($relationship->getTaxonomy() == null) {
                continue;
            }
            $post->addTermRelationship($relationship);
        }
    }

    /**
     * @param Post $post
     * @param array{featuredImage: number, author: number, parent:number} $otherEntityMap
     * @return void
     */
    private function handleOtherEntity(Post $post, array $otherEntityMap): void
    {
        if (!empty($otherEntityMap['featuredImage']) && is_numeric($otherEntityMap['featuredImage'])) {
            $changeFeaturedImage = $this->repository->findOneBy([
                'id' => (int) $otherEntityMap['featuredImage'],
                'type' => Post::TYPE_ATTACHMENT,
            ]);
            if ($changeFeaturedImage) {
                $featuredImage = $post->getMeta('_thumbnail_id');
                if ($featuredImage == null) {
                    $featuredImage = new PostMeta();
                    $featuredImage->setMetaKey('_thumbnail_id');
                }
                $featuredImage->setMetaValue($changeFeaturedImage->getId());
                $post->addMeta($featuredImage);
            }
        }
        if (!empty($otherEntityMap['parent']) && is_numeric($otherEntityMap['parent'])) {
            $parent = $this->repository->findOneBy([
                'id' => (int) $otherEntityMap['parent'],
                'type' => $post->getType(),
            ]);
            if ($parent) {
                $post->setParent($parent);
            }
        }
        if (!empty($otherEntityMap['author']) && is_numeric($otherEntityMap['author'])) {
            $author = $this->userRepository->find((int) $otherEntityMap['author']);
            if ($author) {
                $post->setAuthor($author);
            }
        }
    }
}
