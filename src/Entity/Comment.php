<?php

namespace OctopusPress\Bundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\Table;
use OctopusPress\Bundle\Repository\CommentRepository;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Url;

/**
 *
 */
#[Table(name: "comments", )]
#[Entity(repositoryClass: CommentRepository::class)]
#[Index(columns: ['parent'], name: 'comment_parent')]
#[Index(columns: ['post_id'], name: 'comment_post_id')]
#[Index(columns: ['created_at'], name: 'comment_date')]
#[Index(columns: ['author_email'], name: 'comment_author_email')]
#[Index(columns: ['approved', 'created_at'], name: 'comment_approved_date')]
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
    #[Column(name: "id", type: "bigint", nullable: false, options: ['unsigned' => true])]
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
//    #[JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: true, onDelete: "CASCADE")]
    private ?User $user = null;


    #[ManyToOne(targetEntity: Comment::class, inversedBy: 'children')]
//    #[JoinColumn(name: 'parent', referencedColumnName: 'id', nullable: true, onDelete: "CASCADE")]
    private ?Comment $parent;

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
    private string $approved = '1';

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
     * @var \DateTime
     */
    #[Column(name: "created_at", type: "datetime", nullable: false, options:["default"=>'1970-01-01 00:00:00'])]
    private \DateTimeInterface $createdAt;

    /**
     * @var Collection<int, CommentMeta>&Selectable<int, CommentMeta>
     */
    #[OneToMany(mappedBy: "comment", targetEntity: CommentMeta::class, cascade: ["persist", "remove"])]
    private Collection $metas;


    /**
     * @var Collection<int, Comment>
     */
    #[OneToMany(mappedBy: 'parent', targetEntity: Comment::class)]
    private Collection $children;

    public function __construct()
    {
        $this->metas = new ArrayCollection();
        $this->children = new ArrayCollection();
        $this->createdAt = new \DateTime();
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
     */
    public function setPost(Post $post): void
    {
        $this->post = $post;
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
     * @return void
     */
    public function setUser(?User $user): void
    {
        $this->user = $user;
    }


    public function jsonSerialize(): array
    {
        // TODO: Implement jsonSerialize() method.
        return [
            'id' => $this->getId(),
            'content' => $this->getContent(),
            'createdAt' => $this->getCreatedAt(),
        ];
    }
}
