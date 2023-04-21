<?php

namespace OctopusPress\Bundle\Entity;

use DateTimeInterface;
use OctopusPress\Bundle\Repository\PostRepository;
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
use JsonSerializable;
use OctopusPress\Bundle\Util\Formatter;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Valid;

/**
 * Posts
 */
#[Table(name: "posts", )]
#[Entity(repositoryClass: PostRepository::class)]
#[Index(columns: ['author'], name: 'post_author')]
#[Index(columns: ['parent'], name: 'post_parent')]
#[Index(columns: ['name'], name: 'post_name')]
#[Index(columns: ['type', 'status', 'created_at', 'id'], name: 'type_status_date')]
class Post implements JsonSerializable
{
    const OPEN = 'open';
    const CLOSED = 'closed';

    // @see http://codex.wordpress.org/Post_Status
    const STATUS_PUBLISHED = 'publish';
    const STATUS_FUTURE = 'future';
    const STATUS_DRAFT = 'draft';
    const STATUS_PENDING = 'pending';
    const STATUS_PRIVATE = 'private';
    const STATUS_TRASH = 'trash';
    const STATUS_AUTODRAFT = 'auto-draft';
    const STATUS_INHERIT = 'inherit';

    const STATUS = [
        self::STATUS_PUBLISHED,
        self::STATUS_FUTURE,
        self::STATUS_DRAFT,
        self::STATUS_PENDING,
        self::STATUS_PRIVATE,
        self::STATUS_TRASH,
        self::STATUS_AUTODRAFT,
        self::STATUS_INHERIT,
    ];

    const TYPE_POST = 'post';
    const TYPE_PAGE = 'page';
    const TYPE_ATTACHMENT = 'attachment';
    const TYPE_REVISION = 'revision';
    const TYPE_NAVIGATION = 'nav_menu_item';

    const TYPE = [
        self::TYPE_POST,
        self::TYPE_PAGE,
        self::TYPE_ATTACHMENT,
        self::TYPE_REVISION,
        self::TYPE_NAVIGATION,
    ];



    /**
     * @var ?int
     */
    #[Column(name: "id", type: "integer", nullable: false, options: ['unsigned' => true])]
    #[Id]
    #[GeneratedValue(strategy: "AUTO")]
    private ?int $id = null;

    /**
     * @var ?User
     */
    #[ManyToOne(targetEntity: User::class)]
    #[JoinColumn(name: 'author', referencedColumnName: 'id', nullable: false)]
    private ?User $author = null;


    #[ManyToOne(targetEntity: Post::class, inversedBy: 'children')]
    #[JoinColumn(name: 'parent', referencedColumnName: 'id', nullable: true)]
    private ?Post $parent = null;

    /**
     * @var string
     */
    #[Column(name: "title", type: "text", length: 65535, nullable: false)]
    #[NotBlank]
    private string $title;

    /**
     * @var string
     */
    #[Column(name: "name", type: "string", length: 200, nullable: false)]
    private string $name = '';

    /**
     * @var string
     */
    #[Column(name: "excerpt", type: "text", length: 65535, nullable: false)]
    private string $excerpt = '';

    /**
     * @var string
     */
    #[Column(name: "content", type: "text", length: 0, nullable: false)]
    private string $content;

    /**
     * @var string
     */
    #[Column(name: "status", type: "string", length: 20, nullable: false, options: ["default"=>"publish"])]
    private string $status = 'publish';

    /**
     * @var string
     */
    #[Column(name: "comment_status", type: "string", length: 20, nullable: false, options: ["default"=>"open"])]
    private string $commentStatus = 'open';

    /**
     * @var string
     */
    #[Column(name: "ping_status", type: "string", length: 20, nullable: false, options: ["default"=>"open"])]
    private string $pingStatus = 'open';

    /**
     * @var string
     */
    #[Column(name: "password", type: "string", length: 255, nullable: false, options: ['default' => ''])]
    private string $password = '';


    /**
     * @var string
     */
    #[Column(name: "to_ping", type: "text", length: 65535, nullable: false, options: ['default' => ''])]
    private string $toPing = '';

    /**
     * @var string
     */
    #[Column(name: "pinged", type: "text", length: 65535, nullable: false, options: ['default' => ''])]
    private string $pinged = '';

    /**
     * @var string
     */
    #[Column(name: "filtered", type: "text", length: 0, nullable: false, options: ['default' => ''])]
    private string $filtered = '';

    /**
     * @var string
     */
    #[Column(name: "guid", type: "string", length: 255, nullable: false)]
    private string $guid = '';

    /**
     * @var int
     */
    #[Column(name: "menu_order", type: "integer", nullable: false, options: ['unsigned'=>true, 'default' => '0'])]
    private int $menuOrder = 0;

    /**
     * @var string
     */
    #[Column(name: "type", type: "string", length: 28, nullable: false, options: ['default' => 'post'])]
    private string $type = 'post';

    /**
     * @var string
     */
    #[Column(name: "mime_type", type: "string", length: 100, nullable: false, options: ['default' => ''])]
    private string $mimeType = '';

