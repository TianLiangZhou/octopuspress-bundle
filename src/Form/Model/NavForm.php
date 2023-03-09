<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Form\Model;

use Symfony\Component\Validator\Constraints\NotBlank;

/**
 *
 */
class NavForm
{

    /**
     * @var int
     */
    private int $id = 0;

    #[NotBlank]
    private string $name;

    /**
     * @var array<int, NavNode>
     */
    private array $nodes;

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId(int $id): void
    {
        $this->id = $id;
    }

    /**
     * @return array
     */
    public function getNodes(): array
    {
        return $this->nodes;
    }

    /**
     * @param array $nodes
     */
    public function setNodes(array $nodes): void
    {
        $this->nodes = $nodes;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }
}
