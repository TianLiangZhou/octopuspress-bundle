<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Security\Handler;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\InvalidCsrfTokenException;
use Symfony\Component\Security\Core\Exception\TooManyLoginAttemptsAuthenticationException;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;

class LoginFailureHandler implements AuthenticationFailureHandlerInterface
{
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): Response
    {
        // TODO: Implement onAuthenticationFailure() method.
        $message = '邮箱地址或密码无效.';
        if ($exception instanceof InvalidCsrfTokenException) {
            $message = '请重新刷新页面.';
        } elseif ($exception instanceof TooManyLoginAttemptsAuthenticationException) {
            $message = '请稍后再试...';
        }
        return new JsonResponse(['message'=> $message,], Response::HTTP_NOT_ACCEPTABLE);
    }
}
