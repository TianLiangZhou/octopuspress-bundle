<?php

namespace OctopusPress\Bundle\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface;

class AuthenticationEntryPoint implements AuthenticationEntryPointInterface
{

    public function start(Request $request, AuthenticationException $authException = null): JsonResponse
    {
        // TODO: Implement start() method.
        return new JsonResponse(['message' => $authException->getMessage(),], Response::HTTP_UNAUTHORIZED);
    }
}
