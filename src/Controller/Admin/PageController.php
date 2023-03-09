<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Controller\Admin;

use Doctrine\ORM\AbstractQuery;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\User;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

/**
 * Class PageController
 * @package App\Controller\Backend
 */
#[Route('/page', name: 'page_')]
class PageController extends PostController
{
    #[Route('/menu1', name: 'all', options: ['name' => '所有页面', 'parent' => 'page', 'sort' => 1, 'link' => '/app/content/page'])]
    #[Route('/menu2', name: 'new', options: ['name'=> '新建页面', 'parent' => 'page', 'sort'=> 2, 'link' => '/app/content/post-new/page'])]
    public function menu(): Response
    {
        return new Response();
    }

    #[Route(name:'sets', options: ['name' => '页面列表', 'parent' => 'page_all', 'sort' => 1])]
    public function main(Request $request): JsonResponse
    {
        $request->query->set('type', 'page');
        return $this->json(
            $this->repository->pagination($request, AbstractQuery::HYDRATE_OBJECT)
        );
    }

    #[Route('/{id}', name: 'show', requirements: ['id' => '\d+'])]
    public function show(int $id): JsonResponse
    {
        return parent::show($id);
    }

    #[Route('/store', name: 'store', options: ['name'=> '创建页面', 'parent' => 'page_all'])]
    public function store(Request $request, #[CurrentUser] User $user): JsonResponse
    {
        return  parent::store($request, $user);
    }


    #[Route('/{id}/update', name: 'update', options: ['name'=> '更新页面', 'parent' => 'page_all'])]
    public function update(Post $post, Request $request, #[CurrentUser] User $user): JsonResponse
    {
        return parent::update($post, $request, $user);
    }

    #[Route('/delete', name: 'delete', options: ['name'=> '删除页面', 'parent' => 'page_all'], methods: [Request::METHOD_POST, Request::METHOD_DELETE])]
    public function delete(Request $request): JsonResponse
    {
        return parent::delete($request);
    }


    /**
     * @throws OptimisticLockException
     * @throws ORMException
     */
    #[Route('/trash', name: 'trash', options: ['name' => '移至回收站', 'parent' => 'page_all'], methods: [Request::METHOD_POST])]
    public function trash(Request $request): JsonResponse
    {
        $toArray = $request->toArray();
        return $this->json($toArray);
    }


    /**
     * @throws OptimisticLockException
     * @throws ORMException
     */
    #[Route('/undo', name: 'undo', options: ['name' => '移出回收站', 'parent' => 'page_all'], methods: [Request::METHOD_POST])]
    public function undo(Request $request): JsonResponse
    {
        return $this->json([
        ]);
    }
}
