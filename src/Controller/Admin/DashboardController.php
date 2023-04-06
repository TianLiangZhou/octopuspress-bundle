<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Controller\Admin;

use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use OctopusPress\Bundle\Entity\Option;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Repository\OptionRepository;
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
        $cards = [
            $this->getStatusCard(),
        ];
        $this->customCards($cards);
        $cards[] = $this->getSystemInfo();
        if (($memory = $this->getMemory())) {
            $cards[] = $memory;
        }
        $cards[] = $this->getPHPInfo($request);
        $cards[] = $this->getPHPExtension();
        return $this->json($cards);
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
        $data = [
            ['name' => '主机名', 'value' => php_uname('n')],
            ['name' => '内核', 'value' => php_uname('r')],
            ['name' => 'OS', 'value' => PHP_OS],
        ];
        $process = new Process(['uptime']);
        $process->run();
        if ($process->isSuccessful()) {
            $output = $process->getOutput();
            $data[] = ['name' => 'uptime', 'value' => $output];
        }
        $process = new Process(['cat', '/etc/timezone']);
        $process->run();
        if ($process->isSuccessful()) {
            $output = $process->getOutput();
            $data[] = ['name' => '时区', 'value' => $output];
        }
        $process = Process::fromShellCommandline('top -b -n 1 | grep Tasks');
        $process->run();
        if ($process->isSuccessful()) {
            $output = $process->getOutput();
            $data[] = ['name' => '进程', 'value' => substr($output, 6)];
        }
        $process = Process::fromShellCommandline('cat /proc/cpuinfo | grep "model name"');
        $process->run();
        if ($process->isSuccessful()) {
            $output = $process->getOutput();
            $data[] = ['name' => 'CPU', 'value' => substr(explode("\n", $output)[0], 12)];
        }

        return [
            'type' => 'table',
            'class' => 'col-6',
            'title' => '系统信息',
            'body' => $data,
            'settings' => [
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
     * @param Request $request
     * @return array<string, mixed>
     */
    private function getPHPInfo(Request $request): array
    {
        $phpVersion = PHP_VERSION;
        $dbVersion = $this->getEM()->getConnection()->getNativeConnection()->getAttribute(\PDO::ATTR_SERVER_VERSION);
        $symfonyVersion = Kernel::VERSION;
        $runEnv = php_sapi_name();
        $serverSoft = $request->server->get('SERVER_SOFTWARE');
        $zendVersion = zend_version();
        $iniDir = php_ini_loaded_file();
        $iniConfig = ini_get_all(null, false);
        $displayError = $iniConfig['display_errors'] === 1 ? ['checkmark-outline', 'success'] : ['close-outline', 'danger'];
        $timezone = date_default_timezone_get();
        $data = [
            [
                'type' => 'input',
                'value' => $phpVersion,
                'name' => 'PHP版本',
            ],
            [
                'type' => 'input',
                'value' => $zendVersion,
                'name' => 'Zend引擎版本',
            ],
            [
                'type' => 'input',
                'value' => $serverSoft,
                'name' => 'Web服务',
            ],
            [
                'type' => 'input',
                'value' => $dbVersion,
                'name' => '数据库版本',
            ],
            [
                'type' => 'input',
                'value' => $symfonyVersion,
                'name' => 'Symfony版本',
            ],
            [
                'type' => 'input',
                'value' => $runEnv,
                'name' => '运行模式',
            ],
            [
                'type' => 'input',
                'value' => $iniDir,
                'name' => 'INI路径',
            ],
            [
                'type' => 'input',
                'value' => $iniConfig['memory_limit'],
                'name' => '脚本最大内存',
            ],
            [
                'type' => 'input',
                'value' => $iniConfig['upload_max_filesize'],
                'name' => '最大上传大小',
            ],
            [
                'type' => 'input',
                'value' => $iniConfig['post_max_size'],
                'name' => 'POST提交大小',
            ],
            [
                'type' => 'icon',
                'value' => $displayError[0],
                'status' => $displayError[1],
                'name' => '显示错误',
            ],
            [
                'type' => 'input',
                'value' => $iniConfig['max_execution_time'],
                'name' => '脚本超时时间',
            ],
            [
                'type' => 'input',
                'value' => $timezone,
                'name' => '当前时区',
            ],
        ];
        return [
            'type' => 'form',
            'class' => 'col',
            'title' => 'PHP信息',
            'body' => $data,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function getPHPExtension(): array
    {
        $extensions = get_loaded_extensions();
        $body = [];
        foreach ($extensions as $ext) {
            $body[] = $ext;
        }
        return [
            'type' => 'grid',
            'class' => 'col',
            'title' => 'PHP扩展',
            'body' => $body,
        ];
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
        $switchValue  = $value ? 'on' : 'off';
        switch ($type) {
            case 'option':
                $option = $repository->findOneByName($id);
                if ($option == null) {
                    $option = new Option();
                    $option->setName($id);
                }
                if ($id === 'default_comment_status') {
                    $switchValue = $value ? 'open' : '';
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
                if ($id == 'default_comment_status') {
                    return $option->getValue() == 'open';
                }
                return $option->getValue() == 'on';
            case 'theme_mod':
                $theme = $repository->theme();
                return $repository->themeModuleFeature($id, $theme) == 'on';
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
