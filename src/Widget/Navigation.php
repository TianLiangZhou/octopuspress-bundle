<?php

namespace OctopusPress\Bundle\Widget;

use Doctrine\ORM\QueryBuilder;
use OctopusPress\Bundle\Customize\AbstractControl;
use OctopusPress\Bundle\Customize\Control;
use OctopusPress\Bundle\Customize\Section;
use OctopusPress\Bundle\Entity\Post;
use Traversable;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;
use Twig\TemplateWrapper;
use IteratorAggregate;

/**
 *
 */
class Navigation extends AbstractWidget implements IteratorAggregate
{

    /**
     * @throws SyntaxError
     * @throws RuntimeError
     * @throws LoaderError
     */
    protected function template(): TemplateWrapper
    {
        // TODO: Implement template() method.
        return $this->getTwig()->load('@OctopusPressBundle/default/bootstrap.navigation.twig');
    }

    /**
     * @param array $attributes
     * @return array
     */
    protected function context(array $attributes = []): array
    {
        $results = [
            'location'   => $attributes['location'] ?? null,
            'navigation' => [],
            'primary'    => (bool) ($attributes['primary'] ?? false),
            'displayLogo'    => (bool) ($attributes['display_logo'] ?? false),
        ];
        if (empty($attributes['location'])) {
            return $results;
        }
        $option = $this->getBridger()->getOptionRepository();
        $theme = $option->theme();
        $location = $attributes['location'];
        // TODO: Implement context() method.
        $navigationLocation = $option->themeModuleFeature('navigation_location', $theme);
        $locationId = (int) ($navigationLocation[$location] ?? 0);
        if ($locationId < 1) {
            return [];
        }
        $objects = $this->getBridger()
            ->getRelationRepository()
            ->getTaxonomyObjectQuery($locationId)->getArrayResult();
        if (count($objects) < 1) {
            return $results;
        }
        $results['navigation'] = $this->getBridger()->getPostRepository()
            ->createQuery([
            'id' => array_map(function ($item) {
                return $item['object_id'];
            }, $objects),
            'status' => Post::STATUS_PUBLISHED,
            'type' => Post::TYPE_NAVIGATION,
            '_sort' => 'menuOrder',
            '_order'=> '',
        ])->getResult();
        return $results;
    }

    public function delayRegister(): void
    {
        // TODO: Implement registerForm() method.
        $this->setLabel('导航菜单');
        $this->setIcon('menu-2-outline');
        $section = new Section('setting', [
            'label' => '设置'
        ]);
        $locations = $this->getBridger()->getTheme()->getThemeNavigation();
        $options = [];
        foreach ($locations as $key => $label) {
            $options[] = ['label' => $label, 'value' => $key];
        }
        $section->addControl(new Control('location', [
            'label' => '菜单',
            'type'  => AbstractControl::SELECT,
            'options' => $options,
        ]));

        $section->addControl(new Control('primary', [
            'label' => '主菜单',
            'type'  => AbstractControl::SWITCH,
            'default' => false,
        ]));

        $section->addControl(new Control('display_logo', [
            'label' => '显示Logo',
            'type'  => AbstractControl::SWITCH,
            'default' => false,
        ]));
        $this->addSection($section);
        $this->addTemplate('@OctopusPressBundle/default/bootstrap.navigation.twig');
        $this->addTemplate('@OctopusPressBundle/default/tailwind.navigation.twig');
    }

    /**
     * @return Traversable
     */
    public function getIterator(): Traversable
    {
        // TODO: Implement getIterator() method.
        $context = $this->getContext();
        return new \ArrayIterator($context['navigation'] ?? []);
    }
}
