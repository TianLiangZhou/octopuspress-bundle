<?php

namespace OctopusPress\Bundle\Model;

use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectRepository;
use JsonSerializable;
use OctopusPress\Bundle\Customize\AbstractControl;
use OctopusPress\Bundle\Customize\Control;
use OctopusPress\Bundle\Customize\ImageControl;
use OctopusPress\Bundle\Customize\Section;
use OctopusPress\Bundle\Entity\Option;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Scalable\Hook;
use OctopusPress\Bundle\Repository\OptionRepository;

final class CustomizeManager implements JsonSerializable
{
    /**
     * @var array<integer|string, Section>
     */
    private array $sections = [];

    /**
     * @var OptionRepository $optionRepository
     */
    private ObjectRepository $optionRepository;
    private ManagerRegistry $doctrine;
    private Bridger $bridger;

    /**
     * @param ManagerRegistry $doctrine
     * @param Bridger $bridger
     */
    public function __construct(ManagerRegistry $doctrine, Bridger $bridger)
    {
        $this->doctrine = $doctrine;
        $this->bridger = $bridger;
        $this->optionRepository = $this->bridger->getOptionRepository();
        $this->getHook()->add('setup_theme', $this->registerDefaultSection(...));
    }

    /**
     * @param string $name
     * @param mixed|null $defaultValue
     * @return mixed
     */
    public function getOption(string $name, mixed $defaultValue = null): mixed
    {
        return $this->optionRepository->value($name, $defaultValue);
    }

    /**
     * @return array
     */
    public function getThemeMod(): array
    {
        return $this->optionRepository->themeModules($this->optionRepository->theme());
    }

