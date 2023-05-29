<?php

namespace OctopusPress\Bundle\EventListener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\CsrfTokenBadge;
use Symfony\Component\Security\Http\Event\CheckPassportEvent;

class AuthenticateListener implements EventSubscriberInterface
{
    private RequestStack $requestStack;

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    /**
     * @param CheckPassportEvent $event
     * @return void
     */
    public function onCheckPassport(CheckPassportEvent $event): void
    {
        $passport = $event->getPassport();
        $request = $this->requestStack->getMainRequest();
        $path = $request->getPathInfo();
        if (!in_array($path, ['/authorize/login', '/authorize/register', '/authorize/forgot', '/authorize/reset'])) {
            return ;
        }
        $credentials = $request->toArray();
        $passport->addBadge(new CsrfTokenBadge('authenticate', $credentials['_token'] ?? ''));
    }


    public static function getSubscribedEvents(): array
    {
        return [
            CheckPassportEvent::class => [['onCheckPassport', 520]]
        ];
    }
}
