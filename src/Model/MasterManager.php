<?php

namespace OctopusPress\Bundle\Model;

use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;
use OctopusPress\Bundle\Entity\Option;
use OctopusPress\Bundle\Entity\Permission;
use OctopusPress\Bundle\Entity\Role;
use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Form\Model\InstallRequest;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Repository\RoleRepository;
use OctopusPress\Bundle\Repository\UserRepository;
use OctopusPress\Bundle\Util\Formatter;
use OctopusPress\Bundle\Widget\AbstractWidget;
use OctopusPress\Bundle\Widget\Archives;
use OctopusPress\Bundle\Widget\Audio;
use OctopusPress\Bundle\Widget\Breadcrumb;
use OctopusPress\Bundle\Widget\Categories;
use OctopusPress\Bundle\Widget\Cover;
use OctopusPress\Bundle\Widget\File;
use OctopusPress\Bundle\Widget\Gallery;
use OctopusPress\Bundle\Widget\Image;
use OctopusPress\Bundle\Widget\LatestComments;
use OctopusPress\Bundle\Widget\LatestPosts;
use OctopusPress\Bundle\Widget\MediaText;
use OctopusPress\Bundle\Widget\Navigation;
use OctopusPress\Bundle\Widget\Pages;
use OctopusPress\Bundle\Widget\Pagination;
use OctopusPress\Bundle\Widget\PreviousNext;
use OctopusPress\Bundle\Widget\RSS;
use OctopusPress\Bundle\Widget\SiteLogo;
use OctopusPress\Bundle\Widget\Tags;
use OctopusPress\Bundle\Widget\Video;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\String\ByteString;
use function Symfony\Component\String\b;
use function Symfony\Component\String\u;

class MasterManager
{
    private Bridger $bridger;
    private MenuManager $menuManager;
    private UserPasswordHasherInterface $passwordHasher;
    private ManagerRegistry $registry;

    public function __construct(
        ManagerRegistry             $registry,
        MenuManager                 $menuManager,
        UserPasswordHasherInterface $passwordHasher,
        Bridger                     $bridger,
    ) {
        $this->bridger = $bridger;
        $this->menuManager = $menuManager;
        $this->passwordHasher = $passwordHasher;
        $this->registry = $registry;
    }

    /**
     * @param InstallRequest $model
     * @param Request $request
     */
    public function setup(InstallRequest $model, Request $request): void
    {
        $optionRepository = $this->bridger->get(OptionRepository::class);
        if ($optionRepository->siteUrl()) {
            throw new \RuntimeException('You have installed the system!');
        }
        $defaultOptions = [
            'site_title' => $model->getTitle(),
            'site_subtitle' => $model->getSubtitle(),
            'site_url' => $request->getSchemeAndHttpHost(),
            'admin_email' => $model->getEmail(),
            'timezone' => date_default_timezone_get(),
            'lang'     => 'zh',
            'charset'  => 'UTF-8',
            'installed_time' => time(),
            'active_plugins' => [],
            'posts_per_page' => 50,
            'default_category' => '',
            'default_post_format' => '',
            'permalink_structure' => 'post_permalink_normal',
            'default_comment_status' => '',
            'comments_per_page' => 50,
            'comment_order' => 'desc',
            'comment_moderation' => Formatter::ON,
            'thumbnail_crop' => 1,
        ];
        $defaultOptions['thumbnail_size_w'] = $defaultOptions['thumbnail_size_h'] = 150;
        $defaultOptions['medium_size_w'] = $defaultOptions['medium_size_h'] = 300;
        $defaultOptions['large_size_w'] = $defaultOptions['large_size_h'] = 1024;
        $menus = array_keys($this->menuManager->registeredRoutes());
        $defaultOptions['roles'] = [
            ["name" => 'Administrator', 'capabilities' => array_combine($menus, array_fill(0, count($menus), 1))],
        ];
        $objectManager = $this->registry->getManager();
        foreach ($defaultOptions as $name => $value) {
            $option = new Option();
            $option->setName($name)
                ->setValue($value);
            $objectManager->persist($option);
        }
        $user = new User();
        $user->setPasswordHasher($this->passwordHasher);
        $user->setAccount($model->getAccount())
            ->setNickname($model->getAccount())
            ->setEmail($model->getEmail())
            ->setPassword($model->getPassword())
            ->setActivationKey(ByteString::fromRandom(24)->toString());
        $user->setRoles([1]);
        $objectManager->persist($user);
        $objectManager->flush();
    }

    /**
     * @return void
     */
    public function boot(): void
    {
        $this->createInitialPostTypes();
        $this->createInitialTaxonomies();
        $this->createInitialThemeFeatures();
        $this->createInitialWidgets();
    }


    /**
     * @return void
     */
    private function createInitialTaxonomies(): void
    {
        $termTaxonomy = $this->bridger->getTaxonomy();
        $termTaxonomy->registerTaxonomy('category', 'post', [
                'label' => '分类',
                'hierarchical' => true,
                'showPostFilter' => true,
            ])
            ->registerTaxonomy('tag', 'post', [
                'label' => '标签',
                'labels'=> [
                    'addNewItem'=> '添加新标签',
                    'editItem'  => '编辑标签',
                ],
            ])
            ->registerTaxonomy('nav_menu_item', 'nav_menu_item', [
                'label' => '导航',
                'showUi' => false,
                'showNavigation' => false,
            ])
        ;
    }

