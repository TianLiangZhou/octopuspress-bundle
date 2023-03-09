<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Controller\Admin;

use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\Option;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\PostMeta;
use OctopusPress\Bundle\Entity\Term;
use OctopusPress\Bundle\Entity\TermRelationship;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Scalable\Theme;
use OctopusPress\Bundle\Form\Model\NavForm;
use OctopusPress\Bundle\Form\Model\NavNode;
use OctopusPress\Bundle\Form\Type\NavType;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Repository\PostRepository;
use OctopusPress\Bundle\Repository\TaxonomyRepository;
use OctopusPress\Bundle\Repository\TermRepository;
use OctopusPress\Bundle\Util\Formatter;
use OctopusPress\Bundle\Util\Helper;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Query\Expr\Join;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/navigate', name: 'appearance_')]
class NavigationController extends AdminController
{
    private PostRepository $postRepository;
    private TaxonomyRepository $taxonomyRepository;
    private TermRepository $termRepository;
    private Theme $theme;
    private OptionRepository $optionRepository;

    public function __construct(Bridger $bridger) {
        parent::__construct($bridger);
        $this->postRepository = $bridger->getPostRepository();
        $this->taxonomyRepository = $bridger->getTaxonomyRepository();
        $this->termRepository = $bridger->getTermRepository();
        $this->optionRepository = $bridger->getOptionRepository();
        $this->theme = $bridger->getTheme();
    }


    #[Route('/menu1', name: 'navigation', options: ['name' => '导航', 'parent' => 'appearance', 'sort' => 2, 'link' => '/app/decoration/navigation'])]
    public function menu(): Response
    {
        return new Response();
    }

    #[Route('/structure', name: 'navigation_structure')]
    public function structure(): JsonResponse
    {
        $limit = 20;
        $stdClass = new \stdClass();
        $stdClass->articles = $this->postRepository->findBy([
            'type' => Post::TYPE_POST,
        ], ['id' => 'DESC'], $limit);
        $stdClass->pages = $this->postRepository->findBy([
            'type' => Post::TYPE_PAGE,
        ], ['id' => 'DESC'], $limit);
        $stdClass->categories = $this->taxonomyRepository->handleRecords(
            $this->taxonomyRepository->findBy([
                'taxonomy' => TermTaxonomy::CATEGORY,
            ], ['id' => 'DESC'], $limit)
        );
        $stdClass->tags = $this->taxonomyRepository->handleRecords(
            $this->taxonomyRepository->findBy([
                'taxonomy' => TermTaxonomy::TAG,
            ], ['id' => 'DESC'], $limit)
        );
        $stdClass->navigate = $this->taxonomyRepository->handleRecords(
            $this->taxonomyRepository->findBy([
                'taxonomy' => TermTaxonomy::NAV_MENU,
            ])
        );
        $stdClass->themeNavigation = [];
        $stdClass->themeNavigationLocation = [];
        foreach ($this->theme->getThemeNavigation() as $alias => $name) {
            $stdClass->themeNavigation[] = ['alias' => $alias, 'name' => $name];
            $stdClass->themeNavigationLocation[$alias] = 0;
        }
        $theme = $this->optionRepository->theme();
        $themeModules = $this->optionRepository->value('theme_mods_' . $theme);
        if ($themeModules != null && is_array($themeModules)) {
            $stdClass->themeNavigationLocation = array_merge(
                $stdClass->themeNavigationLocation,
                $themeModules['navigation_location'] ?? []
            );
        }
        $stdClass->themeNavigationLocation = (object) $stdClass->themeNavigationLocation;
        return $this->json($stdClass);
    }


