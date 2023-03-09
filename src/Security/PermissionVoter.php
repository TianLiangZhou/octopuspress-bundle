<?php

namespace OctopusPress\Bundle\Security;

use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Repository\OptionRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class PermissionVoter extends Voter
{
    private RouterInterface $router;
    private OptionRepository $optionRepository;

    public function __construct(
        RouterInterface $router,
        OptionRepository $optionRepository,
    ) {
        $this->router = $router;
        $this->optionRepository = $optionRepository;
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        // TODO: Implement supports() method.
        if ($subject instanceof Request) {
            return true;
        }
        return false;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        if (!$subject instanceof Request) {
            return false;
        }
        $name = $subject->attributes->get("_route");
        if (empty($name)) {
            return false;
        }
        if (($user = $token->getUser()) == null || !$user instanceof User) {
            return false;
        }
        $route = $this->router->getRouteCollection()->get($name);
        if ($route == null) {
            return false;
        }
        if (empty($route->getOption('name'))) {
            return true;
        }
        $roles = ($roleNames = $token->getRoleNames())
            ? array_map(function ($role) {
                return (int) str_replace('ROLE_', '', $role);
            }, $roleNames)
            : [];
        $roleCapabilities = $this->optionRepository->value('roles');
        $capabilities = [];
        foreach ($roles as $roleIndex) {
            if (!isset($roleCapabilities[$roleIndex - 1])) {
                continue;
            }
            $capabilities = array_merge($capabilities, $roleCapabilities[$roleIndex - 1]['capabilities']);
        }
        return isset($capabilities[$route->getPath()]);
    }
}
