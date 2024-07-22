<?php

namespace OctopusPress\Bundle\Entity;

use DateTime;
use DateTimeInterface;
use OctopusPress\Bundle\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Selectable;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\Table;
use JsonSerializable;
use Serializable;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints\Callback;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Url;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

/**
 * Users
 */
#[Table(name: "users", )]
#[Entity(repositoryClass: UserRepository::class)]
#[Index(columns: ['account'], name: 'user_login_key')]
#[Index(columns: ['email'], name: 'user_email')]
#[Index(columns: ['nickname'], name: 'nickname')]
#[Callback('isEmailUnique', groups: ['Create', 'Update'])]
#[Callback('isAccountUnique', groups: ['Create'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface, JsonSerializable, Serializable
{
    /**
     * @var int|null
     */
    #[Column(name: "id", type: "integer", nullable: false, options: ['unsigned' => true])]
    #[Id]
    #[GeneratedValue(strategy: "IDENTITY")]
    private ?int $id = null;

    /**
     * @var string
     */
    #[Column(name: "account", type: "string", length: 60, nullable: false)]
    private string $account = '';

    /**
     * @var string
     */
    #[Column(name: "email", type: "string", length: 100, nullable: false)]
    #[NotBlank]
    #[Email]
    private string $email = '';

    /**
     * @var string
     */
    #[Column(name: "nickname", type: "string", length: 50, nullable: false)]
    #[NotBlank]
    private string $nickname = '';

    /**
     * @var string
     */
    #[Column(name: "password", type: "string", length: 255, nullable: false)]
    private string $password = '';

    /**
     * @var string
     */
    #[Column(name: "avatar", type: "string", length: 255, nullable: false, options: ['default' => ''])]
    private string $avatar = '';

    /**
     * @var DateTimeInterface
     */
    #[Column(name: "registered_at", type: "datetime", nullable: false, options: ['default' => '1970-01-01 00:00:00'])]
    private DateTimeInterface $registeredAt;

    /**
     * @var string
     */
    #[Column(name: "activation_key", type: "string", length: 255, nullable: false, options: ['default' => ''])]
    private ?string $activationKey = '';

    /**
     * @var string
     */
    #[Column(name: "url", type: "string", length: 100, nullable: false, options: ['default' => ''])]
    #[Url]
    private ?string $url = '';

    /**
     * @var string
     */
    #[Column(name: "remember_token", type: "string", length: 255, nullable: false, options: ['default' => ''])]
    private ?string $rememberToken = '';

    /**
     * @var int
     */
    #[Column(name: "status", type: "integer", nullable: false, options: ['default' => '0'])]
    private int $status = 0;

    /**
     * @var Collection<int, UserMeta>&Selectable<int, UserMeta>
     */
    #[OneToMany(mappedBy: "user", targetEntity: UserMeta::class, cascade: ["persist", "remove"], fetch: 'EXTRA_LAZY')]
    private Collection $metas;

    private UserRepository $userRepository;

    private UserPasswordHasherInterface $passwordHasher;

    public function __construct()
    {
        $this->registeredAt = new DateTime();
        $this->metas = new ArrayCollection();
    }

    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAccount(): string
    {
        return $this->account;
    }

    public function setAccount(string $account): static
    {
        $this->account = $account;

        return $this;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getNickname(): string
    {
        return $this->nickname;
    }

    public function setNickname(string $nickname): static
    {
        $this->nickname = $nickname;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $this->passwordHasher->hashPassword($this, $password);

        return $this;
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(?string $avatar): static
    {
        $this->avatar = $avatar;

        return $this;
    }

    public function getRegisteredAt(): ?DateTimeInterface
    {
        return $this->registeredAt;
    }

    public function setRegisteredAt(DateTimeInterface $registeredAt): static
    {
        $this->registeredAt = $registeredAt;

        return $this;
    }

    public function getActivationKey(): ?string
    {
        return $this->activationKey;
    }

    public function setActivationKey(?string $activationKey): static
    {
        $this->activationKey = $activationKey ?? '';

        return $this;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): static
    {
        $this->url = $url;

        return $this;
    }

    public function getRememberToken(): ?string
    {
        return $this->rememberToken;
    }

    public function setRememberToken(?string $rememberToken): static
    {
        $this->rememberToken = $rememberToken ?? '';

        return $this;
    }

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): static
    {
        $this->status = $status;

        return $this;
    }

    /**
     * @param array $roles
     * @return $this
     */
    public function setRoles(array $roles): static
    {
        $meta = $this->getMeta('roles');
        if ($meta == null && $roles) {
            $userMeta = new UserMeta();
            $userMeta->setMetaKey("roles")->setMetaValue($roles);
            $this->addMeta($userMeta);
            return $this;
        }
        if ($meta) {
            if ($roles) {
                $meta->setMetaValue($roles);
            } else {
                $this->metas->removeElement($meta);
            }
        }
        return $this;
    }

    public function getRoles(): array
    {
        // TODO: Implement getRoles() method.
        $meta = $this->getMeta("roles");
        if ($meta == null || empty($value = $meta->getMetaValue())) {
            return [];
        }
        return array_map(function ($id) {
            return "ROLE_" . $id;
        }, $value);
    }

    public function eraseCredentials(): void
    {
        // TODO: Implement eraseCredentials() method.
    }

    public function getUserIdentifier(): string
    {
        // TODO: Implement getUserIdentifier() method.
        return $this->email;
    }

    /**
     * @param UserMeta $meta
     * @return User
     */
    public function addMeta(UserMeta $meta): static
    {
        $meta->setUser($this);
        $this->metas[] = $meta;
        return $this;
    }

    /**
     * @return Collection<int, UserMeta>
     */
    public function getMetas(): Collection
    {
        return $this->metas;
    }

    public function getMeta(string $name): ?UserMeta
    {
        foreach ($this->getMetas() as $meta) {
            if ($meta->getMetaKey() == $name) {
                return $meta;
            }
        }
        return null;
    }

    /**
     * @param ExecutionContextInterface $context
     * @return void
     */
    public function isEmailUnique(ExecutionContextInterface $context): void
    {
        try {
            $id = $this->getId();
            $user = $this->userRepository->findOneBy(['email' => $this->email]);
            if (($id == null && $user) || ($id != null && $user->getId() != $id)) {
                $context->buildViolation("已存在相同的邮箱地址")
                    ->atPath("email")
                    ->addViolation();
            }
        } catch (\Exception $_) {
        }
    }

    /**
     * @param ExecutionContextInterface $context
     * @return void
     */
    public function isAccountUnique(ExecutionContextInterface $context): void
    {
        try {
            if (($user = $this->userRepository->findOneBy(['account' => $this->getAccount()])) && $user->getId() != $this->id) {
                $context->buildViolation("已存在相同的用户名")
                    ->atPath("account")
                    ->addViolation();
            }
        } catch (\Exception $_) {
        }
    }


    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        // TODO: Implement jsonSerialize() method.
        $meta = $this->getMeta("roles");
        return [
            'id' => $this->getId(),
            'account' => $this->getAccount(),
            'nickname' => $this->getNickname(),
            'avatar' => $this->getAvatar(),
            'email' => $this->getEmail(),
            'url'   => $this->getUrl(),
            'password' => '',
            'roles' => $meta ? array_map('intval', $meta->getMetaValue()) : [],
            'registeredAt' => $this->getRegisteredAt()->format("Y-m-d H:i:s")
        ];
    }

    /**
     * @param UserRepository $userRepository
     * @return void
     */
    public function setUserRepository(UserRepository $userRepository): void
    {
        $this->userRepository = $userRepository;
    }

    public function serialize(): ?string
    {
        // TODO: Implement serialize() method.
        return serialize($this->__serialize());
    }

    public function unserialize(string $serialized)
    {
        // TODO: Implement unserialize() method.

        $data = unserialize($serialized);

        $this->__unserialize($data);
    }

    public function __toString(): string
    {
        return (string) $this->getAccount();
    }

    /**
     * @param UserPasswordHasherInterface $passwordHasher
     * @return void
     */
    public function setPasswordHasher(UserPasswordHasherInterface $passwordHasher): void
    {
        $this->passwordHasher = $passwordHasher;
    }

    /**
     * @throws \Exception
     */
    public function __serialize(): array
    {
        // TODO: Implement __serialize() method.
        return [
            $this->id,
            $this->account,
            $this->email,
            $this->nickname,
            $this->password,
            $this->avatar,
            $this->registeredAt,
            $this->activationKey,
            $this->url,
            $this->rememberToken,
            $this->status,
        ];
    }

    public function __unserialize(array $data): void
    {
        // TODO: Implement __unserialize() method.
        list(
            $this->id,
            $this->account,
            $this->email,
            $this->nickname,
            $this->password,
            $this->avatar,
            $this->registeredAt,
            $this->activationKey,
            $this->url,
            $this->rememberToken,
            $this->status,
        ) = $data;
    }
}
