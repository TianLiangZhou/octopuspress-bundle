<?php
declare(strict_types=1);


namespace OctopusPress\Bundle\Controller\Admin;

use OctopusPress\Bundle\Entity\Option;
use OctopusPress\Bundle\Form\Type\OptionType;
use OctopusPress\Bundle\Repository\OptionRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Class OptionController
 * @package App\Controller\Admin
 */
#[Route('/option', name: 'setting_')]
class OptionController extends AdminController
{
    /**
     * @var OptionRepository
     */
    protected OptionRepository $optionRepository;

    /**
     * @param OptionRepository $optionRepository
     */
    public function __construct(OptionRepository $optionRepository)
    {
        $this->optionRepository = $optionRepository;
    }


    #[Route('')]
    public function options(Request $request): JsonResponse
    {
        return $this->json(
            $this->optionRepository->pagination($request)
        );
    }

    #[Route('/store', name: 'option_store', options: ['name' => '添加配置',  'parent' => 'setting_global'])]
    public function store(Request $request): JsonResponse
    {
        $option = new Option();
        if ($response = $this->validResponse(OptionType::class, $option, $request->toArray())) {
            return $response;
        }
        $this->optionRepository->add($option);
        return $this->json([
            'id' => $option->getId(),
        ]);
    }

    #[Route('/{id}/update', name: 'option_update', options: ['name' => '更新配置',  'parent' => 'setting_global'])]
    public function update(Option $option, Request $request): JsonResponse
    {
        if ($response = $this->validResponse(OptionType::class, $option, $request->toArray())) {
            return $response;
        }
        $this->optionRepository->add($option);
        return $this->json([
        ]);
    }
}
