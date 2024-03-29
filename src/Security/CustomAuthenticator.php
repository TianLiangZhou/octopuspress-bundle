<?php declare(strict_types=1);

/*
 * This file is part of Packagist.
 *
 * (c) Jordi Boggiano <j.boggiano@seld.be>
 *     Nils Adermann <naderman@naderman.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace OctopusPress\Bundle\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\AuthenticatorInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class CustomAuthenticator extends AbstractAuthenticator
{
    /**
     * @var AuthenticatorInterface[]
     */
    protected array $customAuthenticators;

    public function supports(Request $request): bool
    {
        // continue ONLY if the current ROUTE matches the check ROUTE
        foreach ($this->customAuthenticators as $authenticator) {
            if ($authenticator->supports($request)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @inheritDoc
     */
    public function authenticate(Request $request): Passport
    {
        $passport = new SelfValidatingPassport(new UserBadge(''));
        foreach ($this->customAuthenticators as $authenticator) {
            if ($authenticator->supports($request)) {
                $passport = $authenticator->authenticate($request);
                break;
            }
        }
        $passport->setAttribute('request', $request);
        return $passport;
    }

    public function createToken(Passport $passport, string $firewallName): TokenInterface
    {
        /**
         * @var $request Request
         */
        $request = $passport->getAttribute('request');
        foreach ($this->customAuthenticators as $authenticator) {
            if ($authenticator->supports($request)) {
                return $authenticator->createToken($passport, $firewallName);
            }
        }
        return parent::createToken($passport, $firewallName);
    }

    /**
     * @param Request $request
     * @param TokenInterface $token
     * @param string $firewallName
     * @return Response|null
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        foreach ($this->customAuthenticators as $authenticator) {
            if ($authenticator->supports($request)) {
                return $authenticator->onAuthenticationSuccess($request, $token, $firewallName);
            }
        }
        return null;
    }

    /**
     * @param Request $request
     * @param AuthenticationException $exception
     * @return Response|null
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        foreach ($this->customAuthenticators as $authenticator) {
            if ($authenticator->supports($request)) {
                return $authenticator->onAuthenticationFailure($request, $exception);
            }
        }
        return null;
    }

    /**
     * @param AuthenticatorInterface $customAuthenticator
     * @return CustomAuthenticator
     */
    public function addCustomAuthenticator(AuthenticatorInterface $customAuthenticator): self
    {
        $this->customAuthenticators[] = $customAuthenticator;
        return $this;
    }
}
