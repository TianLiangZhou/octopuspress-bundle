<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Controller\Admin;

use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use OctopusPress\Bundle\Entity\Option;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Util\Formatter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Process\Process;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class DashboardController
 * @package App\Controller\Admin
 */
class DashboardController extends AdminController
{
    #[Route('/menu1', name: 'post', options: ['name' => '文章', 'sort' => 2, 'icon' => 'file-text'])]
    #[Route('/menu2', name: 'page', options: ['name' => '页面',  'sort' => 3, 'icon' => 'file'])]
    #[Route('/menu3', name: 'comment', options: ['name' => '评论',  'sort' => 4, 'link' => '/app/comment', 'icon' => 'message-square-outline'])]
    #[Route('/menu4', name: 'appearance', options: ['name' => '外观',  'sort' => 5, 'icon' => 'brush-outline'])]
    #[Route('/menu5', name: 'media', options: ['name' => '媒体',  'sort' => 6, 'icon' => 'camera'])]
    #[Route('/menu6', name: 'plugin', options: ['name' => '插件', 'sort' => 7, 'icon' => 'layers'])]
    #[Route('/menu7', name: 'user', options: ['name' => '用户', 'sort' => 8, 'icon' => 'person'])]
    #[Route('/menu8', name: 'setting', options: ['name' => '设置', 'sort' => 9, 'icon' => 'settings-2'])]


    #[Route('/menu/post', name: 'post_all', options: ['name' => '所有文章', 'parent' => 'post', 'sort' => 0, 'link' => '/app/content/post'])]
    #[Route('/menu/post-new', name: 'post_new', options: ['name' => '写文章', 'parent' => 'post', 'sort' => 1, 'link' => '/app/content/post-new'])]
    #[Route('/menu/category', name: 'category', options: ['name' => '分类目录', 'parent' => 'post', 'sort' => 3, 'link' => '/app/taxonomy/category'])]
    #[Route('/menu/tag', name: 'tag', options: ['name' => '标签', 'parent' => 'post', 'sort' => 3, 'link' => '/app/taxonomy/tag'])]

    #[Route('/menu/page', name: 'page_all', options: ['name' => '所有页面', 'parent' => 'page', 'sort' => 1, 'link' => '/app/content/page'])]
    #[Route('/menu/page-new', name: 'page_new', options: ['name'=> '新建页面', 'parent' => 'page', 'sort'=> 2, 'link' => '/app/content/post-new/page'])]

    #[Route('/menu/navigation', name: 'appearance_navigation', options: ['name' => '导航', 'parent' => 'appearance', 'sort' => 2, 'link' => '/app/decoration/navigation'])]
    #[Route('/menu/theme', name: 'appearance_theme', options: ['name' => '主题', 'parent' => 'appearance', 'sort' => 3, 'link' => '/app/decoration/theme'])]
    #[Route('/menu/widget', name: 'appearance_widget', options: ['name' => '挂件', 'parent' => 'appearance', 'sort' => 3, 'link' => '/app/decoration/widget'])]
    #[Route('/menu/customize', name: 'appearance_customize', options: ['name' => '自定义', 'parent' => 'appearance', 'sort' => 3, 'link' => '/app/decoration/custom'])]

    #[Route('/menu/plugin_market', name: 'plugin_market', options: ['name' => '插件市场', 'parent' => 'plugin', 'sort' => 0, 'link' => '/app/plugin/market'])]
    #[Route('/menu/plugin_installed', name: 'plugin_installed', options: ['name' => '已安装插件', 'parent' => 'plugin', 'sort' => 0, 'link' => '/app/plugin/installed'])]


    #[Route('/menu/library', name: 'media_library', options: ['name' => '媒体库', 'parent' => 'media', 'link' => '/app/media'])]

    #[Route('/menu/user', name: 'user_all', options: ['name' => '所有用户', 'parent' => 'user', 'sort' => 0, 'link' => '/app/user'])]
    #[Route('/menu/user-new', name: 'user_new', options: ['name' => '添加用户', 'parent' => 'user', 'sort' => 1, 'link' => '/app/user/new'])]
    #[Route('/menu/profile', name: 'user_profile', options: ['name' => '个人资料', 'parent' => 'user', 'sort' => 2, 'link' => '/app/user/profile'])]


    #[Route('/menu/global', name: 'setting_global', options: ['name' => '全局', 'parent' => 'setting', 'sort' => 0, 'link' => '/app/system/option'])]
    #[Route('/menu/option', name: 'setting_option', options: ['name' => '站点', 'parent' => 'setting',  'sort' => 1, 'link' => '/app/system/setting'])]
    #[Route('/menu/role', name: 'setting_role', options: ['name' => '角色', 'parent' => 'setting', 'sort' => 2, 'link' => '/app/system/role'])]
    public function menu(): Response
    {
        return new Response();
    }



