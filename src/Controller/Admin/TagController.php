<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Controller\Admin;

use OctopusPress\Bundle\Entity\TermTaxonomy;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class CategoryController
 * @package App\Controller\Backend
 */
#[Route('/taxonomy', name: 'taxonomy_')]
class TagController extends TaxonomyController
{
    #[Route('/menu1', name: 'tag', options: ['name' => '标签', 'parent' => 'post', 'sort' => 3, 'link' => '/app/taxonomy/tag'])]
    public function menu(): Response
    {
        return new Response();
    }

    #[Route('/tag', name: 'tag_sets', options: ['name' => '标签列表', 'parent' => 'taxonomy_tag'])]
    public function tags(Request $request): JsonResponse
    {
        return parent::sets('tag', $request);
    }

    #[Route('/tag/store', name: 'tag_create', options: ['name' => '创建标签', 'parent' => 'taxonomy_tag'])]
    public function store(Request $request, string $taxonomy = 'tag'): JsonResponse
    {
        return parent::store($request, $taxonomy);
    }

    #[Route('/tag/{id}/update', name: 'tag_update', options: ['name' => '更新标签', 'parent' => 'taxonomy_tag'])]
    public function update(TermTaxonomy $termTaxonomy, Request $request, string $taxonomy = 'tag'): JsonResponse
    {
        return parent::update($taxonomy, $request, $taxonomy);
    }

    #[Route('/tag/delete', name: 'tag_delete', options: ['name' => '删除标签', 'parent' => 'taxonomy_tag'], methods: [Request::METHOD_POST, Request::METHOD_DELETE])]
    public function delete(Request $request, string $taxonomy = 'tag'): JsonResponse
    {
        return parent::delete($request, $taxonomy);
    }
}
