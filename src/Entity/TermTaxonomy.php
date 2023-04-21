<?php

namespace OctopusPress\Bundle\Entity;

use OctopusPress\Bundle\Repository\TaxonomyRepository;
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
use Doctrine\ORM\Mapping\OneToOne;
use Doctrine\ORM\Mapping\Table;
use Doctrine\ORM\Mapping\UniqueConstraint;
use JetBrains\PhpStorm\Internal\TentativeType;
use JsonSerializable;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Valid;

/**
 * TermTaxonomy
 */
#[Table(name: "term_taxonomy", )]
#[Entity(repositoryClass: TaxonomyRepository::class)]
#[Index(columns: ['taxonomy'], name: 'taxonomy')]
#[UniqueConstraint(name: 'term_id_taxonomy', columns: ['term_id', 'taxonomy'])]
class TermTaxonomy implements JsonSerializable
{
    const TAG = 'tag';
    const CATEGORY = 'category';
    const NAV_MENU = 'nav_menu';

    const TAXONOMY = [
        self::TAG,
        self::CATEGORY,
        self::NAV_MENU,
    ];

    /**
     * @var ?int
     */
    #[Id]
    #[Column(name: "term_taxonomy_id", type: "integer", nullable: false, options: ['unsigned' => true])]
    #[GeneratedValue(strategy: "AUTO")]
    private ?int $id = null;

    #[ManyToOne(targetEntity: TermTaxonomy::class, fetch: 'EAGER', inversedBy: 'children')]
    #[JoinColumn(name: 'parent', referencedColumnName: 'term_taxonomy_id', nullable: true)]
    private ?TermTaxonomy $parent = null;

    #[ManyToOne(targetEntity: Term::class, cascade: ["persist"])]
    #[JoinColumn(name: 'term_id', referencedColumnName: 'term_id', nullable: false)]
    #[Valid]
    private ?Term $term = null;

    /**
     * @var string
     */
    #[Column(name: "taxonomy", type: "string", length: 32, nullable: false)]
    #[NotBlank]
    private string $taxonomy = '';

    /**
     * @var string
     */
    #[Column(name: "description", type: "text", length: 0, nullable: false, options: ['default' => ''])]
    private string $description = '';


    /**
     * @var Collection<int, TermTaxonomy>
     */
    #[OneToMany(mappedBy: 'parent', targetEntity: TermTaxonomy::class, orphanRemoval: true)]
    private Collection $children;

    /**
     * @var int
     */
    #[Column(name: "count", type: "integer", nullable: false, options: ['unsigned' => true, 'default' => '0'])]
    private int $count = 0;

    /**
     * @var Collection<int, TermRelationship>
     */
    #[OneToMany(mappedBy: 'taxonomy', targetEntity: TermRelationship::class, orphanRemoval: true)]
    private Collection $relationships;

    public function __construct()
    {
        $this->children = new ArrayCollection();
        $this->relationships = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTaxonomy(): string
    {
        return $this->taxonomy;
    }

    public function setTaxonomy(string $taxonomy): self
    {
        $this->taxonomy = $taxonomy;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getParent(): ?TermTaxonomy
    {
        return $this->parent;
    }

    public function setParent(?TermTaxonomy $parent): self
    {
        $this->parent = $parent;
        return $this;
    }

    public function getCount(): int
    {
        return $this->count;
    }

    public function setCount(int $count): self
    {
        $this->count = $count;

        return $this;
    }

    /**
     * @return ?Term
     */
    public function getTerm(): ?Term
    {
        return $this->term;
    }

    /**
     * @param Term $term
     * @return TermTaxonomy
     */
    public function setTerm(Term $term): self
    {
        $this->term = $term;
        return $this;
    }

    public function jsonSerialize(): array
    {
        // TODO: Implement jsonSerialize() method.
        return [
            'id' => $this->getId(),
            'taxonomy' => $this->getTaxonomy(),
            'parent' => $this->getParent()?->getId(),
            'description' => $this->getDescription(),
            'count' => $this->getCount(),
        ];
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->getTerm()->getName();
    }

    /**
     * @return string
     */
    public function getSlug(): string
    {
        return $this->getTerm()->getSlug();
    }

    /**
     * @param TermTaxonomy $taxonomy
     * @return $this
     */
    public function addChildren(TermTaxonomy $taxonomy): self
    {
        if (!$this->children->contains($taxonomy)) {
            $taxonomy->setParent($this);
            $this->children[] = $taxonomy;
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
     * @return Collection<int, TermRelationship>
     */
    public function getRelationships(): Collection
    {
        return $this->relationships;
    }
}