    /**
     * @param array<string, mixed> $data
     */
    public function save(array $data): void
    {
        $changedControlsData = $data['customized'];

        $controls = [];
        foreach ($this->sections as $section) {
            $controls = array_merge($controls, $section->getControls());
        }
        $theme = $this->optionRepository->theme();
        $themeModObject = $this->optionRepository->findOneByName('theme_mods_' . $theme);
        if ($themeModObject == null) {
            $themeModObject = new Option();
            $themeModObject->setName('theme_mods_' . $theme);
        }
        $themeMod = $this->getThemeMod();
        $persists = [];
        $themeModChanged = false;
        $customControlStorages = [];
        foreach ($changedControlsData as $id => $value) {
            if (!isset($controls[$id])) {
                continue;
            }
            $control = $controls[$id];
            if (!$control->validate($value)) {
                continue;
            }
            $value = $control->sanitize($value);
            switch ($control->getStorage()) {
                case 'option':
                    $option = $this->optionRepository->findOneByName($id);
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
            return ;
        }
        if ($themeModChanged) {
            $themeModObject->setValue($themeMod);
            $persists[] = $themeModObject;
        }
        $objectManager = $this->doctrine->getManager();
        foreach ($persists as $persist) {
            $objectManager->persist($persist);
        }

        $hook = $this->getHook();
        foreach ($customControlStorages as $hookName => $value) {
            $hook->action($hookName, $value, $objectManager, $this);
        }
        $objectManager->flush();
    }

    /**
     * @return Bridger
     */
    public function getBridger(): Bridger
    {
        return $this->bridger;
    }

    /**
     * @return Hook
     */
    public function getHook(): Hook
    {
        return $this->getBridger()->getHook();
    }

    /**
     * @return void
     */
    private function registerDefaultSection(): void
    {
        $this->registerTagline();
        $this->registerColor();
        $this->registerBackgroundImage();
        $this->registerCarousel();
        $this->getHook()->action('customize_register', $this);
    }

    /**
     * @return void
     */
    private function registerTagline(): void
    {
        $basic = $this->addDefaultSection('tagline', ['label' => '站点基础']);

        $theme = $this->bridger->getTheme();

        $basic->addControl($this->newDefaultControl('site_title', [
            'label' => '站点标题',
            'storage' => 'option',
        ]));
        $basic->addControl($this->newDefaultControl('site_subtitle', [
            'label' => '站点副标题',
            'storage' => 'option',
        ]));
        if ($theme->isThemeSupport('custom_logo')) {
            $args = $theme->getThemeSupport('custom_logo');
            $imageControl = new ImageControl('custom_logo', [
                'label' => '站点Logo',
                'width' => (int) $args['width'],
                'height' => (int) $args['height'],
            ]);
            $basic->addControl($imageControl);
        }
        $siteIcon = new ImageControl('site_icon', [
            'label' => '站点图标',
            'storage' => 'option',
            'width' => 128,
            'height' => 128,
        ]);
        $basic->addControl($siteIcon);
    }

    /**
     * @return void
     */
    private function registerColor(): void
    {
        $color = $this->addDefaultSection('colors', ['label' => '颜色']);
        $color->addControl($this->newDefaultControl('background_color', [
            'type' => 'color',
            'label' => '背景颜色',
        ]));
        $color->addControl($this->newDefaultControl('header_footer_background_color', [
            'type' => 'color',
            'label' => '页首，页脚背景色',
        ]));
    }

    /**
     * @return void
     */
    private function registerBackgroundImage(): void
    {
        $background = $this->addDefaultSection("background", [
            'label' => '背景图片',
        ]);
        $background->addControl(new ImageControl('background_image', [
            'label' => '背景图片',
        ]));
        $background->addControl($this->newDefaultControl('background_preset', [
            'label' => '背景预设',
            'type' => 'select',
            'depends' => ['background_image'],
            'value' => 'auto',
            'options' => [
                ['value' => 'auto', 'label' => '默认'],
                ['value' => 'cover', 'label' => '填满屏幕'],
                ['value' => 'contain', 'label' => '适合屏幕'],
                ['value' => 'repeat', 'label' => '重复'],
            ],
        ]));
        $background->addControl($this->newDefaultControl('background_position', [
            'label' => '背景位置',
            'type' => 'select',
            'depends' => ['background_image'],
            'value' => 'center',
            'options' => [
                ['value' => 'top', 'label' => '上'],
                ['value' => 'bottom', 'label' => '下'],
                ['value' => 'left', 'label' => '左'],
                ['value' => 'right', 'label' => '右'],
                ['value' => 'center', 'label' => '居中'],
                ['value' => 'left top', 'label' => '左上'],
                ['value' => 'left bottom', 'label' => '左下'],
                ['value' => 'right top', 'label' => '右上'],
                ['value' => 'right bottom', 'label' => '右下'],
            ]
        ]));
    }

    /**
     * @return void
     */
    private function registerCarousel(): void
    {
        $carousel = $this->addDefaultSection("carousel", [
            'title' => '轮播',
        ]);
    }

    /**
     * @param Section $section
     * @return Section
     */
    public function addSection(Section $section): Section
    {
        $this->sections[$section->getId()] = $section;
        return $section;
    }

    /**
     * @param string $id
     * @param array<string, mixed> $args
     * @return Section
     */
    public function addDefaultSection(string $id, array $args = []): Section
    {
        return $this->addSection(new Section($id, $args));
    }

    /**
     * @param string $id
     * @param array $args
     * @return AbstractControl
     */
    public function newDefaultControl(string $id, array $args = []): AbstractControl
    {
        return new Control($id, $args);
    }

    /**
     * @param string $id
     * @return ?Section
     */
    public function getSection(string $id): ?Section
    {
        return $this->sections[$id] ?? null;
    }



    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        $priorities = [];
        foreach ($this->sections as $section) {
            foreach ($section->getControls() as $control) {
                $control->setManager($this);
            }
            $sectionJson = $section->jsonSerialize();
            if (empty($sectionJson['controls'])) {
                continue;
            }
            $priorities[$section->getPriority()][] = $sectionJson;
        }
        krsort($priorities, SORT_NUMERIC);
        return [
            'theme' => [
                'stylesheet' => $this->optionRepository->theme(),
            ],
            'sections' => array_merge(...array_values($priorities))
        ];
    }
}
