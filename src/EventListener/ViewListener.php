<?php

namespace OctopusPress\Bundle\EventListener;

use OctopusPress\Bundle\Model\ViewManager;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

/**
 *
 */
class ViewListener implements EventSubscriberInterface
{
    private ViewManager $viewManager;

    /**
     * @param ViewManager $viewManager
     */
    public function __construct(ViewManager $viewManager)
    {
        $this->viewManager = $viewManager;
    }

    /**
     * @param ControllerEvent $controllerEvent
     * @return void
     */
    public function onControllerRequest(ControllerEvent $controllerEvent): void
    {
        if ($controllerEvent->isMainRequest()) {
            $this->viewManager->boot();
        }
    }

    /**
     * Backend route not execute
     *
     * @param ViewEvent $event
     * @return void
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function onKernelView(ViewEvent $event): void
    {
        $event->getRequest()->attributes->set('_controller_result', $event->getControllerResult());
        $event->setResponse($this->viewManager->render());
    }

    /**
     * @param ExceptionEvent $event
     * @return void
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function onKernelException(ExceptionEvent $event): void
    {
        if (str_starts_with($event->getRequest()->getPathInfo(), '/backend')) {
            $event->setResponse(new JsonResponse([
                'message' => $event->getThrowable()->getMessage(),
                'trace' => $event->getThrowable()->getTraceAsString(),
            ], $event->getThrowable() instanceof NotFoundHttpException
                ? Response::HTTP_NOT_FOUND
                : Response::HTTP_INTERNAL_SERVER_ERROR));
            $event->stopPropagation();
            return;
        }
        if (!$event->getThrowable() instanceof NotFoundHttpException) {
            return;
        }
        $event->getRequest()->attributes->set('_route', 'error404');
        $this->viewManager->boot();
        if (!$this->viewManager->notFoundExist()) {
            return;
        }
        $event->setResponse($this->viewManager->notFound());
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public static function getSubscribedEvents(): array
    {
        // TODO: Implement getSubscribedEvents() method.
        return [
            KernelEvents::CONTROLLER => [['onControllerRequest', 32]],
            KernelEvents::VIEW => [['onKernelView', 32]],
            KernelEvents::EXCEPTION => [['onKernelException', -63]],
        ];
    }
}
