<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Controller\Admin;

use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\Option;
use OctopusPress\Bundle\Repository\OptionRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

#[Route('/widget', name: 'widget_')]
class WidgetController extends AdminController
{
    private OptionRepository $option;

    public function __construct(Bridger $bridger)
    {
        parent::__construct($bridger);
        $this->option = $this->bridger->getOptionRepository();
    }

    #[Route('/menu1', name: 'menu1', options: ['name' => '挂件', 'parent' => 'appearance', 'sort' => 3, 'link' => '/app/decoration/widget'])]
    public function menu(): Response
    {
        return new Response();
    }


    /**
     * @param Request $request
     * @return JsonResponse
     * @throws ORMException
     * @throws OptimisticLockException
     */
    #[Route('/saved', name: 'saved', options: ['name' => '保存区块挂件', 'parent' => 'widget_menu1'], methods: ['POST'])]
    public function update(Request $request): JsonResponse
    {
        $body = $request->toArray();
        $optionBlocks = $this->option->findOneBy(['name' => 'blocks']);
        if ($optionBlocks == null) {
            $optionBlocks = new Option();
            $optionBlocks->setName('blocks');
        }
        $blocks = [];
        foreach (($body['blocks'] ?? []) as $name => $widgets) {
            if (!is_string($name) || !is_array($widgets)) {
                continue;
            }
            $blocks[$name] = array_filter($widgets, function ($item) {return is_string($item);});
        }
        $optionBlocks->setValue($blocks);
        $this->option->add($optionBlocks, false);
        $optionBlockWidgets = $this->option->findOneBy(['name' => 'block_widgets']);
        if ($optionBlockWidgets == null) {
            $optionBlockWidgets = new Option();
            $optionBlockWidgets->setName('block_widgets');
        }
        $widgets = [];
        foreach (($body['widgets'] ?? []) as $name => $data) {
            if (!is_string($name) || !is_array($data)) {
                continue;
            }
            if (!isset($data['id']) || !is_string($data['id']) ||
                !isset($data['name']) || !is_string($data['name']) ||
                !isset($data['attributes']) || !is_array($data['attributes'])
            ) {
                continue;
            }
            $widgets[$name] = $data;
        }
        $optionBlockWidgets->setValue($widgets);
        $this->option->add($optionBlockWidgets);
        return $this->json([]);
    }

    #[Route('/blocks', name: 'blocks', methods: ['GET'])]
    public function blocks(): JsonResponse
    {
        $this->bridger->getWidget()->registerBlock([
            'label' => 'footer',
        ])->registerBlock([
            'label' => 'header',
        ]);
        $registeredBlocks = $this->bridger->getWidget()->getRegisteredBlocks();
        $activatedBlocks = $this->option->blocks();
        $blockWidgets    = $this->option->blockWidgets();
        $blocks = [];
        foreach ($registeredBlocks as $index => $block) {
            $name = $block->getName();
            $blockArray = $block->jsonSerialize();
            $blockArray['widgets'] = [];
            $blocks[$index] = $blockArray;
            if (!isset($activatedBlocks[$name]) || count($activatedBlocks[$name]) < 1) {
                continue;
            }
            foreach ($activatedBlocks[$name] as $blockId) {
                if (!isset($blockWidgets[$blockId])) {
                    continue;
                }
                $blocks[$index]['widgets'][] = $blockWidgets[$blockId];
            }
        }
        return $this->json($blocks);
    }



    #[Route('/registered', name: 'registered', methods: ['GET'])]
    public function registered(): JsonResponse
    {
        $categories = $this->bridger->getWidget()->getCategories();
        $registeredWidgets = $this->bridger->getWidget()->getRegistered();
        foreach ($registeredWidgets as $widget) {
            $widget->delayRegister();
        }
        return $this->json([
            'categories' => $categories,
            'widgets' => $registeredWidgets,
        ]);
    }

    /**
     * @throws SyntaxError
     * @throws LoaderError
     * @throws RuntimeError
     */
    #[Route('/{name}/rendered', name: 'rendered', methods: ['POST'])]
    public function rendered(string $name, Request $request): JsonResponse
    {
        $widgetHelper = $this->bridger->getWidget();
        if (!$widgetHelper->exists($name)) {
            return $this->json([
                'message' => 'The a widget not found'
            ], Response::HTTP_NOT_FOUND);
        }
        $widget = $widgetHelper->get($name);
        $widget->delayRegister();
        $attributes = $request->toArray();
        unset($attributes['name']);
        $widget->put($attributes);
        return $this->json([
            'output' => $widget->render(),
        ]);
    }
}
