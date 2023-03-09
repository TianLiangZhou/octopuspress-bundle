<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Form\Model;

use Symfony\Component\Validator\Constraints\NotBlank;

/**
 *
 */
class NavNode
{
    /**
     * @var int
     */
    private int $id = 0;

    #[NotBlank]
    private string $type;

    #[NotBlank]
    private string $title;

    /**
     * @var int
     */
    private int $objectId = 0;

    /**
     * @var string
     */
    private string $url = "";

    /**
     * @var array<int, NavNode>
     */
    private array $children = [];

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
     * @return NavNode[]
     */
    public function getChildren(): array
    {
        return $this->children;
    }

    /**
     * @param NavNode[] $children
     */
    public function setChildren(array $children): void
    {
        $this->children = $children;
    }

    /**
     * @return string
     */
    public function getUrl(): string
    {
        return $this->url;
    }

    /**
     * @param string $url
     */
    public function setUrl(string $url): void
    {
        $this->url = $url;
    }

    /**
     * @return int
     */
    public function getObjectId(): int
    {
        return $this->objectId;
    }

    /**
     * @param int $objectId
     */
    public function setObjectId(int $objectId): void
    {
        $this->objectId = $objectId;
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
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @param string $title
     */
    public function setTitle(string $title): void
    {
        $this->title = $title;
    }
}
