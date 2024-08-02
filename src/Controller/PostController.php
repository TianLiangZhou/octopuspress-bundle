<?php

namespace OctopusPress\Bundle\Controller;

use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\Comment;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Repository\CommentRepository;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Repository\PostRepository;
use OctopusPress\Bundle\Repository\TaxonomyRepository;
use OctopusPress\Bundle\Repository\UserRepository;
use OctopusPress\Bundle\Support\ArchiveDataSet;
use OctopusPress\Bundle\Twig\OctopusRuntime;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Twig\Error\RuntimeError;

/**
 *
 */
class PostController extends Controller
{
    private PostRepository $post;
    private TaxonomyRepository $taxonomy;
    private UserRepository $user;
    private CommentRepository $comment;
    private OptionRepository $option;

    public function __construct(Bridger $bridger)
    {
        parent::__construct($bridger);
        $this->taxonomy = $bridger->getTaxonomyRepository();
        $this->user     = $bridger->getUserRepository();
        $this->post     = $bridger->getPostRepository();
        $this->comment  = $bridger->getCommentRepository();
        $this->option   = $bridger->getOptionRepository();
    }

    /**
     * @throws NonUniqueResultException
     * @throws NoResultException
     * @throws RuntimeError
     */
    #[Route('/tag/{slug}', name: 'tag', requirements: [
        'slug' => '[a-z0-9\-_%]{2,}'
    ])]
    public function tag(string $slug): ArchiveDataSet
    {
        return $this->taxonomy('tag', $slug);
    }

    /**
     * @throws NonUniqueResultException
     * @throws NoResultException
     * @throws RuntimeError
     */
    #[Route('/category/{slug}', name: 'category', requirements: [
        'slug' => '[a-z0-9\-_%]{2,}'
    ])]
    public function category(string $slug): ArchiveDataSet
    {
        return $this->taxonomy('category', $slug);
    }

    /**
     * @param string $slug
     * @param Request $request
     * @return ArchiveDataSet
     * @throws RuntimeError
     */
    #[Route('/author/{slug}', name: 'author', requirements: [
        'slug' => '[a-zA-Z0-9\-%_]{2,}'
    ])]
    public function author(string $slug, Request $request): ArchiveDataSet
    {
        $user = $this->user->findOneBy(['account' => $slug,]);
        if ($user == null) {
            throw new NotFoundHttpException();
        }
        $this->getEM()->getUnitOfWork()->markReadOnly($user);
        return new ArchiveDataSet(
            $user,
            $this->filterPostsResult(['author' => $user->getId()])
        );
    }

    /**
     * @param int $year
     * @param int $month
     * @param Request $request
     * @return ArchiveDataSet
     * @throws RuntimeError
     */
    #[Route('/archives/{year}-{month}', name: 'archives', requirements: ['year' => '[\d+]{4}', 'month' => '[\d+]{2}'])]
    public function archives(int $year, int $month, Request $request): ArchiveDataSet
    {
        return new ArchiveDataSet(
            new \stdClass(),
            $this->filterPostsResult(['date' => $year . '-' . $month])
        );
    }

    #[Route('/p/{id}', name: 'post_permalink_number', requirements: ['id' => '\d+'], methods: Request::METHOD_GET)]
    #[Route('/{year}/{month}/{name}', name: 'post_permalink_date', requirements: [
        'year' => '\d{4}',
        'month' => '\d{2}',
        'name' => '[a-z0-9\-%_]{2,}'
    ], methods: Request::METHOD_GET)]
    #[Route('/{name}', name: 'post_permalink_name', requirements: [
        'name' => '[a-z0-9\-%_]{2,}'
    ], methods: Request::METHOD_GET, priority: -127)]
    public function show(Request $request): Post
    {
        $attribute = $request->attributes->all();
        $post = null;
        if (!empty($attribute['id'])) {
            $post = $this->post->find((int)$attribute['id']);
        } elseif (!empty($attribute['name'])) {
            $post = $this->post->findOneBy(['name' => $attribute['name']]);
        }
        if ($post == null) {
            throw new NotFoundHttpException();
        }
        $this->getEM()->getUnitOfWork()->markReadOnly($post);
        if (!empty($attribute['year'])) {
            [$year, $month] = explode('-', $post->getCreatedAt()->format('Y-m'));
            if ($year != $attribute['year'] && $month != $attribute['month']) {
                throw new NotFoundHttpException();
            }
        }
        if ($post->getType() == 'page') {
            $request->attributes->set('_route', 'page');
        }
        $this->post->thumbnails([$post]);
        $post->setRepository($this->post)
            ->setCommentRepository($this->comment);
        return $post;
    }

    /**
     * 评论与回复
     *
     * @param Request $request
     * @return JsonResponse
     */
    #[Route("/comment", name: 'post_comment', methods: [Request::METHOD_POST])]
    public function comment(Request $request): JsonResponse
    {
        $name = $request->get('name');
        $content = $request->get('content');
        $parent = (int) $request->get('parent');
        if (empty($name) || empty($content)) {
            throw new NotFoundHttpException();
        }
        $parentComment = null;
        if ($parent > 0) {
            $parentComment = $this->comment->find($parent);
            if ($parentComment === null) {
                throw new NotFoundHttpException();
            }
        }
        $post = $this->post->findOneBy(['name' => $name,]);
        if ($post === null) {
            throw new NotFoundHttpException();
        }
        if ($post->getCommentStatus() !== Post::OPEN) {
            return $this->json([
                'message' => '此内容不支持评论',
            ]);
        }
        $authorIp = $request->getClientIp();
        $agent = $request->headers->get('user-agent');
        $user = $this->getUser();
        $comment =  new Comment();
        $comment->setUser($user)
            ->setAuthorIp($authorIp)
            ->setAgent($agent)
            ->setContent($content)
            ->setParent($parentComment)
            ->setPost($post)
            ->setAuthor('')
            ->setAuthorEmail('');
        $moderation = $this->option->commentModeration();
        $comment->setApproved($moderation ? Comment::UNAPPROVED : Comment::APPROVED);
        if ($user == null) {
            $authorEmail = $request->get('authorEmail');
            if (empty($authorEmail)) {
                return $this->json([
                    'message' => '评论的Email不能为空!',
                ]);
            }
            if (filter_var($authorEmail, FILTER_VALIDATE_EMAIL) === false) {
                return $this->json([
                    'message' => '无效的评论邮箱!',
                ]);
            }
            $author  = $request->get('author');
            if (mb_strlen($author) > 128) {
                return $this->json([
                    'message' => '评论昵称太长啦!',
                ]);
            }
            $comment->setAuthorEmail($authorEmail)
                ->setAuthor($author);
        }
        $this->comment->add($comment);
        return $this->json($comment);
    }

    /**
     * @throws NonUniqueResultException
     * @throws NoResultException
     * @throws RuntimeError
     */
    public function taxonomy(string $taxonomy, string $slug): ArchiveDataSet
    {
        $termTaxonomy = $this->bridger->getTaxonomy();
        if (!$termTaxonomy->exists($taxonomy)) {
            throw new NotFoundHttpException();
        }
        $taxonomy = $this->taxonomy->slug($slug, $taxonomy);
        if ($taxonomy == null) {
            throw new NotFoundHttpException();
        }
        $this->getEM()->getUnitOfWork()->markReadOnly($taxonomy);
        return new ArchiveDataSet(
            $taxonomy,
            $this->filterTaxonomyResult($taxonomy)
        );
    }

    /**
     * @param TermTaxonomy $taxonomy
     * @return iterable
     * @throws RuntimeError
     * @throws NonUniqueResultException
     */
    private function filterTaxonomyResult(TermTaxonomy $taxonomy): iterable
    {
        /**
         * @var $runtime OctopusRuntime
         */
        $runtime = $this->bridger->getTwig()->getRuntime(OctopusRuntime::class);
        $postTypes = $this->bridger->getPost()->getTypes();
        $types = [];
        foreach ($postTypes as $name => $type) {
            if (!$type->isShowOnFront()) {
                continue;
            }
            $types[] = $name;
        }
        return $runtime->getTaxonomyPosts($taxonomy->getId(), ['type' => $types]);
    }

    /**
     * @param array $filters
     * @return iterable
     * @throws RuntimeError
     */
    private function filterPostsResult(array $filters): iterable
    {
        /**
         * @var $runtime OctopusRuntime
         */
        $filters['_sort'] = 'id';
        $filters['_order'] = 'DESC';
        $filters['type'] = $this->bridger->getPost()->getShowFrontTypes();
        $runtime = $this->bridger->getTwig()->getRuntime(OctopusRuntime::class);
        return $runtime->getPosts($filters);
    }
}
