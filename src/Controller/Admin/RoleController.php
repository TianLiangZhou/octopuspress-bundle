<?php
declare(strict_types=1);


namespace OctopusPress\Bundle\Controller\Admin;

use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Repository\OptionRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Class RoleController
 * @package App\Controller\Backend
 */
#[Route('/role', name: 'setting_')]
class RoleController extends AdminController
{
    private OptionRepository $optionRepository;

    public function __construct(Bridger $bridger)
    {
        parent::__construct($bridger);
        $this->optionRepository = $bridger->getOptionRepository();
    }

    #[Route('')]
    public function roles(Request $request): JsonResponse
    {
        $roles = $this->optionRepository->value('roles');
        foreach ($roles as $key => &$role) {
            $role['id'] = $key + 1;
            $role['capabilities'] = array_keys($role['capabilities'] ?? []);
        }
        return $this->json([
            'records' => $roles,
            'total'   => count($roles),
        ]);
    }

    #[Route('/store', name: 'role_store', options: ['name' => '创建角色', 'parent' => 'setting_role',  'sort' => 2], methods: Request::METHOD_POST)]
    public function store(Request $request): JsonResponse
    {
        $body = $request->toArray();
        if (empty($body['name']) || !is_array($body['capabilities'])) {
            return $this->json(['message' => 'invalid parameter'], Response::HTTP_NOT_ACCEPTABLE);
        }
        $option = $this->optionRepository->findOneByName('roles');
        if ($option == null) {
            return $this->json(['message' => 'error'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        $roles = $this->optionRepository->value('roles');
        $capabilities = [];
        foreach ($body['capabilities'] as $capability) {
            $capabilities[(string) $capability] = 1;
        }
        $roles[] = [
            'name' => (string) $body['name'],
            'capabilities' => $capabilities,
        ];
        $option->setValue($roles);
        $this->optionRepository->add($option);
        $this->bridger->getCache()->delete(OptionRepository::DEFAULT_CACHE_KEY);
        return $this->json([
            'id' => count($roles),
        ]);
    }

    /**
     * @throws \Doctrine\ORM\OptimisticLockException
     * @throws \Doctrine\ORM\ORMException
     */
    #[Route('/{id}/update', name: 'role_update', options: ['name' => '更新角色', 'parent' => 'setting_role',  'sort' => 3], methods: Request::METHOD_POST)]
    public function update(Request $request): JsonResponse
    {
        $body = $request->toArray();
        if (empty($body['name']) || !is_array($body['capabilities']) || empty($body['id'])) {
            return $this->json(['message' => 'invalid parameter'], Response::HTTP_NOT_ACCEPTABLE);
        }
        $option = $this->optionRepository->findOneByName('roles');
        $roles = $this->optionRepository->value('roles');
        $capabilities = [];
        foreach ($body['capabilities'] as $capability) {
            $capabilities[(string) $capability] = 1;
        }
        $index = (int) $body['id'];
        if (!isset($roles[$index - 1])) {
            return $this->json(['message' => 'invalid parameter'], Response::HTTP_NOT_ACCEPTABLE);
        }
        $roles[$index - 1] = [
            'name' => (string) $body['name'],
            'capabilities' => $capabilities,
        ];
        $option->setValue($roles);
        $this->optionRepository->add($option);
        $this->bridger->getCache()->delete(OptionRepository::DEFAULT_CACHE_KEY);
        return $this->json('');
    }

    #[Route('/{id}/delete', name: 'role_delete', requirements: ['id' => '\d+'], options: ['name' => '删除角色', 'parent' => 'setting_role',  'sort' => 4], methods: Request::METHOD_DELETE)]
    public function delete(int $id): JsonResponse
    {
        if ($id == 1) {
            return $this->json(['message' => 'cannot be deleted'], Response::HTTP_NOT_ACCEPTABLE);
        }
        $option = $this->optionRepository->findOneByName('roles');
        $roles = $this->optionRepository->value('roles');
        if (!isset($roles[$id - 1])) {
            return $this->json(['message' => 'invalid parameter'], Response::HTTP_NOT_ACCEPTABLE);
        }
        unset($roles[$id - 1]);
        $option->setValue($roles);
        $this->optionRepository->add($option);
        $this->bridger->getCache()->delete(OptionRepository::DEFAULT_CACHE_KEY);
        return $this->json('');
    }
}
