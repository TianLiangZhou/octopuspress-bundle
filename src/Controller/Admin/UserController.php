<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Controller\Admin;

use Doctrine\ORM\AbstractQuery;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Form\Type\UserType;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

/**
 * Class UserController
 * @package App\Controller\Backend
 */
#[Route('/user', name: 'user_')]
class UserController extends AdminController
{
    private UserRepository $userRepository;

    private OptionRepository $optionRepository;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(Bridger $bridger, UserPasswordHasherInterface $passwordHasher)
    {
        parent::__construct($bridger);
        $this->userRepository = $bridger->getUserRepository();
        $this->optionRepository = $bridger->getOptionRepository();
        $this->passwordHasher = $passwordHasher;
    }


    #[Route('/menu1', name: 'menu1', options: ['name' => '所有用户', 'parent' => 'user', 'sort' => 0, 'link' => '/app/user'])]
    #[Route('/menu2', name: 'menu2', options: ['name' => '添加用户', 'parent' => 'user', 'sort' => 1, 'link' => '/app/user/new'])]
    #[Route('/menu3', name: 'menu3', options: ['name' => '个人资料', 'parent' => 'user', 'sort' => 2, 'link' => '/app/user/profile'])]
    public function menu(): Response
    {
        return new Response();
    }

    #[Route('', name: 'sets', options: ['name' => '用户列表', 'parent' => 'user_menu1'])]
    public function members(Request $request): JsonResponse
    {
        $pagination = $this->userRepository->pagination($request, AbstractQuery::HYDRATE_OBJECT);
        return $this->json($pagination);
    }

    #[Route('/{id}', name: 'profile', requirements: ['id' => '\d+'])]
    public function profile(User $user): JsonResponse
    {
        $jsonSerialize = $user->jsonSerialize();
        $metaStdclass = [];
        foreach ($user->getMetas() as $meta) {
            $metaStdclass[$meta->getMetaKey()] = $meta->getMetaValue();
        }
        $jsonSerialize['meta'] = (object) $metaStdclass;
        return $this->json($jsonSerialize);
    }

    /**
     * @param User $user
     * @return JsonResponse
     */
    #[Route('/profile', name: 'self_profile')]
    public function current(#[CurrentUser] User $user): JsonResponse
    {
        return $this->profile($user);
    }

    #[Route('/store', name: 'store', options: ['name' => '创建用户', 'parent' => 'user_menu1'], methods: Request::METHOD_POST)]
    public function store(Request $request): JsonResponse
    {
        return $this->save(new User(), $request);
    }

    #[Route('/{id}/update', name: 'update',requirements: ['id' => '\d+'], options: ['name' => '更新用户', 'parent' => 'user_menu1'], methods: Request::METHOD_POST)]
    public function update(User $user, Request $request): JsonResponse
    {
        return $this->save($user, $request);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    #[Route('/delete', name: 'delete', options: ['name' => '删除用户', 'parent' => 'user_menu1'], methods: [Request::METHOD_POST, Request::METHOD_DELETE])]
    public function delete(Request $request): JsonResponse
    {
        $idSets = $request->toArray()['id'] ?? [];
        $idSets = array_filter($idSets, function ($id) {return is_numeric($id) && $id > 0;});
        if (empty($idSets)) {
            return $this->json(['message' => '无效的参数'], Response::HTTP_NOT_ACCEPTABLE);
        }
        $queryBuilder = $this->userRepository->createQueryBuilder('c');
        $queryBuilder->andWhere('c.id IN (:idSets)')
            ->setParameter('idSets', $idSets);
        $queryBuilder->delete()->getQuery()->execute();
        return $this->json([
        ]);
    }

    #[Route('/reset/email', name: 'reset_email', options: ['name' => '重置密码邮件', 'parent' => 'user_menu1'], methods: Request::METHOD_POST)]
    public function resetEmail(): JsonResponse
    {
        return $this->json([]);
    }

    /**
     * @param User $user
     * @param Request $request
     * @return JsonResponse
     * @throws \Doctrine\ORM\Exception\ORMException
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    private function save(User $user, Request $request): JsonResponse
    {
        $user->setPasswordHasher($this->passwordHasher);
        $user->setUserRepository($this->userRepository);
        $roleMeta = $user->getMeta('roles');
        if ($response = $this->validResponse(UserType::class, $user, $request->toArray(), [
            'validation_groups' => ['Default', $user->getId() ? 'Update' : 'Create'],
            'is_update' => $user->getId() !== null,
        ])) {
            return $response;
        }
        if (empty($user->getNickname())) {
            $user->setNickname($user->getAccount());
        }
        if ($roleMeta != null && !$user->getMetas()->contains($roleMeta)) {
            $this->getEM()->remove($roleMeta);
        }
        $this->userRepository->add($user);
        return $this->json($user);
    }
}
