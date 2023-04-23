<?php

namespace OctopusPress\Bundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\Table;
use JsonSerializable;
use OctopusPress\Bundle\Repository\PostMetaRepository;
use OctopusPress\Bundle\Util\Formatter;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Regex;

/**
 * PostMetas
 */
#[Table(name: "post_metas", )]
#[Entity(repositoryClass: PostMetaRepository::class)]
#[ORM\UniqueConstraint(columns: ['post_id', 'meta_key'])]
#[Index(columns: ['post_id'], name: 'post_id')]
#[Index(columns: ['meta_key'], name: 'meta_key')]
class PostMeta
{
    /**
     * @var int
     */
    #[Column(name: "meta_id", type: "integer", nullable: false, options: ['unsigned' => true])]
    #[Id]
    #[GeneratedValue(strategy: "IDENTITY")]
    private int $metaId;

    /**
     * @var Post
     */
    #[ManyToOne(targetEntity: Post::class, fetch: "EAGER", inversedBy: "metas")]
    #[JoinColumn(name: "post_id", referencedColumnName: "id", nullable: false)]
    private Post $post;


    /**
     * @var string
     */
    #[Column(name: "meta_key", type: "string", length: 191, nullable: false)]
    #[NotBlank]
    #[Regex(pattern: "/^[\w]+(?:[-\w]+)*$/")]
    private string $metaKey;

    /**
     * @var string|null
     */
    #[Column(name: "meta_value", type: "text", length: 0, nullable: true)]
    private ?string $metaValue;



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

    public function getMetaValue(bool $format = true): mixed
    {
        return $format
            ? Formatter::reverseTransform($this->metaValue)
            : $this->metaValue;
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
     * @return Post
     */
    public function getPost(): Post
    {
        return $this->post;
    }

    public function setPost(Post $post): self
    {
        $this->post = $post;
        return $this;
    }
}
