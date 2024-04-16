<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Controller\Admin;


use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Model\CustomizeManager;
use OctopusPress\Bundle\Model\ThemeManager;
use OctopusPress\Bundle\Repository\OptionRepository;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
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

    public function __construct(
        Bridger $bridger,
        ThemeManager     $themeManager,
        CustomizeManager $customizeManager,
    ) {
        parent::__construct($bridger);
        $this->themeManager = $themeManager;
        $this->customizeManager = $customizeManager;
        $this->tempDir = $bridger->getTempDir();
    }

    #[Route('/customize')]
    public function custom(Request $request): JsonResponse
    {
        return $this->json($this->customizeManager->jsonSerialize());
    }

    #[Route('/customized', name: 'customize_save', options: ['name' => '保存自定义', 'parent' => 'appearance_customize'])]
    public function customized(Request $request): JsonResponse
    {
        $customizedData = $request->toArray();
        $this->customizeManager->save($customizedData);
        $this->bridger->getCache()->delete(OptionRepository::DEFAULT_CACHE_KEY);
        return $this->json('');
    }

    /**
     * 已安装的主题列表
     *
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    #[Route('/installed')]
    public function themes(): JsonResponse
    {
        $themes = $this->themeManager->themes();
        return $this->json([
            'total' => count($themes),
            'records' => $themes,
        ]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws TransportExceptionInterface
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     */
    #[Route('/market')]
    public function market(Request $request): JsonResponse
    {
        [$total, $packages] = $this->themeManager->getPackages('theme', $request->query->all());

        return $this->json([
            'total' => $total,
            'records' => $packages,
        ]);
    }

    /**
     * @throws \Exception
     * @throws TransportExceptionInterface
     */
    #[Route('/upload', name:'theme_upload', requirements: ['name' => '[a-z-A-Z0-9\-_]{2,}'], options: ['name' => '上传主题', 'parent' => 'appearance_theme'], methods: Request::METHOD_POST)]
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
            $filepath = $this->themeManager->downloadGithubPackage($uri);
        }
        if (!file_exists($filepath)) {
            return $this->json(['message' => 'File does not exist.',], Response::HTTP_NOT_ACCEPTABLE);
        }
        if (strtolower(pathinfo($filepath, PATHINFO_EXTENSION)) != 'zip') {
            unlink($filepath);
            return $this->json(['message' => 'File format is incorrect.',], Response::HTTP_NOT_ACCEPTABLE);
        }
        $this->themeManager->externalInstall($filepath);
        $this->bridger->getCache()->delete(OptionRepository::DEFAULT_CACHE_KEY);
        return $this->json(null);
    }


    /**
     * @param string $name
     * @return JsonResponse
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    #[Route('/{name}/activate', name: 'theme_activate', requirements: ['name' => '[a-z-A-Z0-9\-_]{2,}'], options: ['name' => '启用主题', 'parent' => 'appearance_theme', 'sort' => 0])]
    public function activate(string $name): JsonResponse
    {
        $this->themeManager->activate($name);
        $this->bridger->getCache()->delete(OptionRepository::DEFAULT_CACHE_KEY);
        return $this->json(null);
    }

    /**
     * @param Request $request
     * @param string $name
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws ORMException
     * @throws OptimisticLockException
     */
    #[Route('/{name}/setup', name:'theme_setup', requirements: [], options: ['name' => '安装主题', 'parent' => 'appearance_theme'])]
    public function setup(Request $request, string $name): JsonResponse
    {
        $this->themeManager->install($name);
        $this->bridger->getCache()->delete(OptionRepository::DEFAULT_CACHE_KEY);
        return $this->json(null);
    }

    /**
     * @throws \Exception
     */
    #[Route('/{name}/upgrade', name:'theme_upgrade', requirements: ['name' => '[a-z-A-Z0-9\-_]{2,}'], options: ['name' => '更新主题', 'parent' => 'appearance_theme'])]
    public function upgrade(string $name): JsonResponse
    {
        $this->themeManager->install($name);
        $this->bridger->getCache()->delete(OptionRepository::DEFAULT_CACHE_KEY);
        return $this->json(null);
    }

    /**
     * @throws \Exception
     */
    #[Route('/{name}/delete', name:'theme_delete', requirements: ['name' => '[a-z-A-Z0-9\-_]{2,}'], options: ['name' => '卸载主题', 'parent' => 'appearance_theme'])]
    public function delete(string $name): JsonResponse
    {
        $this->themeManager->uninstall($name);
        $this->bridger->getCache()->delete(OptionRepository::DEFAULT_CACHE_KEY);
        return $this->json(null);
    }
}
