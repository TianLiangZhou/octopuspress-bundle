<?php

namespace OctopusPress\Bundle\Scalable;

use OctopusPress\Bundle\Scalable\Features\PostType;

class Post
{

    /**
     * @var array<string, PostType>
     */
    private array $types = [];

    /**
     * @var string[]
     */
    private array $status = [];
    private TermTaxonomy $taxonomy;

    public function __construct(TermTaxonomy $taxonomy)
    {
        $this->taxonomy = $taxonomy;
    }

    /**
     * @return $this
     */
    public function registerType(string $type, array $args = []): static
    {
        if (empty($type) || strlen($type) > 20) {
            throw new \InvalidArgumentException("`type` must be between 1 and 32 characters in length.");
        }
        $postType = new PostType($type, $args);
        $postType->addSupports()
            ->registerTaxonomies($this->taxonomy);
        $this->types[$type] = $postType;
        $postType->registerChildren($this->getTypes());
        return $this;
    }

    /**
     * @return $this
     */
    public function registerStatus(): static
    {

    }

    /**
     * @return array<string, PostType>
     */
    public function getTypes(): array
    {
        return $this->types;
    }

    /**
     * @param string $name
     * @return PostType|null
     */
    public function getType(string $name): ?PostType
    {
        return $this->types[$name] ?? null;
    }

    /**
     * @param string $name
     * @return bool
     */
    public function typeExists(string $name): bool
    {
        return isset($this->types[$name]);
    }

    /**
     * @param string $name
     * @return bool
     */
    public function statusExists(string $name): bool
    {
        return in_array($name, $this->status);
    }

    /**
     * @return array
     */
    public function getNames(): array
    {
        return array_keys($this->types);
    }
}
