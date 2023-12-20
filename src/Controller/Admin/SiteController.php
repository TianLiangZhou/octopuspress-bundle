<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Controller\Admin;

use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException as ORMExceptionAlias;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Customize\Draw;
use OctopusPress\Bundle\Customize\Layout\Form;
use OctopusPress\Bundle\Entity\Option;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Util\Formatter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class SiteController
 * @package App\Controller\Backend
 */
#[Route('/site', name: 'setting_')]
class SiteController extends AdminController
{
    private OptionRepository $repository;

    public function __construct(Bridger $bridger)
    {
        parent::__construct($bridger);
        $this->repository = $bridger->getOptionRepository();
    }

    /**
     * @return JsonResponse
     */
    #[Route('/basic', name: 'site_basic')]
    public function basic(): JsonResponse
    {
        $map = $this->query($this->repository::$defaultGeneralNames, [
            'timezone' => date_default_timezone_get(),
        ]);
        return $this->json([
            'timezone' => timezone_identifiers_list(),
            'option' => $map,
        ]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws ORMException
     * @throws OptimisticLockException
     */
    #[Route('/basic/save', name: 'site_basic_save', options: ['name' => '保存基础配置', 'parent' => 'setting_option'], methods: Request::METHOD_POST)]
    public function basicSave(Request $request): JsonResponse
    {
        return $this->save($request->toArray(), $this->repository::$defaultGeneralNames);
    }

    /**
     * @return JsonResponse
     */
    #[Route('/media', name: 'site_media')]
    public function media(): JsonResponse
    {
        return $this->json([
            'option' => $this->query($this->repository::$defaultMediaNames),
        ]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws ORMException
     * @throws OptimisticLockException
     */
    #[Route('/media/save', name: 'site_media_save', options: ['name' => '保存媒体配置', 'parent' => 'setting_option'], methods: Request::METHOD_POST)]
    public function mediaSave(Request $request): JsonResponse
    {
        return $this->save($request->toArray(), $this->repository::$defaultMediaNames);
    }

    /**
     * @return JsonResponse
     */
    #[Route('/editor', name: 'site_editor')]
    public function editor(): JsonResponse
    {
        return $this->json($this->getEditorQuery());
    }

    /**
     * @return array{editor_markdown_support:bool,editor_html_support:bool,editor_html_embed_support:bool,editor_html_rules:array,editor_style_rules:array}
     */
    public function getEditorQuery(): array
    {
        return $this->query(
            $this->repository::$defaultEditorNames,
            [
                'editor_markdown_support' => false,
                'editor_html_support' => false,
                'editor_html_embed_support' => false,
                'editor_html_rules' => [
                    'disallow' => [],
                    'allow' => [],
                    'allowEmpty' => [],
                ],
                'editor_style_rules' => [
                    'definitions' => [],
                ],
            ],
        );
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws ORMException
     * @throws OptimisticLockException
     */
    #[Route('/editor/save', name: 'site_editor_save', options: ['name' => '保存编辑器配置', 'parent' => 'setting_option'], methods: Request::METHOD_POST)]
    public function editorSave(Request $request): JsonResponse
    {
        return $this->save($request->toArray(), $this->repository::$defaultEditorNames);
    }

    /**
     * @return JsonResponse
     */
    #[Route('/content', name: 'content')]
    public function content(): JsonResponse
    {
        $query = $this->query($this->repository::$defaultContentNames, [
            'permalink_structure' => 'post_permalink_normal',
            'default_comment_status' => false,
            'comment_moderation' => false,
            'page_comments' => false,
            'static_mode'   => false,
        ]);
        return $this->json([
            'option' => $query,
        ]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws ORMException
     * @throws OptimisticLockException
     */
    #[Route('/content/save', name: 'content_save', options: ['name' => '保存站点内容配置', 'parent' => 'setting_option'], methods: Request::METHOD_POST)]
    public function contentSave(Request $request): JsonResponse
    {
        $names = $this->repository::$defaultContentNames;
        unset($names[0], $names[1]);
        return $this->save($request->toArray(), $names);
    }

    #[Route('/general/save', name: 'general_save', options: ['name' => '保存自定义配置', 'parent' => 'setting_option'], methods: Request::METHOD_POST)]
    public function general(Request $request): JsonResponse
    {
        $data = $request->toArray();
        $page = $request->query->get('page');
        if (empty($page)) {
            return $this->json([
                'message' => 'The page parameter is not specified',
            ], Response::HTTP_NOT_ACCEPTABLE);
        }
        $draw = $this->bridger->getHook()->filter('/backend' . $page, null);
        if (!$draw instanceof Draw) {
            return $this->json([
                'message' => 'Invalid page parameter',
            ], Response::HTTP_NOT_ACCEPTABLE);
        }
        $form = $draw->getLayout();
        if (!$form instanceof Form) {
            return $this->json([
                'message' => 'Invalid layout',
            ], Response::HTTP_NOT_ACCEPTABLE);
        }
        $theme = $this->repository->theme();
        $themeModObject = $this->repository->findOneByName('theme_mods_' . $theme);
        if ($themeModObject == null && $theme) {
            $themeModObject = new Option();
            $themeModObject->setName('theme_mods_' . $theme);
        }
        $controls = $form->getControls();
        $themeMod = [];
        if ($theme) {
            $themeMod = $this->repository->themeModules($theme);
        }
        $persists = [];
        $themeModChanged = false;
        $customControlStorages = [];
        foreach ($controls as  $control) {
            $id = $control->getId();
            if (!isset($data[$id])) {
                continue;
            }
            $value = $data[$id];
            if (!$control->validate($value)) {
                continue;
            }
            $value = $control->sanitize($value);
            switch ($control->getStorage()) {
                case 'option':
                    $option = $this->repository->findOneByName($id);
                    if ($option == null) {
                        $option = new Option();
                        $option->setName($id);
                    }
                    $option->setValue($value == null ? '' : $value);
                    $persists[] = $option;
                    break;
                case 'theme_mod':
                    $themeMod[$id] = $value;
                    $themeModChanged = true;
                    break;
                default:
                    $customControlStorages["customize_update_" . $id] = $value;
            }
        }
        if (!$themeModChanged && empty($persists) && empty($customControlStorages)) {
            return $this->json([]);
        }
        if ($themeModChanged && $themeModObject) {
            $themeModObject->setValue($themeMod);
            $persists[] = $themeModObject;
        }
        $objectManager = $this->doctrine->getManager();
        foreach ($persists as $persist) {
            $objectManager->persist($persist);
        }
        $hook = $this->bridger->getHook();
        foreach ($customControlStorages as $hookName => $value) {
            $hook->action($hookName, $value, $objectManager, $this);
        }
        $objectManager->flush();
        $this->bridger->getCache()->delete(OptionRepository::DEFAULT_CACHE_KEY);
        return $this->json('');
    }

    /**
     * @param array $names
     * @param array $values
     * @return array
     */
    private function query(array $names, array $values = []): array
    {
        $options = $this->repository->findBy(['name' => $names]);
        $map = $values;
        foreach ($options as $option) {
            $map[$option->getName()] = $option->getValue(false, $values[$option->getName()] ?? null);
        }
        return $map;
    }

    /**
     * @param array $options
     * @param array $names
     * @return JsonResponse
     * @throws ORMException
     * @throws OptimisticLockException
     */
    private function save(array $options, array $names): JsonResponse
    {
        $collection = $this->repository->findBy(['name' => $names]);
        $entityManager = $this->getEM();
        foreach ($names as $name) {
            $item = null;
            foreach ($collection as $option) {
                if ($option->getName() == $name) {
                    $item = $option;
                    break;
                }
            }
            if ($item == null) {
                $item = new Option();
                $item->setAutoload('yes');
            }
            $item->setName($name)->setValue($options[$name]);
            $entityManager->persist($item);
        }
        $this->getEM()->flush();
        $this->bridger->getCache()->delete(OptionRepository::DEFAULT_CACHE_KEY);
        return $this->json('');
    }
}