    /**
     * @var int
     */
    #[Column(name: "comment_count", type: "integer", nullable: false, options: ['unsigned' => true,'default' => '0'])]
    private int $commentCount = 0;

    /**
     * @var DateTimeInterface
     */
    #[Column(name: "modified_at", type: "datetime", nullable: false, options:["default"=>'1970-01-01 00:00:00'])]
    private DateTimeInterface $modifiedAt;

    /**
     * @var DateTimeInterface
     */
    #[Column(name: "created_at", type: "datetime", nullable: false, options:["default"=>'1970-01-01 00:00:00'])]
    private DateTimeInterface $createdAt;

    /**
     * @var Collection<int, PostMeta>
     */
    #[OneToMany(mappedBy: "post", targetEntity: PostMeta::class, cascade: ["persist", "remove"], fetch: 'EXTRA_LAZY')]
    #[Valid]
    private Collection $metas;

    /**
     * @var Collection<int, Comment>
     */
    #[OneToMany(mappedBy: "post", targetEntity: Comment::class, cascade: ["persist", "remove"], fetch: 'EXTRA_LAZY')]
    private Collection $comments;

    /**
     * @var Collection<int, TermRelationship>
     */
    #[OneToMany(mappedBy: "post", targetEntity: TermRelationship::class, cascade: ["persist", "remove"], fetch: 'EXTRA_LAZY')]
    #[Valid]
    private Collection $termRelationships;

    /**
     * @var Collection<int, Post>
     */
    #[OneToMany(mappedBy: 'parent', targetEntity: Post::class, fetch: 'EXTRA_LAZY')]
    private Collection $children;

    /**
     * @var Post|null
     */
    private ?Post $thumbnail = null;


