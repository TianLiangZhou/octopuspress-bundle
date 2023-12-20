<?php

namespace OctopusPress\Bundle\Entity;

use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\Table;
use Doctrine\ORM\Mapping\UniqueConstraint;
use JsonSerializable;
use OctopusPress\Bundle\Repository\CommentMetaRepository;
use OctopusPress\Bundle\Util\Formatter;

/**
 *
 */
#[Table(name: "comment_metas",)]
#[Entity(repositoryClass: CommentMetaRepository::class)]
#[UniqueConstraint(columns: ['comment_id', 'meta_key'])]
#[Index(columns: ['comment_id'], name: 'comment_id')]
#[Index(columns: ['meta_key'], name: 'meta_key')]
class CommentMeta
{
    /**
     * @var int
     */
    #[Column(name: "meta_id", type: "integer", nullable: false, options: ['unsigned' => true])]
    #[Id]
    #[GeneratedValue(strategy: "IDENTITY")]
    private int $metaId;

    /**
     * @var Comment
     */
    #[ManyToOne(targetEntity: Comment::class, fetch: "EAGER", inversedBy: "metas")]
    #[JoinColumn(name: "comment_id", referencedColumnName: "id", nullable: false)]
    private Comment $comment;

    /**
     * @var string
     */
    #[Column(name: "meta_key", type: "string", length: 191, nullable: false)]
    private string $metaKey;

    /**
     * @var string|null
     */
    #[Column(name: "meta_value", type: "text", length: 0, nullable: true)]
    private ?string $metaValue;

    public function getMetaId(): int
    {
        return $this->metaId;
    }

    public function getComment(): Comment
    {
        return $this->comment;
    }

    public function setComment(Comment $comment): self
    {
        $this->comment = $comment;

        return $this;
    }

    public function getMetaKey(): string
    {
        return $this->metaKey;
    }

    public function setMetaKey(string $metaKey): self
    {
        $this->metaKey = $metaKey;

        return $this;
    }

    public function getMetaValue(): ?string
    {
        return $this->metaValue;
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
}
