<?php

namespace OctopusPress\Bundle\Entity;

use JsonSerializable;
use OctopusPress\Bundle\Repository\OptionRepository;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\Table;
use Doctrine\ORM\Mapping\UniqueConstraint;
use OctopusPress\Bundle\Util\Formatter;
use Symfony\Component\Validator\Constraints\NotBlank;

/**
 * Options
 */
#[Table(name: "options", )]
#[Entity(repositoryClass: OptionRepository::class)]
#[UniqueConstraint(name: 'option_name', columns: ['option_name'])]
#[Index(columns: ['autoload'], name: 'autoload')]
class Option
{
    const TRUE = 'true';

    const FALSE = 'false';
    /**
     * @var int
     */
    #[Column(name: "option_id", type: "integer", nullable: false, options: ['unsigned' => true])]
    #[Id]
    #[GeneratedValue(strategy: "IDENTITY")]
    private int $id;

    /**
     * @var string
     */
    #[Column(name: "option_name", type: "string", length: 191, nullable: false)]
    #[NotBlank(message: "键不能为空")]
    private string $name = '';

    /**
     * @var string
     */
    #[Column(name: "option_value", type: "text", length: 0, nullable: false)]
    private string $value = '';

    /**
     * @var string
     */
    #[Column(name: "autoload", type: "string", length: 20, nullable: false, options: ['default' => 'yes'])]
    private string $autoload = 'yes';

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    /**
     * @param array<int|string,mixed>|string|JsonSerializable $value
     * @return $this
     */
    public function setValue(array|string|int|bool|JsonSerializable|null $value): self
    {
        $this->value = Formatter::transform($value);
        return $this;
    }

    public function getAutoload(): ?string
    {
        return $this->autoload;
    }

    public function setAutoload(string $autoload): self
    {
        $this->autoload = $autoload;

        return $this;
    }
}