    #[Route('/{id}', name: 'navigation_nav', requirements: ['id' => '\d+'], options: ['name' => '导航结构数据', 'parent' => 'appearance_navigation', 'sort' => 2])]
    public function navigate(TermTaxonomy $taxonomy): JsonResponse
    {
        $queryBuilder = $this->postRepository->createQueryBuilder('p');
        /**
         * @var $result array<int, Post>
         */
        $result = $queryBuilder->leftJoin(
            TermRelationship::class,
            't',
            Join::WITH,
            'p.id = t.post'
        )
            ->where('p.type = :type')
            ->andWhere('t.taxonomy = :taxonomy')
            ->setParameter('type', Post::TYPE_NAVIGATION)
            ->setParameter('taxonomy', $taxonomy->getId())
            ->orderBy('p.menuOrder', 'ASC')
            ->getQuery()
            ->getResult();

        $nodes = $children = [];
        foreach ($result as $key => $nav) {
            $parent = $nav->getParent();
            $nodes[$key] = [
                'id' => $nav->getId(),
                'nodeId' => 'node-' . $nav->getId(),
                'title' => $nav->getTitle(),
                'type' => $nav->getMeta('_menu_item_object')->getMetaValue(),
                'parent' => $parent?->getId(),
                'objectId' => (int) $nav->getMeta('_menu_item_object_id')->getMetaValue(),
                'url' => $nav->getMeta('_menu_item_url')->getMetaValue(),
                'children' => [],
            ];
            if ($parent) {
                $children[$parent->getId()][] = $key;
            }
        }
        if (count($children) > 0) {
            Helper::treeNode($nodes, $children);
            foreach ($children as $values) {
                foreach ($values as $index) {
                    unset($nodes[$index]);
                }
            }
        }
        $stdClass = new \stdClass();
        $stdClass->id = $taxonomy->getId();
        $stdClass->name = $taxonomy->getTerm()->getName();
        $stdClass->nodes = array_values($nodes);
        return $this->json([
            'navigation' => $stdClass,
        ]);
    }

    /**
     * @throws \Doctrine\ORM\OptimisticLockException
     * @throws \Doctrine\ORM\ORMException
     */
    #[Route('/save/location', name: 'navigation_save_location', options: ['name' => '保存导航位置', 'parent' => 'appearance_navigation', 'sort' => 2], methods: Request::METHOD_POST)]
    public function location(Request $request): JsonResponse
    {
        $this->updateThemeLocation($request->toArray()['location'] ?? []);
        return $this->json([
        ]);
    }




