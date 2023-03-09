<?php

namespace OctopusPress\Bundle\Controller;

use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Repository\PostRepository;
use OctopusPress\Bundle\Twig\OctopusRuntime;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

/**
 *
 */
class PostController extends Controller
{
    private PostRepository $postRepository;

    public function __construct(Bridger $bridger)
    {
        parent::__construct($bridger);
        $this->postRepository = $bridger->getPostRepository();
    }

    #[Route('/p/{id}', name: 'post_permalink_number', requirements: ['id' => '\d+'], methods: Request::METHOD_GET)]
    #[Route('/{year}/{month}/{name}', name: 'post_permalink_date', requirements: [
        'year' => '\d{4}',
        'month' => '\d{2}',
        'name' => '[a-z0-9\-%_]{8,}'
    ], methods: Request::METHOD_GET)]
    #[Route('/{name}', name: 'post_permalink_name', requirements: [
        'name' => '[a-z0-9\-%_]{8,}'
    ], methods: Request::METHOD_GET, priority: -127)]
    public function show(Request $request): Post
    {
        $attribute = $request->attributes->all();
        $post = null;
        if (!empty($attribute['id'])) {
            $post = $this->postRepository->find((int)$attribute['id']);
        } elseif (!empty($attribute['name'])) {
            $post = $this->postRepository->findOneBy(['name' => $attribute['name']]);
        }
        if ($post == null) {
            throw new NotFoundHttpException();
        }
        if (!empty($attribute['year'])) {
            [$year, $month] = explode('-', $post->getCreatedAt()->format('Y-m'));
            if ($year != $attribute['year'] && $month != $attribute['month']) {
                throw new NotFoundHttpException();
            }
        }
        if ($post->getType() == 'page') {
            $request->attributes->set('_route', 'page');
        }
        $this->postRepository->thumbnails([$post]);
        return $post;
    }
}