    #[Route('/dashboard', name: 'dashboard', options: ['name' => '面板', 'sort' => 1, 'icon' => 'home', 'link' => '/app/dashboard', 'home' => true])]
    public function main(Request $request): JsonResponse
    {
        $cards = [];
        $cards[] = $this->getSystemInfo();
        if (($memory = $this->getMemory())) {
            $cards[] = $memory;
        }
        $this->customCards($cards);
        $dashboard = [
            'status' => $this->getStatusCard(),
            'cards'  => $cards,
        ];
        return $this->json($dashboard);
    }


    #[Route('/dashboard/switch/status', name: 'dashboard_switch_status', options: ['name' => '面板状态开关', 'parent' => 'dashboard', 'sort' => 1], methods: Request::METHOD_POST)]
    public function switchStatus(Request $request): JsonResponse
    {
        $body = $request->toArray();
        if (empty($body['id'])) {
            return $this->json(['message'=> ''], Response::HTTP_NOT_ACCEPTABLE);
        }
        $statusCards = $this->collectionStatusCard();
        $status = null;
        foreach ($statusCards as $card) {
            if ($card['id'] === $body['id']) {
                $status = $card;
                break;
            }
        }
        if ($status == null) {
            return $this->json(['message'=> ''], Response::HTTP_NOT_ACCEPTABLE);
        }
        $callback = null;
        if (isset($status['saveCallback']) && is_callable($status['saveCallback'])) {
            $callback = $status['saveCallback'];
        } elseif (isset($status['type']) && $status['type']) {
            $callback = $this->defaultStatusSaveCallback(...);
        }
        if ($callback) {
            call_user_func($callback, (bool) $body['value'], $body['id'], $status['type'] ?? '');
        }
        return $this->json([]);
    }

