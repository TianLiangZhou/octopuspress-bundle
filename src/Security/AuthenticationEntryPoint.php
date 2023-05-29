<?php

namespace OctopusPress\Bundle\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface;

class AuthenticationEntryPoint implements AuthenticationEntryPointInterface
{

    public function start(Request $request, AuthenticationException $authException = null): Response
    {
        // TODO: Implement start() method.
        if ($request->isXmlHttpRequest() || $request->getContentTypeFormat() === 'application/json') {
            return new JsonResponse(['message' => $authException->getMessage(),], Response::HTTP_UNAUTHORIZED);
        }
        return new RedirectResponse('/login');
    }
}
