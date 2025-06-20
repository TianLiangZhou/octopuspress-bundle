<?php

namespace OctopusPress\Bundle\Entity;

use Doctrine\ORM\Mapping\JoinColumn;
use JsonSerializable;
use OctopusPress\Bundle\Repository\UserMetaRepository;
use OctopusPress\Bundle\Util\Formatter;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\Table;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Regex;

/**
 * UserMetas
 */
#[Table(name: "user_metas", )]
#[Entity(repositoryClass: UserMetaRepository::class)]
#[ORM\UniqueConstraint(columns: ['user_id', 'meta_key'])]
#[Index(name: 'user_id', columns: ['user_id'])]
#[Index(name: 'user_meta_key', columns: ['meta_key'])]
class UserMeta
{
    /**
     * @var int|null
     */
    #[Id]
    #[Column(name: "meta_id", type: "integer", nullable: false, options: ['unsigned' => true])]
    #[GeneratedValue(strategy: "IDENTITY")]
    private ?int $metaId = null;


    /**
     * @var User
     */
    #[ManyToOne(targetEntity: User::class, fetch: "EAGER", inversedBy: "metas")]
    #[JoinColumn(name: "user_id", referencedColumnName: "id", nullable: false)]
    private User $user;

    /**
     * @var string
     */
    #[Column(name: "meta_key", type: "string", length: 191, nullable: false)]
    #[NotBlank]
    #[Regex(pattern: "/^[\w]+(?:[-\w]+)*$/")]
    private string $metaKey = '';

    /**
     * @var mixed|null
     */
    #[Column(name: "meta_value", type: "text", length: 0, nullable: true)]
    private mixed $metaValue = null;

    public function getMetaId(): ?int
    {
        return $this->metaId;
    }


    public function getMetaKey(): ?string
    {
        return $this->metaKey;
    }

    public function setMetaKey(?string $metaKey): self
    {
        $this->metaKey = $metaKey;

        return $this;
    }

    public function getMetaValue(): mixed
    {
        return Formatter::reverseTransform($this->metaValue);
    }

    /**
     * @param array<int|string,mixed>|string|JsonSerializable $value
     * @return $this
     */
    public function setMetaValue(array|string|int|bool|JsonSerializable|null $value): self
    {
        $this->metaValue = Formatter::transform($value);
        return $this;
    }

    /**
     * @return User
     */
    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * @param User|null $user
     */
    public function setUser(?User $user): void
    {
        $this->user = $user;
    }
}
