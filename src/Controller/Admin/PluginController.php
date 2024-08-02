<?php

namespace OctopusPress\Bundle\Controller\Admin;


use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Customize\Draw;
use OctopusPress\Bundle\Customize\Layout\Form;
use OctopusPress\Bundle\Model\CustomizeManager;
use OctopusPress\Bundle\Model\PluginManager;
use OctopusPress\Bundle\Repository\OptionRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

#[Route('/plugin', name: 'plugin_')]
class PluginController extends AdminController
{
    private PluginManager $pluginManager;
    private string $tempDir;
    private CustomizeManager $customizeManager;

    public function __construct(
        Bridger $bridger,
        PluginManager $pluginManager,
        CustomizeManager $customizeManager,
    )
    {
        parent::__construct($bridger);
        $this->tempDir = $bridger->getTempDir();
        $this->pluginManager = $pluginManager;
        $this->customizeManager = $customizeManager;
    }

    /**
     * 插件列表
     *
     * @param Request $request
     * @return Response
     * @throws TransportExceptionInterface
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     */
    #[Route('/market')]
    public function market(Request $request): Response
    {
        [$total, $packages] = $this->pluginManager->getPackages('plugin', $request->query->all());

        return $this->json([
            'total'  => $total,
            'records'=> $packages,
        ]);
    }


    /**
     * @param Request $request
     * @param string $name
     * @return JsonResponse
     * @throws TransportExceptionInterface
     */
    #[Route('/{name}/setup', name: 'market_setup', options: ['name' => '安装插件', 'parent' => 'plugin_market', 'sort' => 0], methods: Request::METHOD_POST)]
    public function setup(Request $request, string $name): JsonResponse
    {
        $this->pluginManager->install($name);
        $this->bridger->getCache()->delete(OptionRepository::DEFAULT_CACHE_KEY);
        return $this->json(null);
    }


    /**
     * 已安装插件列表
     *
     */
    #[Route('/installed')]
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
            $this->bridger->getCache()->delete(OptionRepository::DEFAULT_CACHE_KEY);
        } catch (\Exception $exception) {
            return $this->json(['message' => $exception->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        return $this->json(null);
    }

    #[Route('/{name}/deactivate', name: 'installed_deactivate', options: ['name' => '禁用插件', 'parent' => 'plugin_installed', 'sort' => 0], methods: Request::METHOD_POST)]
    public function deactivate(string $name): JsonResponse
    {
        try {
            $this->pluginManager->deactivate($name);
            $this->bridger->getCache()->delete(OptionRepository::DEFAULT_CACHE_KEY);
        } catch (\Exception $exception) {
            return $this->json(['message' => $exception->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        return $this->json(null);
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
            $filepath = $this->pluginManager->downloadGithubPackage($uri);
        }
        if (!file_exists($filepath)) {
            return $this->json(['message' => 'File does not exist.',], Response::HTTP_NOT_ACCEPTABLE);
        }
        if (strtolower(pathinfo($filepath, PATHINFO_EXTENSION)) != 'zip') {
            unlink($filepath);
            return $this->json(['message' => 'File format is incorrect.',], Response::HTTP_NOT_ACCEPTABLE);
        }
        $this->pluginManager->externalInstall($filepath);
        $this->bridger->getCache()->delete(OptionRepository::DEFAULT_CACHE_KEY);
        return $this->json(null);
    }

    /**
     */
    #[Route('/{name}/down', name: 'installed_down', options: ['name' => '卸载插件', 'parent' => 'plugin_installed', 'sort' => 0], methods: Request::METHOD_POST)]
    public function down(string $name): JsonResponse
    {
        $this->pluginManager->down($name);
        $this->bridger->getCache()->delete(OptionRepository::DEFAULT_CACHE_KEY);
        return $this->json(null);
    }

    /**
     */
    #[Route('/{name}/upgrade', name:'plugin_upgrade', requirements: [], options: ['name' => '更新插件', 'parent' => 'plugin_installed'], methods: Request::METHOD_POST)]
    public function upgrade(string $name): JsonResponse
    {
        $this->pluginManager->install($name, true);
        $this->bridger->getCache()->delete(OptionRepository::DEFAULT_CACHE_KEY);
        return $this->json(null);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function settingProxy(Request $request): JsonResponse
    {
        $requestUri = $request->getRequestUri();
        if (empty($requestUri)) {
            return $this->json(null);
        }
        $draw = $this->bridger->getHook()->filter($requestUri, null);
        if ($draw instanceof Draw) {
            $layout = $draw->getLayout();
            if ($layout instanceof Form) {
                foreach ($layout->getControls() as $control) {
                    $control->setManager($this->customizeManager);
                }
            }
        }
        return $this->json($draw);
    }
}
