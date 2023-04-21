<?php

namespace OctopusPress\Bundle\Entity;

use OctopusPress\Bundle\Repository\TermRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\Table;
use JsonSerializable;
use Symfony\Component\Validator\Constraints\Callback;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Regex;
use Symfony\Component\Validator\Constraints\Valid;

/**
 * Terms
 */
#[Table(name: "terms")]
#[Entity(repositoryClass: TermRepository::class)]
#[Index(columns: ['slug'], name: 'slug')]
#[Index(columns: ['name'], name: 'name')]
#[Callback(callback: "isUnique")]
class Term implements JsonSerializable
{
    /**
     * @var ?int
     */
    #[Column(name: "term_id", type: "integer", nullable: false, options: ['unsigned' => true])]
    #[Id]
    #[GeneratedValue(strategy: "AUTO")]
    private ?int $id = null;

    /**
     * @var string
     */
    #[Column(name: "name", type: "string", length: 200, nullable: false)]
    #[NotBlank]
    private string $name = '';

    /**
     * @var string
     */
    #[Column(name: "slug", type: "string", length: 200, nullable: false)]
    #[NotBlank]
    #[Regex(pattern: "/^[a-z0-9]+(?:-[a-z0-9]+)*$/", message: "invalid alias")]
    private string $slug = '';

    /**
     * @var int
     */
    #[Column(name: "term_group", type: "integer", nullable: false, options: ['default' => 0])]
    private int $termGroup = 0;


    /**
     * @var Collection<int, TermTaxonomy>
     */
    #[OneToMany(mappedBy: "term", targetEntity: TermTaxonomy::class, cascade: ["persist", "remove"])]
    private Collection $taxonomies;

    /**
     * @var Collection<int, TermMeta>
     */
    #[OneToMany(mappedBy: "term", targetEntity: TermMeta::class, cascade: ["persist", "remove"], fetch: 'EXTRA_LAZY')]
    #[JoinColumn(name: "term_id", referencedColumnName: "term_id")]
    #[Valid]
    private Collection $metas;

    public function __construct()
    {
        $this->taxonomies = new ArrayCollection();
        $this->metas = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    public function getTermGroup(): int
    {
        return $this->termGroup;
    }

    public function setTermGroup(int $termGroup): static
    {
        $this->termGroup = $termGroup;

        return $this;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        return [
            'name' => $this->getName(),
            'slug' => $this->getSlug(),
        ];
    }

    /**
     * @return Collection<int, TermMeta>
     */
    public function getTaxonomies(): Collection
    {
        return $this->taxonomies;
    }

    /**
     * @return void
     */
    public function isUnique(): void
    {

    }

    /**
     * @return Collection<int, TermMeta>
     */
    public function getMetas(): Collection
    {
        return $this->metas;
    }

    /**
     * @param Collection $metas
     * @return Term
     */
    public function setMetas(Collection $metas): static
    {
        $this->metas = $metas;
        return $this;
    }

    /**
     * @param TermMeta $meta
     * @return $this
     */
    public function addMeta(TermMeta $meta): static
    {
        if (!$this->metas->contains($meta)) {
            $meta->setTerm($this);
            $this->metas->add($meta);
        }
        return $this;
    }

    /**
     * @param TermMeta $meta
     * @return Term
     */
    public function removeMeta(TermMeta $meta): static
    {
        if ($this->metas->contains($meta)) {
            $this->metas->removeElement($meta);
        }
        return $this;
    }
}
