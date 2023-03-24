<?php

declare(strict_types=1);

namespace OctopusPress\Bundle\Controller\Admin;


use CKSource\CKFinder\CKFinder;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\CKFinder\AttachmentPlugin;
use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Model\PostManager;
use OctopusPress\Bundle\Util\UserAwareInterface;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/media', name: 'media_')]
class MediaController extends AdminController
{
    private PostManager $manager;

    public function __construct(PostManager $manager, Bridger $bridger)
    {
        parent::__construct($bridger);
        $this->manager = $manager;
    }

    /**
     * @param Request $request
     * @param User $user
     * @return Response
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    #[Route('/ckfinder/connector', name: 'ckfinder', options: ['name' => '文件管理', 'parent' => 'media_library', 'sort' => 1])]
    public function request(Request $request, #[CurrentUser] User $user): Response
    {
        /**
         * @var $ckFinder CKFinder
         */
        $ckFinder = $this->bridger->get('ckfinder.connector');
        $ckFinder->registerPlugin(new AttachmentPlugin($this->manager));
        foreach ($ckFinder->getPlugins() as $plugin) {
            if ($plugin instanceof UserAwareInterface) {
                $plugin->setUser($user);
            }
        }
        return $ckFinder->handle($request);
    }
}
