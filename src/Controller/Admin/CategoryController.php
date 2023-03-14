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
class CategoryController extends TaxonomyController
{
    #[Route('/menu', name: 'category', options: ['name' => '分类目录', 'parent' => 'post', 'sort' => 3, 'link' => '/app/taxonomy/category'])]
    public function menu(): Response
    {
        return new Response();
    }

    #[Route('/category', name:'category_sets', options: ['name' => '分类列表', 'parent' => 'taxonomy_category'])]
    public function categories(Request $request): JsonResponse
    {
        $request->query->remove('page');
        $request->query->remove('size');
        return parent::sets('category', $request);
    }


    #[Route('/category/store', name: 'category_create', options: ['name' => '创建分类', 'parent' => 'taxonomy_category'])]
    public function store(Request $request): JsonResponse
    {
        return $this->create('category', $request);
    }

    #[Route('/category/{id}/update', name: 'category_update', options: ['name' => '更新分类', 'parent' => 'taxonomy_category'])]
    public function update(TermTaxonomy $termTaxonomy, Request $request): JsonResponse
    {
        return $this->edit('category', $termTaxonomy, $request);
    }

    #[Route('/category/delete', name: 'category_delete', options: ['name' => '删除分类', 'parent' => 'taxonomy_category'], methods: [Request::METHOD_POST, Request::METHOD_DELETE])]
    public function delete(Request $request): JsonResponse
    {
        return $this->remove('category', $request);
    }
}
