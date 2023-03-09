<?php
namespace OctopusPress\Bundle\EventListener;


use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Event\LogoutEvent;

/**
 *
 */
class LogoutListener implements EventSubscriberInterface
{
    /**
     * @param LogoutEvent $event
     * @return void
     */
    public function onLogout(LogoutEvent $event)
    {
        $request = $event->getRequest();
        if (str_starts_with($request->getPathInfo(), '/backend')) {
            $event->setResponse(new JsonResponse([
                'status' => 'ok',
            ]));
        }
    }

    /**
     * @return array[]
     */
    public static function getSubscribedEvents(): array
    {
        // TODO: Implement getSubscribedEvents() method.
        return [
            LogoutEvent::class => ['onLogout', 63],
        ];
    }
}
