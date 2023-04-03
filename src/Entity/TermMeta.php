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
use OctopusPress\Bundle\Repository\TermMetaRepository;
use OctopusPress\Bundle\Util\Formatter;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Regex;

/**
 * TermMetas
 */
#[Table(name: "term_metas", )]
#[Entity(repositoryClass: TermMetaRepository::class)]
#[UniqueConstraint(columns: ['term_id', 'meta_key'])]
#[Index(columns: ['term_id'], name: 'term_id')]
#[Index(columns: ['meta_key'], name: 'meta_key')]
class TermMeta
{
    /**
     * @var int
     */
    #[Id]
    #[Column(name: "meta_id", type: "integer", nullable: false, options: ['unsigned' => true])]
    #[GeneratedValue(strategy: "IDENTITY")]
    private int $metaId;

    /**
     * @var Term
     */
    #[ManyToOne(targetEntity: Term::class, fetch: "EAGER", inversedBy: "metas")]
    #[JoinColumn(name: "term_id", referencedColumnName: "term_id", nullable: false)]
    private Term $term;


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

    /**
     * @return Term
     */
    public function getTerm(): Term
    {
        return $this->term;
    }

    /**
     * @param Term $term
     * @return TermMeta
     */
    public function setTerm(Term $term): self
    {
        $this->term = $term;
        return $this;
    }
}
