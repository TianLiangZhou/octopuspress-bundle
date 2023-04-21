<?php

namespace OctopusPress\Bundle\Entity;

use DateTimeInterface;
use OctopusPress\Bundle\Repository\RelationRepository;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\Table;

/**
 * TermRelationships
 */
#[Table(name: "term_relationships")]
#[Entity(repositoryClass: RelationRepository::class)]
#[Index(columns: ['term_taxonomy_id', 'type', 'status', 'created_at'])]
class TermRelationship
{
    #[Id]
    #[ManyToOne(targetEntity: Post::class, fetch: 'EAGER', inversedBy: "termRelationships")]
    #[JoinColumn(name: "object_id", referencedColumnName: "id", nullable: false)]
    private Post $post;

    #[Id]
    #[ManyToOne(targetEntity: TermTaxonomy::class, fetch: 'EAGER', inversedBy: "relationships")]
    #[JoinColumn(name: "term_taxonomy_id", referencedColumnName: "term_taxonomy_id", nullable:  false)]
    private ?TermTaxonomy $taxonomy = null;

    /**
     * @var int
     */
    #[Column(name: "term_order", type: "integer", nullable: false, options: ['default' => '0'])]
    private int $termOrder = 0;


    /**
     * @var string
     */
    #[Column(name: "type", type: "string", length: 28, nullable: false, options: ['default' => 'post'])]
    private string $type = 'post';

    /**
     * @var string
     */
    #[Column(name: "status", type: "string", length: 20, nullable: false, options: ["default"=>"publish"])]
    private string $status = 'publish';

    /**
     * @var DateTimeInterface
     */
    #[Column(name: "created_at", type: "datetime", nullable: false, options:["default"=>'1970-01-01 00:00:00'])]
    private DateTimeInterface $createdAt;


    public function getTermOrder(): ?int
    {
        return $this->termOrder;
    }

    public function setTermOrder(int $termOrder): self
    {
        $this->termOrder = $termOrder;

        return $this;
    }

    /**
     * @return Post
     */
    public function getPost(): Post
    {
        return $this->post;
    }

    /**
     * @param Post $post
     */
    public function setPost(Post $post): void
    {
        $this->post = $post;
        $this->setStatus($post->getStatus());
        $this->setType($post->getType());
        $this->setCreatedAt($post->getCreatedAt());
    }

    /**
     * @return ?TermTaxonomy
     */
    public function getTaxonomy(): ?TermTaxonomy
    {
        return $this->taxonomy;
    }

    /**
     * @param TermTaxonomy $taxonomy
     */
    public function setTaxonomy(TermTaxonomy $taxonomy): void
    {
        $this->taxonomy = $taxonomy;
    }

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @param string $type
     */
    public function setType(string $type): void
    {
        $this->type = $type;
    }

    /**
     * @return string
     */
    public function getStatus(): string
    {
        return $this->status;
    }

    /**
     * @param string $status
     */
    public function setStatus(string $status): void
    {
        $this->status = $status;
    }

    /**
     * @return DateTimeInterface
     */
    public function getCreatedAt(): DateTimeInterface
    {
        return $this->createdAt;
    }

    /**
     * @param DateTimeInterface $createdAt
     */
    public function setCreatedAt(DateTimeInterface $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

}
