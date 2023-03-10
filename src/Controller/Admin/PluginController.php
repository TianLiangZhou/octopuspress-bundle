<?php

namespace OctopusPress\Bundle\Controller\Admin;


use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Model\PluginManager;
use OctopusPress\Bundle\Service\ServiceCenter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

#[Route('/plugin', name: 'plugin_')]
class PluginController extends AdminController
{
    private PluginManager $pluginManager;
    private string $tempDir;
    private ServiceCenter $center;

    public function __construct(Bridger $bridger, ServiceCenter $center, PluginManager $pluginManager) {
        parent::__construct($bridger);
        $this->center = $center;
        $this->pluginManager = $pluginManager;
        $this->tempDir = $bridger->getTempDir();
    }

    #[Route('/menu1', name: 'market', options: ['name' => '插件市场', 'parent' => 'plugin', 'sort' => 0, 'link' => '/app/plugin/market'])]
    #[Route('/menu2', name: 'installed', options: ['name' => '已安装插件', 'parent' => 'plugin', 'sort' => 0, 'link' => '/app/plugin/installed'])]
    #[Route('/market', name: 'market_sets', options: ['name' => '插件列表', 'parent' => 'plugin_market', 'sort' => 0])]
    public function market(): Response
    {
        return new Response();
    }


    #[Route('/setup', name: 'market_setup', options: ['name' => '安装插件', 'parent' => 'plugin_market', 'sort' => 0], methods: Request::METHOD_POST)]
    public function setup(Request $request): JsonResponse
    {
        return $this->json([]);
    }


    /**
     * @throws \ReflectionException
     */
    #[Route('/installed', name: 'installed_sets', options: ['name' => '已安装插件列表', 'parent' => 'plugin_installed', 'sort' => 0])]
    public function installed(): JsonResponse
    {
        $plugins = $this->pluginManager->plugins();
        return $this->json([
            'total' => count($plugins),
            'records' => $plugins,
        ]);
    }


    #[Route('/{name}/activate', name: 'installed_activate', options: ['name' => '启用插件', 'parent' => 'plugin_installed', 'sort' => 0], methods: Request::METHOD_POST)]
    public function activate(string $name): JsonResponse
    {
        try {
            $this->pluginManager->activate($name);
        } catch (\Exception $exception) {
            return $this->json(['message' => $exception->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        return $this->json([]);
    }

    #[Route('/{name}/deactivate', name: 'installed_inactive', options: ['name' => '禁用插件', 'parent' => 'plugin_installed', 'sort' => 0], methods: Request::METHOD_POST)]
    public function deactivate(string $name): JsonResponse
    {
        try {
            $this->pluginManager->deactivate($name);
        } catch (\Exception $exception) {
            return $this->json(['message' => $exception->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        return $this->json([

        ]);
    }


    /**
     * @throws TransportExceptionInterface
     */
    #[Route('/upload', name: 'installed_upload', options: ['name' => '上传插件', 'parent' => 'plugin_installed', 'sort' => 0], methods: Request::METHOD_POST)]
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
        $this->pluginManager->setup($filepath);
        return $this->json([
        ]);
    }

    /**
     */
    #[Route('/{name}/down', name: 'installed_down', options: ['name' => '卸载插件', 'parent' => 'plugin_installed', 'sort' => 0], methods: Request::METHOD_POST)]
    public function down(string $name): JsonResponse
    {
        $this->pluginManager->down($name);
        return $this->json([
        ]);
    }

}