    /**
     * @return void
     */
    private function createInitialPostTypes(): void
    {
        $post = $this->bridger->getPost();
        $post->registerType('post', [
                'label' => '文章',
                'labels'=> [
                    'addItem' => '撰写新文章',
                    'editItem'=> '编辑文章',
                ],
                'supports' => [
                    'title', 'editor', 'author', 'thumbnail', 'excerpt', 'trackbacks', 'comments'
                ]
            ])
            ->registerType('page', [
                'label' => '页面',
                'labels'=> [
                    'addItem' => '创建页面',
                    'editItem'=> '编辑页面',
                ],
                'supports' => [
                    'title', 'editor', 'author', 'thumbnail', 'comments', 'parent'
                ]
            ])
            ->registerType('attachment', [
                'label' => '附件',
                'showNavigation' => false,
            ])
            ->registerType('nav_menu_item', [
                'label' => '导航条目',
                'showNavigation' => false,
            ])
        ;
    }

    /**
     * @return void
     */
    private function createInitialThemeFeatures(): void
    {
        $theme = $this->bridger->getTheme();
        $this->bridger->getMedia()->setPostThumbnailSize(500, 300, true);
        $theme->registerThemeFeature('custom_logo', [
            'type' => 'object',
            'description' => '',
            'schema' => [
                'properties' => [
                    'width' => [
                        'type' => 'integer',
                    ],
                    'height' => [
                        'type' => 'integer',
                    ],
                    'flex-width' => [
                        'type' => 'boolean',
                    ],
                    'flex-height' => [
                        'type' => 'boolean',
                    ],
                    'header-text' => [
                        'type' => 'array',
                        'items' => [
                            'type' => 'string',
                        ],
                    ],
                    'unlink-homepage-logo' => [
                        'type' => 'boolean',
                    ],
                ]
            ],
        ])
            ->registerThemeFeature('custom_header', [
                'description' => '',
                'type' => 'object',
                'schema' => [
                    'properties' => [
                        'default-image' => [
                            'type' => 'string',
                            'format' => 'uri',
                        ],
                        'random-default' => [
                            'type' => 'boolean',
                        ],
                        'width' => [
                            'type' => 'integer',
                        ],
                        'height' => [
                            'type' => 'integer',
                        ],
                        'flex-height' => [
                            'type' => 'boolean',
                        ],
                        'flex-width' => [
                            'type' => 'boolean',
                        ],
                        'default-text-color' => [
                            'type' => 'string',
                        ],
                        'header-text' => [
                            'type' => 'boolean',
                        ],
                        'uploads' => [
                            'type' => 'boolean',
                        ],
                        'video' => [
                            'type' => 'boolean',
                        ],
                    ],
                ]
            ])
            ->registerThemeFeature('custom_background', [
                'description' => '',
                'type' => 'object',
                'schema' => [
                    'properties' => [
                        'default-image' => [
                            'type' => 'string',
                            'format' => 'uri',
                        ],
                        'default-preset' => [
                            'type' => 'string',
                            'enum' => [
                                'default',
                                'fill',
                                'fit',
                                'repeat',
                                'custom',
                            ],
                        ],
                        'default-position-x' => [
                            'type' => 'string',
                            'enum' => [
                                'left',
                                'center',
                                'right',
                            ],
                        ],
                        'default-position-y' => [
                            'type' => 'string',
                            'enum' => [
                                'left',
                                'center',
                                'right',
                            ],
                        ],
                        'default-size' => [
                            'type' => 'string',
                            'enum' => [
                                'auto',
                                'contain',
                                'cover',
                            ],
                        ],
                        'default-repeat' => [
                            'type' => 'string',
                            'enum' => [
                                'repeat-x',
                                'repeat-y',
                                'repeat',
                                'no-repeat',
                            ],
                        ],
                        'default-attachment' => [
                            'type' => 'string',
                            'enum' => [
                                'scroll',
                                'fixed',
                            ],
                        ],
                        'default-color' => [
                            'type' => 'string',
                        ],
                    ],
                ]
            ]);
    }

    public function createInitialWidgets(): void
    {
        $hook = $this->bridger->getHook();
        $hook->add('setup_theme', function () {
            $defaults = [
                Navigation::class,
                Breadcrumb::class,
                LatestPosts::class,
                Pages::class,
                Archives::class,
                Categories::class,
                Tags::class,
                RSS::class,
                LatestComments::class,
                Image::class,
                Gallery::class,
                Video::class,
                Audio::class,
                File::class,
                MediaText::class,
                Cover::class,
                Pagination::class,
                PreviousNext::class,
            ];
            if ($this->bridger->getTheme()->getThemeSupport('custom_logo')) {
                $defaults[] = SiteLogo::class;
            }
            $wg = $this->bridger->getWidget();
            foreach ($defaults as $class) {
                $wg->registerForClassName($class);
            }
        });
    }
}
