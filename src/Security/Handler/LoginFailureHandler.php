<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Security\Handler;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;

class LoginFailureHandler implements AuthenticationFailureHandlerInterface
{
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): Response
    {
        // TODO: Implement onAuthenticationFailure() method.
        return new JsonResponse(['message'=> '邮箱地址或密码无效',], Response::HTTP_NOT_ACCEPTABLE);
    }
}
