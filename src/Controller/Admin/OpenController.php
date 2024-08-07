<?php
declare(strict_types=1);


namespace OctopusPress\Bundle\Controller\Admin;

use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Form\Type\UploadType;
use OctopusPress\Bundle\Model\MenuManager;
use OctopusPress\Bundle\Repository\OptionRepository;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

/**
 * Class OpenController
 * @package App\Controller\Admin
 */
#[Route('/open', name: 'open_')]
class OpenController extends AdminController
{
    private MenuManager $menuManager;
    private OptionRepository $optionRepository;
    private string $tempDir;
    private SiteController $siteController;

    public function __construct(Bridger $bridger, MenuManager $menuManager, SiteController $siteController)
    {
        parent::__construct($bridger);
        $this->menuManager = $menuManager;
        $this->optionRepository = $this->bridger->getOptionRepository();
        $this->tempDir = $this->bridger->getTempDir();
        $this->siteController = $siteController;
    }


    #[Route('/configuration', name: 'configuration')]
    public function configuration(): JsonResponse
    {

        $roleOptions = $this->optionRepository->roles();
        $roles = [];
        foreach ($roleOptions as $index => $role) {
            $roles[] = ['label' => $role['name'], 'value' => $index + 1];
        }
        $taxonomies = [];
        foreach ($this->bridger->getTaxonomy()->getTaxonomies() as $slug => $taxonomy) {
            $taxonomies[$slug] = $taxonomy->jsonSerialize();
        }
        $postTypes = [];
        foreach ($this->bridger->getPost()->getTypes() as $type => $postType) {
            $postTypes[$type] = $postType->jsonSerialize();
        }
        $editor = $this->siteController->getEditorQuery();
        return $this->json([
            'name' => $this->optionRepository->title(),
            'siteUrl' => $this->optionRepository->siteUrl(),
            'markdown' => $this->optionRepository->markdown(),
            'assetsUrl' => $this->bridger->getAssetsUrl(),
            'timestamp' => time(),
            'roles' => $roles,
            'taxonomies' => $taxonomies,
            'postTypes' => $postTypes,
            'userMeta'  => $this->bridger->getMeta()->getUser(),
            'commentMeta'  => $this->bridger->getMeta()->getComment(),
            'postMeta'  => $this->bridger->getMeta()->getPost(),
            'termMeta'  => $this->bridger->getMeta()->getTaxonomy(),
            'settingPages' => $this->bridger->getPlugin()->getSettingPages(),
            'editorFeatures' => [
                'isMarkdownSupport' => $editor['editor_markdown_support'],
                'isHtmlSupport' => $editor['editor_html_support'],
                'isHtmlEmbedSupport' => $editor['editor_html_embed_support'],
                'htmlRules' => $editor['editor_html_rules'],
                'styleRules' => $editor['editor_style_rules'],
            ],
        ]);
    }

    #[Route('/user', name: 'user')]
    public function user(#[CurrentUser] User $user): JsonResponse
    {
        $meta = $user->getMeta('roles');
        if (empty($meta) || empty($roles = $meta->getMetaValue())) {
            return $this->json([
                'message' => 'Not permission',
            ], Response::HTTP_FORBIDDEN);
        }
        $roleCapabilities = $this->optionRepository->value('roles');
        $capabilities = [];
        foreach ($roles as $roleIndex) {
            if (!isset($roleCapabilities[$roleIndex - 1])) {
                continue;
            }
            $capabilities = array_merge($capabilities, $roleCapabilities[$roleIndex - 1]['capabilities'] ?? []);
        }
        $menus = $this->menuManager->registeredRoutes();
        $customRoutes = $this->bridger->getPlugin()->getCustomMenus();
        $menus = array_merge($menus, $customRoutes);
        $collection = [];
        foreach ($capabilities as $p => $v) {
            if (!isset($menus[$p])) {
                continue;
            }
            $collection[] = $menus[$p];
        }
        $meta = $user->getMeta('rich_editing');
        $isRichEditor = true;
        if ($meta) {
            $isRichEditor = !($value = $meta->getMetaValue()) || !($value === true);
        }
        return $this->json([
            'isRichEditor' => $isRichEditor,
            'capabilities' => $this->menuManager->tree($collection),
        ]);
    }

    #[Route('/upload', name: 'upload', methods: Request::METHOD_POST)]
    public function upload(Request $request): JsonResponse
    {
        $form = $this->createForm(UploadType::class);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            /**
             * @var $file UploadedFile
             */
            $file = $form->get('file')->getData();
            try {
                $file->move($this->tempDir, $file->getClientOriginalName());
            } catch (\Exception $exception) {
                return $this->json([
                    'message' => $exception->getMessage(),
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
            return $this->json([
                'filename' => $file->getClientOriginalName(),
            ]);
        }
        $message = [];
        foreach ($form->getErrors(true) as $error) {
            $message[] = $error->getMessage();
        }
        return $this->json([
            'message' => implode(';', $message),
        ], Response::HTTP_NOT_ACCEPTABLE);
    }


    #[Route('/menu', name: 'menu')]
    public function menu(): JsonResponse
    {
        $routes = $this->menuManager->registeredRoutes();
        $customRoutes = $this->bridger->getPlugin()->getCustomMenus();
        return $this->json(['menus' => $this->menuManager->tree(array_merge($routes, $customRoutes)),]);
    }
}
