<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Security\Handler;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Http\Authorization\AccessDeniedHandlerInterface;

class AccessDeniedHandler implements AccessDeniedHandlerInterface
{

    public function handle(Request $request, AccessDeniedException $accessDeniedException): Response
    {
        // TODO: Implement handle() method.
        return new JsonResponse(['message' => $accessDeniedException->getMessage()], Response::HTTP_FORBIDDEN);
    }
}