    /**
     * @throws \Doctrine\ORM\OptimisticLockException
     * @throws \Doctrine\ORM\ORMException
     */
    #[Route('/save', name: 'navigation_save', options: ['name' => '保存导航', 'parent' => 'appearance_navigation', 'sort' => 2], methods: Request::METHOD_POST)]
    public function save(Request $request, #[CurrentUser] $user): JsonResponse
    {
        $model = new NavForm();
        $data = $request->toArray();
        if ($response = $this->validResponse(NavType::class, $model, $data)) {
            return $response;
        }
        $id = $model->getId();
        if (empty($id)) {
            $taxonomy = new TermTaxonomy();
            $taxonomy->setTaxonomy(TermTaxonomy::NAV_MENU);
            $term = $this->termRepository->findBy([
                'name' => $model->getName(),
                'slug' => Formatter::sanitizeWithDashes($model->getName()),
            ]);
            if ($term == null) {
                $term = new Term();
            }
        } else {
            $taxonomy = $this->taxonomyRepository->find($id);
            if ($taxonomy == null) {
                return $this->json(['message' => ''], Response::HTTP_NOT_ACCEPTABLE);
            }
            $term = $taxonomy->getTerm();
        }
        if ($term->getName() != $model->getName()) {
            $term->setName($model->getName())
                ->setSlug(Formatter::sanitizeWithDashes($model->getName()));
            $taxonomy->setTerm($term);
        }
        $this->getEM()->persist($taxonomy);
        /**
         * @var $arrayCollection Collection<int, Post>
         */
        $arrayCollection = new ArrayCollection();
        foreach ($taxonomy->getRelationships() as $relationship) {
            $arrayCollection->add($relationship->getPost());
        }
        $nodes = $model->getNodes();
        $confirmed = [];
        if (count($nodes) > 0) {
            $this->persistNode($nodes, $taxonomy, null, $user, $confirmed);
        }
        foreach ($arrayCollection as $item) {
            if (!in_array($item->getId(), $confirmed)) {
                $this->getEM()->remove($item);
            }
        }
        $this->getEM()->flush();
        if (!empty($data['themeNavigationLocation'])) {
            $location = [];
            foreach ($data['themeNavigationLocation'] as $name => $checked) {
                if ($checked === false) {
                    continue;
                }
                $location[$name] = $taxonomy->getId();
            }
            $this->updateThemeLocation($location);
        }
        return $this->json([
        ]);
    }

    /**
     * @throws \Doctrine\ORM\OptimisticLockException
     * @throws \Doctrine\ORM\Exception\ORMException
     */
    #[Route('/{id}/delete', name: 'navigation_delete', options: ['name' => '删除导航', 'parent' => 'appearance_navigation', 'sort' => 2], methods: Request::METHOD_POST)]
    public function delete(TermTaxonomy $taxonomy): JsonResponse
    {
        foreach ($taxonomy->getRelationships() as $relationship) {
            $post = $relationship->getPost();
            $this->getEM()->remove($post);
        }
        $this->getEM()->remove($taxonomy);
        $this->getEM()->flush();
        return $this->json([
        ]);
    }

    /**
     * @param array<int, NavNode> $nodes
     * @param TermTaxonomy $taxonomy
     * @param Post|null $parent
     * @param User|null $user
     * @param array $confirmed
     * @return void
     * @throws ORMException
     * @throws \Doctrine\ORM\ORMException
     * @throws OptimisticLockException
     */
    private function persistNode(array $nodes, TermTaxonomy $taxonomy, Post $parent = null, User $user = null, array &$confirmed = []): void
    {
        foreach ($nodes as $key => $node) {
            $nav = new Post();
            if (($id = $node->getId())) {
                $nav = $this->postRepository->find($id);
                if ($nav == null) {
                    continue;
                }
                $confirmed[] = $id;
            }
            $nav->setTitle($node->getTitle())
                ->setName(Formatter::sanitizeWithDashes($node->getTitle()))
                ->setParent($parent)
                ->setType(Post::TYPE_NAVIGATION)
                ->setMenuOrder($key + 1)
                ->setAuthor($user)
                ->setContent('');
            $metas = [
                '_menu_item_type' => in_array($node->getType(), TermTaxonomy::TAXONOMY)
                    ? 'taxonomy'
                    : (in_array($node->getType(), Post::TYPE) ? 'post_type' : $node->getType()),
                '_menu_item_object_id' => $node->getObjectId() ?? 0,
                '_menu_item_object' => $node->getType(),
                '_menu_item_url' => $node->getUrl() ?? '',
            ];
            if ($nav->getMetas()->count() > 0) {
                foreach ($nav->getMetas() as $meta) {
                    if (!isset($metas[$meta->getMetaKey()])) {
                        continue;
                    }
                    $meta->setMetaValue($metas[$meta->getMetaKey()]);
                }
            } else {
                foreach ($metas as $metaKey => $metaValue) {
                    $meta = new PostMeta();
                    $meta->setMetaKey($metaKey)->setMetaValue($metaValue);
                    $nav->addMeta($meta);
                }
            }
            $relationship = false;
            foreach ($nav->getTermRelationships() as $relationship) {
                if ($relationship->getTaxonomy()->getId() == $taxonomy->getId()) {
                    $relationship = true;
                    break;
                }
            }
            if (!$relationship) {
                $termRelationship = new TermRelationship();
                $termRelationship->setTaxonomy($taxonomy);
                $nav->addTermRelationship($termRelationship);
            }
            $this->getEM()->persist($nav);
            if (($children = $node->getChildren())) {
                $this->getEM()->flush($nav);
                $this->persistNode($children, $taxonomy, $nav, $user, $confirmed);
            }
        }
    }

    /**
     * @param array $location
     * @return void
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    private function updateThemeLocation(array $location): void
    {
        $theme = $this->optionRepository->theme();
        $meta = $this->optionRepository->findOneByName('theme_mods_' . $theme);
        $themeModules = $this->optionRepository->themeModules($theme);
        if ($meta != null) {
            $themeModules['navigation_location'] = array_merge(
                $themeModules['navigation_location'] ?? [],
                $location
            );
        } else {
            $meta = new Option();
            $meta->setName('theme_mods_' . $theme);
            $themeModules['navigation_location'] = $location;
        }
        $meta->setValue($themeModules);
        $this->optionRepository->add($meta);
    }
}
