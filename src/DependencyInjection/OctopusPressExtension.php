<?php

namespace OctopusPress\Bundle\DependencyInjection;


use DoctrineExtensions\Query\Mysql\Day;
use DoctrineExtensions\Query\Mysql\Month;
use DoctrineExtensions\Query\Mysql\Year;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\CKFinder\CKFinderAuthentication;
use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Security\AuthenticationEntryPoint;
use OctopusPress\Bundle\Security\Handler\AccessDeniedHandler;
use OctopusPress\Bundle\Security\Handler\LoginFailureHandler;
use OctopusPress\Bundle\Service\Requester;
use OctopusPress\Bundle\Service\ServiceCenter;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\PhpFileLoader;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\Security\Core\Authorization\Voter\AuthenticatedVoter;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class OctopusPressExtension extends Extension implements PrependExtensionInterface
{

    /**
     * @param ContainerBuilder $container
     * @return void
     */
    public function prepend(ContainerBuilder $container): void
    {
        $assetsUrl = null;
        if ($container->hasExtension('framework')) {
            $frameworkConfig = $container->getExtensionConfig('framework');
            foreach ($frameworkConfig as $fragment) {
                if (isset($fragment['assets']['base_urls'])) {
                    $assetsUrl = (array) $fragment['assets']['base_urls'];
                }
            }

            $container->prependExtensionConfig('framework', [
                'http_client' => [
                    'max_host_connections' => 10,
                    'default_options' => [
                        'max_redirects' => 7,
                    ],
                ],
            ]);
        }
        $container->prependExtensionConfig($this->getAlias(), [
            'assetsUrl' => $assetsUrl,
        ]);
        $selfConfig = $container->getExtensionConfig($this->getAlias());

        if ($container->hasExtension('security')) {
            $securityConfig = $container->getExtensionConfig('security')[0] ?? [];
            $securityConfig['password_hashers'][User::class] = ['algorithm' => 'auto'];
            $securityConfig['providers']['users_in_doctrine']['entity'] = [
                'class' => User::class,
                'property' => 'email',
            ];
            $securityConfig['firewalls']['main'] = [
                'provider' => 'users_in_doctrine',
                'lazy' => true,
                'entry_point' => AuthenticationEntryPoint::class,
                'access_denied_handler' => AccessDeniedHandler::class,
                'json_login' => [
                    'failure_handler' => LoginFailureHandler::class,
                    'check_path' => 'authorize_login',
                    'username_path' => 'email',
                    'password_path'  => 'password',
                ],
                'logout' => [
                    'path' => 'authorize_logout',
                    'target' => '/#/auth/login',
                ],
                'login_throttling' => [
                    'max_attempts' => 5,
                    'interval'     => '15 minutes',
                ],
            ];

            $securityConfig['access_control'][] = [
                'path' => '^/backend/open/configuration',
                'roles' => AuthenticatedVoter::PUBLIC_ACCESS,
            ];
            $securityConfig['access_control'][] = [
                'path' => '^/backend', 'roles' => 'ROLE_ADMIN'
            ];
            foreach ($selfConfig['accessControls']??[] as $control) {
                $securityConfig['access_control'][] = [
                    'path' => $control['path'] ?? '',
                    'roles'=> $control['roles'] ?? AuthenticatedVoter::PUBLIC_ACCESS,
                ];
            }

            $container->prependExtensionConfig('security', $securityConfig);
        }

        if ($container->hasExtension('doctrine')) {
            $doctrineConfig = $container->getExtensionConfig('doctrine');
            $entityManagers = [];
            $defaultManager = null;
            $drivers = [];
            foreach ($doctrineConfig as $config) {
                if (isset($config['orm']['default_entity_manager'])) {
                    $defaultManager = $config['orm']['default_entity_manager'];
                }
                if (isset($config['dbal']['connections'])) {
                    foreach ($config['dbal']['connections'] as $name => $serviceConfig) {
                        if (isset($serviceConfig['driver'])) {
                            $drivers[$name] = $serviceConfig['driver'];
                        }
                    }
                }
                $entityManagers = array_merge($entityManagers, array_keys($config['orm']['entity_managers'] ?? []));
            }
            if (empty($entityManagers)) {
                $entityManagers = ['default'];
            }
            if (empty($drivers)) {
                $drivers['default'] = 'pdo_mysql';
            }
            foreach ($entityManagers as $name) {
                if (!isset($drivers[$name])) {
                    continue;
                }
                $timeFunctions = [];
                if (str_contains($drivers[$name], 'mysql')) {
                    $timeFunctions['year'] = Year::class;
                    $timeFunctions['month'] = Month::class;
                    $timeFunctions['day'] = Day::class;
                } elseif (str_contains($drivers[$name], 'pgsql')) {
                    $timeFunctions['year'] = \DoctrineExtensions\Query\Postgresql\Year::class;
                    $timeFunctions['month'] = \DoctrineExtensions\Query\Postgresql\Month::class;
                    $timeFunctions['day'] = \DoctrineExtensions\Query\Postgresql\Day::class;
                } elseif (str_contains($drivers[$name], 'sqlite')) {
                    $timeFunctions['year'] = \DoctrineExtensions\Query\Sqlite\Year::class;
                    $timeFunctions['month'] =\DoctrineExtensions\Query\Sqlite\Month::class;
                    $timeFunctions['day'] = \DoctrineExtensions\Query\Sqlite\Day::class;
                } elseif (str_contains($drivers[$name], 'oci')) {
                    $timeFunctions['year'] = \DoctrineExtensions\Query\Oracle\Year::class;
                    $timeFunctions['month'] = \DoctrineExtensions\Query\Oracle\Month::class;
                    $timeFunctions['day'] = \DoctrineExtensions\Query\Oracle\Day::class;
                }
                if (empty($timeFunctions)) {
                    continue;
                }
                $container->prependExtensionConfig('doctrine', [
                   'orm' => [
                       'entity_managers' => [
                           $name => [
                               'dql' => [
                                   'datetime_functions' => $timeFunctions,
                                   'string_functions' => [],
                                   'numeric_functions' => [],
                               ],
                           ],
                       ]
                   ]
                ]);
            }
            if ($defaultManager) {
                $container->prependExtensionConfig('doctrine', [
                    'orm' => [
                        'entity_managers' => [
                            $defaultManager => [
                                'mappings' => [
                                    'OctopusPress' => [
                                        'type' => 'attribute',
                                        'dir' =>  __DIR__ . '/../Entity',
                                        'alias' => 'OctopusPress',
                                        'prefix' => 'OctopusPressBundle\Entity',
                                        'is_bundle' => false,
                                        'mapping' => true
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]);
            }
        }
        if (empty($assetsUrl)) {
            $assetsUrl = ['http://localhost:8080'];
        }
        $publicDir = $this->getPublicDir($container);
        $ckfinderConfig = $container->getExtensionConfig('ckfinder')[0] ?? [];
        $defaultConfig = [
            'authenticationClass' => CKFinderAuthentication::class,
            'backends' => [],
            'resourceTypes' => [],
        ];
        $defaultConfig['backends']['default'] = $ckfinderConfig['connector']['backends']['default'] ?? [
            'name'=> 'default',
            'adapter'=> 'local',
            'baseUrl'=> '',
            'root'   => '',
            'chmodFiles'  => 0755,
            'chmodFolders'=> 0755,
            'filesystemEncoding'=> 'UTF-8',
        ];
        $defaultConfig['backends']['default']['baseUrl'] = $assetsUrl[0];
        $defaultConfig['backends']['default']['root'] = $publicDir;
        $defaultConfig['resourceTypes'][] = [
            'name'              => 'Files', // Single quotes not allowed.
            'directory'         => 'upload/files',
            'maxSize'           => '128M',
            'allowedExtensions' => '7z,aiff,asf,avi,bmp,csv,doc,docx,fla,flv,gif,gz,gzip,jpeg,jpg,mid,mov,mp3,mp4,mpc,mpeg,mpg,ods,odt,pdf,png,ppt,pptx,pxd,qt,ram,rar,rm,rmi,rmvb,rtf,sdc,sitd,swf,sxc,sxw,tar,tgz,tif,tiff,txt,vsd,wav,wma,wmv,xls,xlsx,zip',
            'deniedExtensions'  => '',
            'backend'           => 'default'
        ];
        $defaultConfig['resourceTypes'][] = [
            'name'              => 'Images',
            'directory'         => 'upload/images',
            'maxSize'           => '16M',
            'allowedExtensions' => 'bmp,gif,jpeg,jpg,png,webp',
            'deniedExtensions'  => '',
            'backend'           => 'default'
        ];
        $defaultConfig['resourceTypes'][] = [
            'name'              => 'Videos',
            'directory'         => 'upload/videos',
            'maxSize'           => '512M',
            'allowedExtensions' => 'flv,avi,mp4,mkv,mov,wmv,webm,rmvb',
            'deniedExtensions'  => '',
            'backend'           => 'default'
        ];
        $defaultConfig['resourceTypes'][] = [
            'name'              => 'Audios',
            'directory'         => 'upload/audios',
            'maxSize'           => '64M',
            'allowedExtensions' => 'mp3,wav,flac,ape,aac,ogg',
            'deniedExtensions'  => '',
            'backend'           => 'default'
        ];

        $container->prependExtensionConfig('ckfinder', [
            'connector' => $defaultConfig
        ]);
    }


    /**
     * @param array $configs
     * @param ContainerBuilder $container
     * @return void
     * @throws \Exception
     */
    public function load(array $configs, ContainerBuilder $container): void
    {
        // TODO: Implement load() method.
        $configuration = $this->getConfiguration($configs, $container);
        $config = $this->processConfiguration($configuration, $configs);

        $loader = new PhpFileLoader($container, new FileLocator(__DIR__ . '/../../config'));
        $assetsUrl = $config['assetsUrl'];
        if (empty($assetsUrl)) {
            $assetsUrl = ['http://localhost:8080'];
        }
        $loader->load('services.php');
        $container->setParameter('assets.base_urls', $assetsUrl);
        $container->setParameter('plugin_dir', $config['pluginDir']);
        $publicDir = $this->getPublicDir($container);
        $buildAssetDir = empty($config['buildAssetDir']) ? $publicDir : $config['buildAssetDir'];
        $container->setParameter('build_asset_dir', $buildAssetDir);
        $container->setParameter('public_dir', $publicDir);
        $container->register(AuthenticationEntryPoint::class, AuthenticationEntryPoint::class);
        $container->register(AccessDeniedHandler::class, AccessDeniedHandler::class);
        $container->register(LoginFailureHandler::class, LoginFailureHandler::class);


//        $services->set('config_cache_factory', ResourceCheckerConfigCacheFactory::class)
//            ->args([
//                service('router'),
//                $container->getParameter('kernel.debug') ? tagged_iterator('config_cache.resource_checker') : [],
//            ]);

        $this->generateRoute($container->getParameter('kernel.project_dir'), $this->getAlias());
    }

    /**
     * @param array $config
     * @param ContainerBuilder $container
     * @return Configuration
     */
    public function getConfiguration(array $config, ContainerBuilder $container): Configuration
    {
        return new Configuration($container->getParameter('kernel.debug'), $this->getAlias());
    }

    /**
     * @return string
     */
    public function getAlias(): string
    {
        return 'octopus_press';
    }

    /**
     * @param ContainerBuilder $container
     * @return string
     */
    private function getPublicDir(ContainerBuilder $container): string
    {
        $composerFile = $container->getParameter('kernel.project_dir') . '/composer.json';
        $publicDir = '%kernel.project_dir%/public';
        if (file_exists($composerFile)) {
            $composer = json_decode(file_get_contents($composerFile), true);
            if (isset($composer['extra']['public-dir'])) {
                $publicDir = '%kernel.project_dir%/' . $composer['extra']['public-dir'];
            }
            if (isset($composer['extra']['symfony-web-dir'])) {
                $publicDir = '%kernel.project_dir%/' . $composer['extra']['symfony-web-dir'];
            }
        }
        return $publicDir;
    }


    /**
     * @param string $projectDir
     * @param string $extensionName
     * @return void
     */
    private function generateRoute(string $projectDir, string $extensionName): void
    {
        $data = <<<EOF
<?php

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

return static function(RoutingConfigurator \$configurator) {
    \$configurator->import('@OctopusPressBundle/config/routes.php');
};
EOF;
        if (is_writable($projectDir . '/config')) {
            file_put_contents(sprintf("%s/config/routes/%s.php", $projectDir, $extensionName), $data);
        }
    }

}
