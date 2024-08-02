<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Controller\Admin;

use Doctrine\ORM\AbstractQuery;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\OptimisticLockException;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\Comment;
use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Form\Type\CommentType;
use OctopusPress\Bundle\Repository\CommentRepository;
use OctopusPress\Bundle\Repository\OptionRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

/**
 *
 */
#[Route('/comment', name: 'comment_')]
class CommentController extends AdminController
{
    private CommentRepository $repository;
    private OptionRepository $optionRepository;

    public function __construct(Bridger $bridger)
    {
        parent::__construct($bridger);
        $this->repository = $bridger->getCommentRepository();
        $this->optionRepository = $bridger->getOptionRepository();
    }

    /**
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     */
    #[Route('', name: 'sets')]
    public function comments(Request $request, #[CurrentUser] User $user): JsonResponse
    {
        $statusFilter = $request->get('status');
        $statusValue = match ($statusFilter) {
            'approved', 'unapproved', 'spam', 'trash' => $statusFilter,
            default => ['approved', 'unapproved'],
        };
        if ($statusFilter == 'my') {
            $request->query->set('user', $user->getId());
        }
        $request->query->set('approved', $statusValue);
        $pagination = $this->repository->pagination($request, AbstractQuery::HYDRATE_OBJECT);
        /**
         * @var $records Comment[]
         */
        $records = $pagination['records'];

        $comments = [];
        foreach ($records as $record) {
            $comments[] = [
                'id' => $record->getId(),
                'content' => $record->getContent(),
                'author'  => ($author = $record->getUser()) ? $author->getNickname() : $record->getAuthor(),
                'post'    => $record->getPost(),
                'approved' => $record->getApproved(),
                'createdAt' => $record->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }
        $pagination['records'] = $comments;
        return $this->json($pagination);
    }

    /**
     * @param User $user
     * @return JsonResponse
     * @throws NonUniqueResultException
     */
    #[Route('/statistics', name: 'statistics')]
    public function statistics(#[CurrentUser] User $user): JsonResponse
    {
        $queryBuilder = $this->repository->createQueryBuilder('c');
        $queryBuilder->select('COUNT(c.approved) as cnt, c.approved');
        $result = $queryBuilder->addGroupBy('c.approved')
            ->getQuery()->getArrayResult();
        $data = [
            'all' => 0,
            'my'  => 0,
            'approved' => 0,
            'unapproved' => 0,
            'spam' => 0,
            'trash'=> 0,
        ];
        foreach ($result as $item) {
            $data[$item['approved']] = $item['cnt'];
        }
        $data['all'] = $data['approved'] + $data['unapproved'];
        $result = $this->repository->createQueryBuilder('c')
            ->select('COUNT(c.id) as cnt')
            ->andWhere('c.user = :user')
            ->setParameter('user', $user->getId())
            ->getQuery()->getOneOrNullResult();
        $data['my'] = $result->cnt ?? 0;
        return $this->json($data);
    }

    #[Route('/{id}', name: 'show', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $comment = $this->repository->find($id);
        if ($comment == null) {
            return $this->json(['message' => ''], Response::HTTP_NOT_FOUND);
        }
        return $this->json([
            'id' => $comment->getId(),
            'author'  => $comment->getAuthor(),
            'email'   => $comment->getAuthorEmail(),
            'url'   => $comment->getAuthorUrl(),
            'content' => $comment->getContent(),
            'post'    => $comment->getPost(),
            'approved'=> $comment->getApproved(),
            'createdAt' => $comment->getCreatedAt()->format('Y-m-d H:i:s'),
        ]);
    }

    /**
     * @param Comment $comment
     * @param Request $request
     * @return JsonResponse
     */
    #[Route('/{id}/update', name: 'update', options: ['name' => '更新评论', 'parent' => 'comment'], methods: ['POST'])]
    public function update(Comment $comment, Request $request): JsonResponse
    {
        $json = $this->validResponse(CommentType::class, $comment, $request->toArray());
        if ($json != null) {
            return $json;
        }
        $this->repository->add($comment);
        return $this->json(new \stdClass());
    }

    #[Route('/{id}/reply', name: 'reply', options: ['name' => '回复评论', 'parent' => 'comment'], methods: ['POST'])]
    public function reply(): JsonResponse
    {

    }

    #[Route('/unapproved', name: 'unapproved', options: ['name' => '驳回评论', 'parent' => 'comment'], methods: ['POST'])]
    public function unapproved(Request $request): JsonResponse
    {
        return $this->changeStatus($request, 'unapproved');
    }

    #[Route('/approved', name: 'approved', options: ['name' => '批准评论', 'parent' => 'comment'], methods: ['POST'])]
    public function approve(Request $request): JsonResponse
    {
        return $this->changeStatus($request, 'approved');
    }

    #[Route('/trash', name: 'trash', options: ['name' => '移至回收站', 'parent' => 'comment'], methods: ['POST'])]
    public function trash(Request $request): JsonResponse
    {
        return $this->changeStatus($request, 'trash');
    }

    #[Route('/spam', name: 'spam', options: ['name' => '标记为垃圾', 'parent' => 'comment'], methods: ['POST'])]
    public function spam(Request $request): JsonResponse
    {
        return $this->changeStatus($request, 'spam');
    }

    #[Route('/delete', name: 'delete', options: ['name' => '永久删除', 'parent' => 'comment'], methods: ['POST'])]
    public function delete(Request $request): JsonResponse
    {
        return $this->changeStatus($request, 'delete');
    }

    /**
     * @param Request $request
     * @param string $statusValue
     * @return JsonResponse
     */
    private function changeStatus(Request $request, string $statusValue): JsonResponse
    {
        $idSets = $request->toArray()['id'] ?? [];
        $idSets = array_filter($idSets, function ($id) {return is_numeric($id) && $id > 0;});
        if (empty($idSets)) {
            return $this->json(['message' => '无效的参数'], Response::HTTP_NOT_ACCEPTABLE);
        }
        $queryBuilder = $this->repository->createQueryBuilder('c');
        $queryBuilder->andWhere('c.id IN (:idSets)')
            ->setParameter('idSets', $idSets);
        if ($statusValue === 'delete') {
            $queryBuilder->delete();
        } elseif (in_array($statusValue, Comment::STATUS)) {
            $queryBuilder
                ->set('c.approved', ':value')
                ->setParameter('value', $statusValue)
                ->update();
        }
        $queryBuilder->getQuery()->execute();
        return $this->json(new \stdClass());
    }
}
