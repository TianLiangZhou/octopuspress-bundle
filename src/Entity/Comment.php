<?php

namespace OctopusPress\Bundle\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\Table;
use OctopusPress\Bundle\Repository\CommentRepository;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Url;

/**
 *
 */
#[Table(name: "comments", )]
#[Entity(repositoryClass: CommentRepository::class)]
#[Index(name: 'comment_parent', columns: ['parent'])]
#[Index(name: 'comment_post_id', columns: ['post_id'])]
#[Index(name: 'comment_date', columns: ['created_at'])]
#[Index(name: 'comment_author_email', columns: ['author_email'])]
#[Index(name: 'comment_approved_date', columns: ['approved', 'created_at'])]
class Comment implements \JsonSerializable
{

    const APPROVED   = 'approved';
    const UNAPPROVED = 'unapproved';
    const SPAM       = 'spam';
    const TRASH      = 'trash';

    const STATUS = [
        self::APPROVED,
        self::UNAPPROVED,
        self::SPAM,
        self::TRASH,
    ];

    /**
     * @var ?int
     */
    #[Column(name: "id", type: "integer", nullable: false, options: ['unsigned' => true])]
    #[Id]
    #[GeneratedValue(strategy: "IDENTITY")]
    private ?int $id = null;


    #[ManyToOne(targetEntity: Post::class, inversedBy: 'comments')]
    #[JoinColumn(name: "post_id", referencedColumnName: "id", nullable: false)]
    private Post $post;


    /**
     * @var ?User
     */
    #[ManyToOne(targetEntity: User::class)]
    #[JoinColumn(name: "user_id", referencedColumnName: "id", nullable: true)]
    private ?User $user = null;


    #[ManyToOne(targetEntity: Comment::class, inversedBy: 'children')]
    #[JoinColumn(name: 'parent', referencedColumnName: 'id', nullable: true, onDelete: "CASCADE")]
    private ?Comment $parent = null;

    /**
     * @var string
     */
    #[Column(name: "author", type: "string", length: 255, nullable: false)]
    private string $author;

    /**
     * @var string
     */
    #[Column(name: "author_email", type: "string", length: 100, nullable: false, options: ['default' => ''])]
    #[Email]
    private string $authorEmail = '';

    /**
     * @var string
     */
    #[Column(name: "author_url", type: "string", length: 200, nullable: false, options: ['default' => ''])]
    #[Url]
    private string $authorUrl = '';

    /**
     * @var string
     */
    #[Column(name: "author_ip", type: "string", length: 100, nullable: false, options: ['default' => ''])]
    private string $authorIp = '';

    /**
     * @var string
     */
    #[Column(name: "content", type: "text", length: 65535, nullable: false)]
    private string $content;

    /**
     * @var int
     */
    #[Column(name: "karma", type: "integer", nullable: false, options: ['default' => '0'])]
    private int $karma = 0;


    #[Column(name: "approved", type: "string", length: 20, nullable: false, options: ['default' => 'unapproved'])]
    private string $approved = 'unapproved';

    /**
     * @var string
     */
    #[Column(name: "agent", type: "string", length: 255, nullable: false, options: ['default' => ''])]
    private string $agent = '';

    /**
     * @var string
     */
    #[Column(name: "type", type: "string", length: 20, nullable: false, options:['default'=> 'comment'])]
    private string $type = 'comment';


    /**
     * @var DateTime
     */
    #[Column(name: "created_at", type: "datetime", nullable: false, options:["default"=>'1970-01-01 00:00:00'])]
    private \DateTimeInterface $createdAt;

    /**
     * @var ArrayCollection<int, CommentMeta>
     */
    #[OneToMany(targetEntity: CommentMeta::class, mappedBy: "comment", cascade: ["persist", "remove"], fetch: 'EXTRA_LAZY')]
    private Collection $metas;


    /**
     * @var Collection<int, Comment>
     */
    #[OneToMany(targetEntity: Comment::class, mappedBy: 'parent', cascade: ["persist", "remove"], fetch: 'EXTRA_LAZY')]
    private Collection $children;


    public function __construct()
    {
        $this->metas = new ArrayCollection();
        $this->children = new ArrayCollection();
        $this->createdAt = new DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAuthor(): ?string
    {
        return $this->author;
    }

    public function setAuthor(string $author): self
    {
        $this->author = $author;

        return $this;
    }

    public function getAuthorEmail(): ?string
    {
        return $this->authorEmail;
    }

    public function setAuthorEmail(string $authorEmail): self
    {
        $this->authorEmail = $authorEmail;

        return $this;
    }

    public function getAuthorUrl(): ?string
    {
        return $this->authorUrl;
    }

    public function setAuthorUrl(string $authorUrl): self
    {
        $this->authorUrl = $authorUrl;

        return $this;
    }

    public function getAuthorIp(): ?string
    {
        return $this->authorIp;
    }

    public function setAuthorIp(string $authorIp): self
    {
        $this->authorIp = $authorIp;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getKarma(): ?int
    {
        return $this->karma;
    }

    public function setKarma(int $karma): self
    {
        $this->karma = $karma;

        return $this;
    }

    public function getApproved(): ?string
    {
        return $this->approved;
    }

    public function setApproved(string $approved): self
    {
        $this->approved = $approved;

        return $this;
    }

    public function getAgent(): ?string
    {
        return $this->agent;
    }

    public function setAgent(string $agent): self
    {
        $this->agent = $agent;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }


    public function getCreatedAt(): \DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @return Post|null
     */
    public function getPost(): ?Post
    {
        return $this->post;
    }

    /**
     * @param Post $post
     * @return Comment
     */
    public function setPost(Post $post): self
    {
        $this->post = $post;
        return $this;
    }

    /**
     * @return User|null
     */
    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * @param User|null $user
     * @return Comment
     */
    public function setUser(?User $user): self
    {
        $this->user = $user;
        return $this;
    }


    public function jsonSerialize(): array
    {
        // TODO: Implement jsonSerialize() method.
        return [
            'id' => $this->getId(),
            'content' => $this->getContent(),
            'status'  => $this->getApproved(),
            'createdAt' => $this->getCreatedAt(),
        ];
    }

    public function getParent(): ?Comment
    {
        return $this->parent;
    }

    /**
     * @param Comment|null $parent
     * @return $this
     */
    public function setParent(?Comment $parent): self
    {
        $this->parent = $parent;
        return $this;
    }


    /**
     * @param Comment $comment
     * @return $this
     */
    public function addChildren(Comment $comment): self
    {
        if (!$this->children->contains($comment)) {
            $comment->setParent($this);
            $this->children->add($comment);
        }
        return $this;
    }

    /**
     * @param Comment $comment
     * @return $this
     */
    public function removeChildren(Comment $comment): static
    {
        if ($this->children->contains($comment)) {
            $this->children->removeElement($comment);
        }
        return $this;
    }

    /**
     * @return Collection
     */
    public function getChildren(): Collection
    {
        return $this->children;
    }

    /**
     * @param CommentMeta $meta
     * @return $this
     */
    public function addMeta(CommentMeta $meta): self
    {
        if (!$this->metas->contains($meta)) {
            $meta->setComment($this);
            $this->metas->add($meta);
        }
        return $this;
    }

    /**
     * @param PostMeta $meta
     * @return $this
     */
    public function removeMeta(PostMeta $meta): self
    {
        if ($this->metas->contains($meta)) {
            $this->metas->removeElement($meta);
        }
        return $this;
    }

    /**
     * @return Collection<int, CommentMeta>
     */
    public function getMetas(): Collection
    {
        return $this->metas;
    }
}
