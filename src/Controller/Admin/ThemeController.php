<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Controller\Admin;


use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Model\CustomizeManager;
use OctopusPress\Bundle\Model\ThemeManager;
use OctopusPress\Bundle\Service\ServiceCenter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

/**
 *
 */
#[Route('/theme', name: 'appearance_')]
class ThemeController extends AdminController
{
    private ThemeManager $themeManager;
    private string $tempDir;
    private CustomizeManager $customizeManager;
    private ServiceCenter $center;

    public function __construct(
        Bridger $bridger,
        ThemeManager     $themeManager,
        CustomizeManager $customizeManager,
        ServiceCenter $center,
    ) {
        parent::__construct($bridger);
        $this->themeManager = $themeManager;
        $this->customizeManager = $customizeManager;
        $this->tempDir = $bridger->getTempDir();
        $this->center = $center;
    }

    #[Route('/menu1', name: 'theme', options: ['name' => '主题', 'parent' => 'appearance', 'sort' => 3, 'link' => '/app/decoration/theme'])]
    #[Route('/menu2', name: 'custom', options: ['name' => '自定义', 'parent' => 'appearance', 'sort' => 3, 'link' => '/app/decoration/custom'])]
    public function menu(): Response
    {
        return new Response();
    }

    #[Route('/customize', name: 'customize', options: ['name' => '主题自定义', 'parent' => 'appearance_custom'])]
    public function custom(Request $request): JsonResponse
    {
        return $this->json($this->customizeManager->jsonSerialize());
    }

    #[Route('/customized', name: 'customize_save', options: ['name' => '保存自定义', 'parent' => 'appearance_custom'])]
    public function customized(Request $request): JsonResponse
    {
        $customizedData = $request->toArray();
        $this->customizeManager->save($customizedData);
        return $this->json([]);
    }

    /**
     * @return JsonResponse
     */
    #[Route(name:'theme_installed', options: ['name' => '主题列表', 'parent' => 'appearance_theme'])]
    public function themes(): JsonResponse
    {
        $themes = $this->themeManager->themes();
        return $this->json([
            'total' => count($themes),
            'records' => $themes,
        ]);
    }

    /**
     * @throws \Exception
     * @throws TransportExceptionInterface
     */
    #[Route('/upload', name:'theme_upload', options: ['name' => '上传主题', 'parent' => 'appearance_theme'], methods: Request::METHOD_POST)]
    public function upload(Request $request): JsonResponse
    {
        $jsonArray = $request->toArray();
        if (empty($jsonArray['uri'])) {
            return $this->json(['message' => 'Invalid params'], Response::HTTP_NOT_ACCEPTABLE);
        }
        $uri = $jsonArray['uri'];
        if (filter_var($uri, FILTER_VALIDATE_URL) === false) {
            $filepath = $this->tempDir . DIRECTORY_SEPARATOR . $uri;
        } else {
            $filepath = $this->center->downloadPackage($this->center->getGithubDownloadUrl($uri), [
                'timeout' => (int) ini_get('max_execution_time')
            ]);
        }
        if (!file_exists($filepath)) {
            return $this->json(['message' => 'File does not exist.',], Response::HTTP_NOT_ACCEPTABLE);
        }
        if (strtolower(pathinfo($filepath, PATHINFO_EXTENSION)) != 'zip') {
            unlink($filepath);
            return $this->json(['message' => 'File format is incorrect.',], Response::HTTP_NOT_ACCEPTABLE);
        }
        $this->themeManager->setup($filepath);
        return $this->json([
        ]);
    }


    /**
     * @param string $name
     * @return JsonResponse
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    #[Route('/{name}/activate', name: 'theme_activate', options: ['name' => '开启主题', 'parent' => 'appearance_theme', 'sort' => 0])]
    public function activate(string $name): JsonResponse
    {
        $this->themeManager->activate($name);
        return $this->json([]);
    }

    /**
     * @throws \Exception
     */
    #[Route('/{name}/setup', name:'theme_setup', options: ['name' => '安装主题', 'parent' => 'appearance_theme'])]
    public function setup(string $name): JsonResponse
    {
        $this->themeManager->setup($name);
        return $this->json([
        ]);
    }

    /**
     * @throws \Exception
     */
    #[Route('/{name}/upgrade', name:'theme_upgrade', options: ['name' => '更新主题', 'parent' => 'appearance_theme'])]
    public function upgrade(string $name)
    {
        $this->themeManager->setup($name);
        return $this->json([
        ]);
    }

}
