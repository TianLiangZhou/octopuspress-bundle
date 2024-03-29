<?php
declare(strict_types=1);
namespace OctopusPress\Bundle\Controller;

use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Entity\UserMeta;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Repository\UserRepository;
use OctopusPress\Bundle\Util\Formatter;
use OctopusPress\Bundle\Util\UserAgent;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\String\ByteString;

/**
 * Class AuthorizeController
 * @package App\Controller
 */
class AuthorizeController extends Controller
{
    private OptionRepository $option;
    private UserRepository $user;
    private UserPasswordHasherInterface $passwordHasher;
    private Security $security;

    public function __construct(Bridger $bridger, UserPasswordHasherInterface $passwordHasher, Security $security)
    {
        parent::__construct($bridger);
        $this->option = $bridger->getOptionRepository();
        $this->user = $bridger->getUserRepository();
        $this->passwordHasher = $passwordHasher;
        $this->security = $security;
    }


    /**
     * @return void
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    #[Route('/login', name: 'sign_in', methods: 'GET')]
    #[Route('/signup', name: 'sign_up', methods: 'GET')]
    #[Route('/forgot-pass', name: 'forgot', methods: 'GET')]
    #[Route('/reset-pass', name: 'reset', methods: 'GET')]
    public function main(): ?Response
    {
        if ($this->security->getUser()) {
            return $this->redirect('/');
        }
        $csrf = false;
        if ($this->container->has('security.csrf.token_manager')) {
            $csrf = true;
        }
        $this->container->get('twig')->addGlobal('csrf', $csrf);
        return null;
    }

    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/authorize/register', name: 'authorize_register', methods: Request::METHOD_POST)]
    public function register(Request $request): Response
    {
        return $this->json([
        ]);
    }

    /**
     * @param User|null $user
     * @return Response
     */
    #[Route('/authorize/login', name: 'authorize_login', methods: Request::METHOD_POST)]
    public function authenticate(#[CurrentUser] ?User $user): Response
    {
        if (null === $user) {
            return $this->json(['message' => '无效的用户名或密码',], Response::HTTP_UNAUTHORIZED);
        }
        $header = base64_encode('{"typ":"JWT","alg": "SHA256"}');
        $payload= base64_encode(sprintf(
            '{"iat":%d,"exp":%d,"email":"%s", "id": %d,"avatar": "%s"}',
            time(),
            time() + 86400 * 30,
            $user->getEmail(),
            $user->getId(),
            $user->getAvatar()
        ));
        $secret = hash_hmac("sha256", $header . '.' . $payload, $_SERVER['APP_SECRET']);
        $token = sprintf("%s.%s.%s", $header, $payload, $secret);
        return $this->json([
            'token' => $token
        ]);
    }

    /**
     * @param Request $request
     * @param MailerInterface $mailer
     * @return Response
     */
    #[Route('/authorize/forgot', name: 'authorize_forgot', methods: Request::METHOD_POST)]
    public function forgot(Request $request, MailerInterface $mailer): Response
    {
        ['email' => $toEmail, 'dashboard' => $isDashboard] = $request->toArray();
        if (empty($toEmail) || filter_var($toEmail, FILTER_VALIDATE_EMAIL) === false) {
            return $this->json(['message' => 'Invalid parameter',], Response::HTTP_NOT_ACCEPTABLE);
        }
        $user = $this->user->findOneBy(['email' => $toEmail]);
        if ($user == null) {
            return $this->json(['message' => 'Email resource not found',], Response::HTTP_NOT_FOUND);
        }
        $adminEmail = $this->option->adminEmail();
        if (empty($adminEmail)) {
            return $this->json(['message' => 'Admin email address not configured',], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        $token = ByteString::fromRandom(32)->toString();
        $title = $this->option->title();
        $url = $this->option->siteUrl();
        $host = $request->getHost();
        if (!empty($_SERVER['DASHBOARD_URL']) && parse_url($_SERVER['DASHBOARD_URL'], PHP_URL_HOST) == $host) {
            $url = rtrim($_SERVER['DASHBOARD_URL'], '/') . '/#/auth';
        } else {
            $url = $url . '/dashboard/#/auth';
        }
        $url .= '/reset-password/' . sprintf("%s-%s", $token, Formatter::base64UrlEncode($toEmail));
        $userAgent = $request->headers->get('User-Agent');
        $ua = UserAgent::builder($userAgent);
        $options = [
            'title' => $title,
            'link'  => $url,
            'browser' => $ua->browser(),
            'os' => $ua->os()
        ];
        try {
            $email = (new Email())
                ->from(new Address($adminEmail, $title))
                ->to($toEmail)
                ->priority(Email::PRIORITY_HIGH)
                ->subject('忘记密码了吗？')
                ->html(
                    $this->renderView(
                        '@OctopusPressBundle/email-forgot.html.twig',
                        $options,
                    )
                );
            $mailer->send($email);
            $metaToken = $user->getMeta('reset_token');
            if ($metaToken == null) {
                $metaToken = new UserMeta();
                $metaToken->setMetaKey('reset_token');
            }
            $metaToken->setMetaValue($token);
            $user->addMeta($metaToken);
            $metaTokenTime = $user->getMeta('reset_token_time');
            if ($metaTokenTime == null) {
                $metaTokenTime = new UserMeta();
                $metaTokenTime->setMetaKey('reset_token_time');
            }
            $metaTokenTime->setMetaValue(time());
            $user->addMeta($metaTokenTime);
            $this->user->add($user);
        } catch (\Throwable $throwable) {
            return $this->json(['message' => $throwable->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        return $this->json([]);
    }

    /**
     * @param Request $request
     * @return Response
     * @throws ORMException
     * @throws \Doctrine\ORM\ORMException
     * @throws OptimisticLockException
     */
    #[Route('/authorize/reset', name: 'authorize_reset_password', methods: Request::METHOD_POST)]
    public function reset(Request $request): Response
    {
        $formData = $request->toArray();
        if (empty($formData['token']) || empty($formData['password']) || empty($formData['confirmPassword'])) {
            return $this->json(['message' => 'Invalid parameter'], Response::HTTP_NOT_ACCEPTABLE);
        }

        if ($formData['password'] !== $formData['confirmPassword']) {
            return $this->json(['message' => 'Invalid parameter'], Response::HTTP_NOT_ACCEPTABLE);
        }
        $parseToken = explode('-', $formData['token']);
        $token = array_shift($parseToken);
        $email = Formatter::base64UrlDecode(implode('-', $parseToken));
        if (empty($email) || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            return $this->json(['message' => 'Token parse failed'], Response::HTTP_NOT_ACCEPTABLE);
        }
        $user = $this->user->findOneBy(['email' => $email]);
        if ($user == null) {
            return $this->json(['message' => 'User does not exist'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        $metaToken = $user->getMeta('reset_token');
        if ($metaToken == null || $metaToken->getMetaValue() != $token) {
            return $this->json(['message' => 'Token verification failed'], Response::HTTP_SERVICE_UNAVAILABLE);
        }
        $metaTokenTime = $user->getMeta('reset_token_time');
        $time = time();
        if ($metaTokenTime == null) {
            return $this->json(['message' => 'Token verification failed'], Response::HTTP_SERVICE_UNAVAILABLE);
        }
        $goneTime = (int) $metaTokenTime->getMetaValue();
        $user->getMetas()->removeElement($metaToken);
        $user->getMetas()->removeElement($metaTokenTime);
        $this->getEM()->remove($metaToken);
        $this->getEM()->remove($metaTokenTime);
        if (($time - $goneTime) > 86400) {
            $this->user->add($user);
            return $this->json(['message' => 'Token has expired'], Response::HTTP_SERVICE_UNAVAILABLE);
        }
        $user->setPasswordHasher($this->passwordHasher);
        $user->setPassword($formData['password']);
        $this->user->add($user);
        return $this->json([]);
    }

    /**
     * @param array $options
     * @return string
     */
    private function getForgotEmailTemplate(array $options): string
    {
        $templateDir = $this->getParameter('twig.default_path');
        extract($options);
        ob_start();
        include $templateDir . DIRECTORY_SEPARATOR .  'forgot.email.html.php';
        return ob_get_clean();
    }


    /**
     * @return Response
     */
    #[Route('/authorize/logout', name: 'authorize_logout', methods: [Request::METHOD_POST, Request::METHOD_GET])]
    public function logout(): Response
    {
        return $this->json([]);
    }
}