    /**
     * @return string[]
     */
    private function getSystemInfo(): array
    {
        $resource = $this->getEM()->getConnection()->getNativeConnection();
        $dbInfo = ucfirst($resource->getAttribute(\PDO::ATTR_DRIVER_NAME))
            . ':' .$resource->getAttribute(\PDO::ATTR_SERVER_VERSION);
        $boolMap = [false => '否', true => '是'];
        $collection = [
            ['name' => 'PHP', 'value' => PHP_VERSION],
            ['name' => 'SAPI', 'value' => php_sapi_name()],
            ['name' => '数据库', 'value' => $dbInfo],
            ['name' => '当前时区', 'value' => date_default_timezone_get()],
            ['name' => '脚本最大内存', 'value' => ini_get('memory_limit')],
            ['name' => '最大上传大小', 'value' => ini_get('upload_max_filesize')],
            ['name' => '显示错误', 'value' => $boolMap[(bool) ini_get('display_errors')]],
            ['name' => '脚本超时时间', 'value' => ini_get('max_execution_time')],
            ['name' => 'Symfony', 'value' => Kernel::VERSION],
            ['name' => 'Intl支持', 'value' => $boolMap[extension_loaded('intl')]],
            ['name' => 'Redis支持', 'value' => $boolMap[extension_loaded('redis')]],
            ['name' => 'FFI支持', 'value' => $boolMap[extension_loaded('FFI')]],
            ['name' => 'GD支持', 'value' => $boolMap[extension_loaded('gd')]],
            ['name' => '主机名', 'value' => php_uname('n')],
            ['name' => '内核', 'value' => php_uname('r')],
            ['name' => 'OS', 'value' => PHP_OS],
        ];
        $collection = $this->bridger->getHook()->filter('dashboard_system_info', $collection);
        $process = new Process(['uptime']);
        $process->run();
        if ($process->isSuccessful()) {
            $output = $process->getOutput();
            $collection[] = ['name' => 'uptime', 'value' => $output];
        }
        $process = new Process(['cat', '/etc/timezone']);
        $process->run();
        if ($process->isSuccessful()) {
            $output = $process->getOutput();
            $collection[] = ['name' => '时区', 'value' => $output];
        }
        $process = Process::fromShellCommandline('top -b -n 1 | grep Tasks');
        $process->run();
        if ($process->isSuccessful()) {
            $output = $process->getOutput();
            $collection[] = ['name' => '进程', 'value' => substr($output, 6)];
        }
        $process = Process::fromShellCommandline('cat /proc/cpuinfo | grep "model name"');
        $process->run();
        if ($process->isSuccessful()) {
            $output = $process->getOutput();
            $collection[] = ['name' => 'CPU', 'value' => substr(explode("\n", $output)[0], 12)];
        }

        return [
            'type' => 'table',
            'class' => 'col-6',
            'title' => '系统信息',
            'body' => $collection,
            'settings' => [
                'pager' => [
                    'perPage' => 128,
                ],
                'actions' => [
                    'add' => false,
                    'delete' => false,
                    'edit' => false,
                    'position' => 'right',
                ],
                'columns' => [
                    'name' => [
                        'title' => '名称',
                        'filter' => false,
                    ],
                    'value' => [
                        'title' => '值',
                        'filter' => false,
                    ]
                ]
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function getMemory(): array
    {
        $process = new Process(['free', '-m']);
        $process->run();
        if ($process->isSuccessful()) {
            $output = $process->getOutput();
            $table = explode("\n", $output);
            $columns = str_split(substr($table[0], 8), 12);
            $data = [];
            foreach ($columns as $column) {
                $data[] = [
                    'name' => preg_replace('/\s+/', '', $column),
                    'value' => 0,
                ];
            }
            $columns = str_split(substr($table[1], 8), 12);
            foreach ($columns as $k => $column) {
                $data[$k]['value'] = (int) preg_replace('/\s+/', '', $column);
            }

            return [
                'type' => 'number',
                'class' => 'col-6',
                'title' => '内存 MB',
                'body'  => $data,
                'settings' => [
                    'animations' => true,
                    'legend' => true,
                    'labels' => true,
                ],
            ];
        }
        return [];
    }

    /**
     * @return array<string, mixed>
     */
    private function getStatusCard(): array
    {
        $originCards = $this->collectionStatusCard();
        $cards = [];
        foreach ($originCards as $card) {
            if (!isset($card['id']) || !isset($card['title'])) {
                continue;
            }
            if (isset($cards[$card['id']])) {
                continue;
            }
            $callback = null;
            if (isset($card['sanitizeCallback']) && is_callable($card['sanitizeCallback'])) {
                $callback = $card['sanitizeCallback'];
            } else {
                $callback = $this->defaultStatusSanitizeCallback(...);
            }
            $card['value'] = (bool) call_user_func($callback, $card['id'], $card['type'] ?? '');
            $cards[$card['id']] = [
                'id' => $card['id'],
                'title' => $card['title'],
                'icon' => $card['icon'] ?? 'sun-outline',
                'primaryColor' => $card['primaryColor'] ?? 'warning',
                'value' => $card['value'],
            ];
        }

        return [
            'type' => 'status',
            'class' => 'col-12',
            'title' => '',
            'body' => array_values($cards),
        ];
    }

    /**
     * @param array $cards
     * @return void
     */
    private function customCards(array &$cards): void
    {
        $widgets = $this->bridger->getPlugin()->getDashboardWidgets();
        foreach ($widgets as $widget) {
            if ($widget['type'] == 'status') {
                continue;
            }
            $cards[] = $widget;
        }
    }

    /**
     * @return array[]
     */
    private function collectionStatusCard(): array
    {
        $statusCards = $this->getDefaultStatusCard();
        $widgets = $this->bridger->getPlugin()->getDashboardWidgets();
        foreach ($widgets as $widget) {
            if ($widget['type'] != 'status') {
                continue;
            }
            $statusCards = array_merge($statusCards, $widget['value']);
        }
        return $statusCards;
    }

    /**
     * @param bool $value
     * @param string $id
     * @param string $type
     * @return void
     * @throws ORMException
     * @throws OptimisticLockException
     */
    private function defaultStatusSaveCallback(bool $value, string $id, string $type): void
    {
        $repository = $this->bridger->get(OptionRepository::class);
        $switchValue  = $value ? Formatter::ON : Formatter::OFF;
        switch ($type) {
            case 'option':
                $option = $repository->findOneByName($id);
                if ($option == null) {
                    $option = new Option();
                    $option->setName($id);
                }
                $option->setValue($switchValue);
                $repository->add($option);
                break;
            case 'theme_mod':
                $theme = $repository->theme();
                $mod = $repository->findOneByName('theme_mods_' . $theme);
                $value = [];
                if ($mod != null) {
                    $value = $repository->themeModules($theme);
                } else {
                    $mod = new Option();
                    $mod->setName('theme_mods_' . $theme);
                }
                $value[$id] = $switchValue;
                $mod->setValue($value);
                $repository->add($mod);
                break;
        }
    }

    /**
     * @param string $id
     * @param string $type
     * @return bool
     */
    private function defaultStatusSanitizeCallback(string $id, string $type): bool
    {
        $repository = $this->bridger->get(OptionRepository::class);
        switch ($type) {
            case 'option':
                $option = $repository->findOneByName($id);
                if ($option == null) {
                    return false;
                }
                return $option->getValue() === true;
            case 'theme_mod':
                $theme = $repository->theme();
                return $repository->themeModuleFeature($id, $theme) === Formatter::ON;
            default:
                return false;
        }
    }




    /**
     * @return array[]
     */
    private function getDefaultStatusCard(): array
    {
        $defaults = [
            [
                'id' => 'maintenance',
                'title' => '维护',
                'icon' => 'monitor-outline',
                'primaryColor' => 'danger',
                'type' => 'option',
            ],
            [
                'id' => 'default_comment_status',
                'title' => '评论',
                'icon' => 'message-circle-outline',
                'primaryColor' => 'warning',
                'type' => 'option',
            ],
        ];
        if ($this->bridger->getTheme()->isThemeSupport('search')) {
            $defaults[] = [
                'id' => 'search',
                'title' => '搜索',
                'icon' => 'search-outline',
                'primaryColor' => 'primary',
                'type' => 'theme_mod',
            ];
        }
        return $defaults;
    }
}