    public function __construct()
    {
        $this->metas = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->children = new ArrayCollection();
        $this->termRelationships = new ArrayCollection();
        $this->createdAt = new DateTime();
        $this->modifiedAt= new DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(User $author): self
    {
        $this->author = $author;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getExcerpt(): ?string
    {
        return $this->excerpt;
    }

    public function setExcerpt(string $excerpt): self
    {
        $this->excerpt = $excerpt;

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

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCommentStatus(): ?string
    {
        return $this->commentStatus;
    }

    public function setCommentStatus(string $commentStatus): self
    {
        $this->commentStatus = $commentStatus;

        return $this;
    }

    public function getPingStatus(): ?string
    {
        return $this->pingStatus;
    }

    public function setPingStatus(string $pingStatus): self
    {
        $this->pingStatus = $pingStatus;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getToPing(): ?string
    {
        return $this->toPing;
    }

    public function setToPing(string $toPing): self
    {
        $this->toPing = $toPing;

        return $this;
    }

    public function getPinged(): ?string
    {
        return $this->pinged;
    }

    public function setPinged(string $pinged): self
    {
        $this->pinged = $pinged;

        return $this;
    }

    public function getFiltered(): ?string
    {
        return $this->filtered;
    }

    public function setFiltered(string $filtered): self
    {
        $this->filtered = $filtered;

        return $this;
    }

    public function getGuid(): ?string
    {
        return $this->guid;
    }

    public function setGuid(string $guid): self
    {
        $this->guid = $guid;

        return $this;
    }

    public function getMenuOrder(): ?int
    {
        return $this->menuOrder;
    }

    public function setMenuOrder(int $menuOrder): self
    {
        $this->menuOrder = $menuOrder;

        return $this;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getMimeType(): ?string
    {
        return $this->mimeType;
    }

    public function setMimeType(string $mimeType): self
    {
        $this->mimeType = $mimeType;

        return $this;
    }

    public function getCommentCount(): int
    {
        return $this->commentCount;
    }

    public function setCommentCount(int $commentCount): self
    {
        $this->commentCount = $commentCount;

        return $this;
    }

    public function getModifiedAt(): DateTimeInterface
    {
        return $this->modifiedAt;
    }

    public function setModifiedAt(DateTimeInterface $modifiedAt): self
    {
        $this->modifiedAt = $modifiedAt;

        return $this;
    }

    public function getCreatedAt(): DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;
        if ($this->createdAt > new DateTime()) {
            $this->status = self::STATUS_FUTURE;
        }
        return $this;
    }

    public function addMeta(PostMeta $meta): self
    {
        $meta->setPost($this);
        $this->metas->add($meta);
        return $this;
    }

    public function removeMeta(PostMeta $meta): self
    {
        if ($this->metas->contains($meta)) {
            $this->metas->removeElement($meta);
        }
        return $this;
    }

    /**
     * @return Collection<int, PostMeta>
     */
    public function getMetas(): Collection
    {
        return $this->metas;
    }

    /**
     * @param string $name
     * @return PostMeta|null
     */
    public function getMeta(string $name): ?PostMeta
    {
        foreach ($this->getMetas() as $meta) {
            if ($meta->getMetaKey() == $name) {
                return $meta;
            }
        }
        return null;
    }

    /**
     * @return Collection<int, Comment>
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    /**
     * @param Comment $comment
     *
     * @return Post
     */
    public function addComment(Comment $comment): static
    {
        if (!$this->comments->contains($comment)) {
            $comment->setPost($this);
            $this->comments->add($comment);
        }
        return $this;
    }

    /**
     * @param Comment $comment
     *
     * @return Post
     */
    public function removeComment(Comment $comment): static
    {
        if ($this->comments->contains($comment)) {
            $this->comments->removeElement($comment);
        }
        return $this;
    }

    /**
     * @return Collection<int, TermRelationship>
     */
    public function getTermRelationships(): Collection
    {
        return $this->termRelationships;
    }

    /**
     * @return ArrayCollection<int, TermTaxonomy>
     */
    public function getTags(): ArrayCollection
    {
        return $this->getTaxonomiesByType(TermTaxonomy::TAG);
    }

    /**
     * @return ArrayCollection<int, TermTaxonomy>
     */
    public function getCategories(): ArrayCollection
    {
        return $this->getTaxonomiesByType(TermTaxonomy::CATEGORY);
    }

    /**
     * @param TermRelationship $relationship
     *
     * @return Post
     */
    public function addTermRelationship(TermRelationship $relationship): self
    {
        if (!$this->termRelationships->contains($relationship)) {
            $relationship->setPost($this);
            $this->termRelationships->add($relationship);
        }
        return $this;
    }

    /**
     * @param TermRelationship $relationship
     *
     * @return Post
     */
    public function removeTermRelationship(TermRelationship $relationship): self
    {
        if ($this->termRelationships->contains($relationship)) {
            $this->termRelationships->removeElement($relationship);
        }
        return $this;
    }

    /**
     * @param $type
     *
     * @return ArrayCollection
     */
    public function getTermsByType($type): ArrayCollection
    {
        $terms = new ArrayCollection();
        $taxonomies = $this->getTaxonomiesByType($type);

        if ($taxonomies->count() > 0) {
            foreach ($taxonomies as $taxonomy) {
                $terms->add($taxonomy->getTerm());
            }
        }
        return $terms;
    }

    /**
     * @return int
     */
    public function getThumbnailId(): int
    {
        $attachment = $this->getMeta('_thumbnail_id');
        return (int) $attachment?->getMetaValue();
    }

    /**
     * @param array $assetsUrl
     * @return array
     */
    public function getAttachment(array $assetsUrl): array
    {
        $assetUrl = "";
        if (!empty($assetsUrl)) {
            $assetUrl = ($c = count($assetsUrl)) == 1
                ? $assetsUrl[0]
                : $assetsUrl[rand(0, $c - 1)];
        }
        return [
            'id' => $this->getId(),
            'title' => $this->getTitle(),
            'name' => $this->getName(),
            'path'=> $this->getContent(),
            'mime_type' => $this->getMimeType(),
            'url' => $assetUrl . $this->getContent(),
            'meta' => $this->getAttachmentMetadata(),
        ];
    }

    /**
     * @return array
     */
    public function getAttachmentMetadata(): array
    {
        $meta = $this->getMeta('_attachment_metadata');
        if ($meta == null || empty($value = $meta->getMetaValue())) {
            return [];
        }
        return Formatter::reverseTransform($value, true);
    }

    /**
     * @return Post|null
     */
    public function getThumbnail(): ?Post
    {
        return $this->thumbnail;
    }

    /**
     * @param Post $thumbnail
     * @return $this
     */
    public function setThumbnail(Post $thumbnail): self
    {
        $this->thumbnail = $thumbnail;
        return $this;
    }

    /**
     * @param string $type
     *
     * @return ArrayCollection
     */
    public function getTaxonomiesByType(string $type): ArrayCollection
    {
        $taxonomies = new ArrayCollection();
        foreach ($this->getTermRelationships() as $relationship) {
            if ($type === $relationship->getTaxonomy()->getTaxonomy()) {
                $taxonomies->add($relationship->getTaxonomy());
            }
        }
        return $taxonomies;
    }

    /**
     * @return Collection<int, Post>
     */
    public function getChildren(): Collection
    {
        return $this->children;
    }

    /**
     * @param Post $post
     * @return Post
     */
    public function addChildren(Post $post): self
    {
        if (!$this->children->contains($post)) {
            $post->setParent($this);
            $this->children->add($post);
        }
        return $this;
    }

    /**
     * @return Post|null
     */
    public function getParent(): ?Post
    {
        return $this->parent;
    }

    /**
     * @param Post|null $parent
     * @return Post
     */
    public function setParent(?Post $parent): self
    {
        $this->parent = $parent;
        return $this;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        $author = $this->getAuthor()->jsonSerialize();
        return [
            'id' => $this->getId(),
            'author' => $author,
            'parent' => $this->getParent(),
            'title' => $this->getTitle(),
            'name'  => $this->getName(),
            'excerpt' => $this->getExcerpt(),
            'status'     => $this->getStatus(),
            'type'  => $this->getType(),
            'password'      => $this->getPassword(),
            'commentStatus' => $this->getCommentStatus(),
            'pingStatus' => $this->getPingStatus(),
        ];
    }
}
