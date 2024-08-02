<?php

namespace OctopusPress\Bundle\Controller;

use OctopusPress\Bundle\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authorization\Voter\AuthenticatedVoter;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 *
 */
class UserController extends Controller
{

    /**
     * @param User $user
     * @return User
     */
    #[Route("/user/profile", name: "user_profile", methods: ["GET"])]
    #[IsGranted(AuthenticatedVoter::IS_AUTHENTICATED)]
    public function profile(#[CurrentUser] User $user): User
    {
        return $user;
    }

    #[Route("/user/setting", name: "user_setting", methods: ['POST'])]
    #[IsGranted(AuthenticatedVoter::IS_AUTHENTICATED)]
    public function setting(Request $request, #[CurrentUser] User $user): Response
    {
        $action = $request->get('action');
        if ($action === 'basic') {
            $response = $this->basic($request, $user);
        } else if ($action === 'change_password') {
            $response = $this->changePassword($request, $user);
        } else {
            $hook = $this->bridger->getHook();
            $response = $hook->filter('user_setting_' . $action, $request, $user);
        }
        if (!$response instanceof Response) {
            return $this->redirect('/user/profile');
        }
        return $response;
    }

    /**
     * @param Request $request
     * @param User $user
     * @return Response
     */
    private function changePassword(Request $request, User $user): Response
    {
        return $this->redirect('/user/profile');
    }

    /**
     * @param Request $request
     * @param User $user
     * @return Response
     */
    private function basic(Request $request, User $user): Response
    {
        return $this->redirect('/user/profile');
    }

}
