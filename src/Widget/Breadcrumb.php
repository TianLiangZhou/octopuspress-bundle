<?php

namespace OctopusPress\Bundle\Widget;

use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Support\ArchiveDataSet;
use Traversable;

class Breadcrumb extends AbstractWidget implements \IteratorAggregate
{

    /**
     * @return Traversable
     */
    public function getIterator(): Traversable
    {
        // TODO: Implement getIterator() method.
        return new \ArrayIterator($this->getContext()['crumbs'] ?? []);
    }

    protected function template(): string
    {
        // TODO: Implement template() method.
        return  '';
    }

    protected function context(array $attributes = []): array
    {
        // TODO: Implement context() method.
        $controllerResult = $this->getBridger()->getControllerResult();
        if ($controllerResult == null) {
            $controllerResult = $attributes['entity'] ?? null;
        }
        $crumbs = [];
        if ($controllerResult) {
            $showedParent = (bool)($attributes['show_parent'] ?? true);
            if ($controllerResult instanceof Post) {
                $crumbs = [$controllerResult];
                $parent = null;
                if ($showedParent) {
                    if ($parent = $controllerResult->getParent()) {
                        array_unshift($crumbs, $parent);
                    }
                }
                $categories = $parent ? $parent->getCategories() : $controllerResult->getCategories();
                foreach ($categories as $category) {
                    array_unshift($crumbs, $category);
                    $parent = $category->getParent();
                    while ($parent != null) {
                        array_unshift($crumbs, $parent);
                        $parent = $parent->getParent();
                    }
                    break;
                }
            } elseif ($controllerResult instanceof ArchiveDataSet) {
                $taxonomy = $controllerResult->getArchiveTaxonomy();
                if ($taxonomy instanceof TermTaxonomy) {
                    $crumbs[] = $taxonomy;
                    $this->taxonomyCrumbs($taxonomy, $crumbs);
                } elseif ($taxonomy instanceof User) {
                    $crumbs[] = (object)['title' => $taxonomy->getNickname()];
                } else {
                    $crumbs[] = $taxonomy;
                }
            } elseif ($controllerResult instanceof TermTaxonomy) {
                $crumbs[] = $controllerResult;
                $this->taxonomyCrumbs($controllerResult, $crumbs);
            }
        }
        $crumbs = $this->getBridger()
            ->getHook()
            ->filter('breadcrumb', $crumbs);
        return [
            'crumbs' => $crumbs,
        ];
    }

    /**
     * @param TermTaxonomy $taxonomy
     * @param array $crumbs
     * @return void
     */
    private function taxonomyCrumbs(TermTaxonomy $taxonomy, array &$crumbs): void
    {
        $parent = $taxonomy->getParent();
        while ($parent != null) {
            array_unshift($crumbs, $parent);
            $parent = $parent->getParent();
        }
    }

    public function delayRegister(): void
    {
        // TODO: Implement registerForm() method.
        $this->setLabel("面包屑");
        $this->setIcon('arrowhead-right-outline');
    }
}
