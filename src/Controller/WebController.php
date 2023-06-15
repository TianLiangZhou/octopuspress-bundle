<?php

namespace OctopusPress\Bundle\Controller;

use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Form\Model\InstallRequest;
use OctopusPress\Bundle\Form\Type\InstallType;
use OctopusPress\Bundle\OctopusPressKernel;
use OctopusPress\Bundle\Model\MasterManager;
use OctopusPress\Bundle\Model\MenuManager;
use OctopusPress\Bundle\Model\ThemeManager;
use OctopusPress\Bundle\Repository\PostRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

/**
 *
 */
class WebController extends Controller
{
    private PostRepository $postRepository;
    private MasterManager $masterManager;
    private ThemeManager $themeManager;

    public function __construct(Bridger $bridger, MasterManager $masterManager, ThemeManager $themeManager)
    {
        parent::__construct($bridger);
        $this->postRepository = $bridger->getPostRepository();
        $this->masterManager = $masterManager;
        $this->themeManager = $themeManager;
    }

    #[Route('/', name: 'home')]
    public function index(Request $request): ?Post
    {
        if ($request->query->has('p') && ($p = $request->query->getInt('p')) > 0) {
            $article = $this->postRepository->find($p);
            if ($article == null) {
                throw new NotFoundHttpException();
            }
            if ($article->getType() == 'page') {
                $request->attributes->set('_route', 'page');
            }
            return $article;
        }
        return null;
    }

    /**
     * @param Request $request
     * @return Response|null
     */
    #[Route('/search', name: 'search', methods: [Request::METHOD_GET])]
    public function search(Request $request): ?Response
    {
        $q = $request->query->get('q', '');
        $redirect = $this->bridger->getOptionRepository()->searchEngine();
        $siteUrl = $this->bridger->getOptionRepository()->siteUrl();
        $query = urlencode(sprintf('site:%s/ %s', str_replace(['https://', 'http://'], '', $siteUrl), $q));
        return match ($redirect) {
            'baidu' => $this->redirect('https://www.bing.com/search?q='. $query),
            'bing' => $this->redirect('https://www.baidu.com/s?wd='. $query),
            'google' => $this->redirect('https://www.google.com/search?q='. $query),
            default => $this->internalSearch($q),
        };
    }

    #[Route('/install', name: 'install', methods: [Request::METHOD_GET, Request::METHOD_POST])]
    public function install(Request $request): Response
    {
        $model = new InstallRequest();
        $options = [];
        $vars = ['csrf' => false];
        if ($this->container->has('security.csrf.token_manager')) {
            $options = [
                'csrf_token_id'   => 'install',
                'csrf_field_name' => '_token',
                'csrf_protection' => true,
            ];
            $vars['csrf'] = true;
        }
        $form = $this->createForm(InstallType::class, $model, $options)->handleRequest($request);
        if ($form->isSubmitted()) {
            if ($form->isValid()) {
                try {
                    $this->masterManager->setup($model, $request);
                    if (!empty(($theme = $model->getTheme()))) {
                        $this->themeManager->activate($theme);
                    }
                    return $this->redirect('/');
                } catch (\Exception $exception) {
                    $vars['error'] = $exception->getMessage();
                }
            } else {
                $messages = [];
                foreach ($form->getErrors(true) as $error) {
                    $messages[] = $error->getMessage();
                }
                $vars['error'] = implode(';', $messages);
            }
        }
        return $this->render('@OctopusPressBundle/install.html.twig', $vars);
    }

    /**
     * @param string $query
     * @return null
     */
    private function internalSearch(string $query)
    {


        return null;
    }
}
