<?php

namespace OctopusPress\Bundle\Entity;

use OctopusPress\Bundle\Repository\RelationRepository;
use Doctrine\ORM\Mapping\ChangeTrackingPolicy;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\OrderBy;
use Doctrine\ORM\Mapping\Table;
use Doctrine\ORM\Mapping\UniqueConstraint;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * TermRelationships
 */
#[Table(name: "term_relationships")]
#[Entity(repositoryClass: RelationRepository::class)]
#[Index(columns: ['term_taxonomy_id'], name: 'term_taxonomy_id')]
class TermRelationship
{
    #[Id]
    #[ManyToOne(targetEntity: Post::class, inversedBy: "termRelationships")]
    #[JoinColumn(name: "object_id", referencedColumnName: "id", nullable: false)]
    private Post $post;

    #[Id]
    #[ManyToOne(targetEntity: TermTaxonomy::class, inversedBy: "relationships")]
    #[JoinColumn(name: "term_taxonomy_id", referencedColumnName: "term_taxonomy_id", nullable:  false)]
    private ?TermTaxonomy $taxonomy = null;

    /**
     * @var int
     */
    #[Column(name: "term_order", type: "integer", nullable: false, options: ['default' => '0'])]
    private int $termOrder = 0;


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

}
