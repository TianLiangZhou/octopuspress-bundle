<?php

namespace OctopusPress\Bundle\Scalable;

use OctopusPress\Bundle\Scalable\Features\Taxonomy;

class TermTaxonomy
{
    /**
     * @var array<string, Taxonomy>
     */
    private array $taxonomies = [];

    /**
     * @param string $name
     * @param string|array $objectType
     * @param array $args
     * @return $this
     */
    public function registerTaxonomy(string $name, string|array $objectType, array $args = []): static
    {
        if (empty($name) || strlen($name) > 32) {
            throw new \InvalidArgumentException("Taxonomy names must be between 1 and 32 characters in length.");
        }
        $taxonomy = new Taxonomy($name, is_string($objectType) ? [$objectType] : $objectType, $args);

        $this->taxonomies[$name] = $taxonomy;
        return $this;
    }

    /**
     * @param string $name
     * @return Taxonomy|null
     */
    public function getTaxonomy(string $name): ?Taxonomy
    {
        return $this->taxonomies[$name] ?? null;
    }

    /**
     * @return Taxonomy[]
     */
    public function getTaxonomies(): array
    {
        return $this->taxonomies;
    }

    /**
     * @return array
     */
    public function getNames(): array
    {
        return array_keys($this->taxonomies);
    }

    /**
     * @param string $name
     * @return bool
     */
    public function exists(string $name): bool
    {
        return isset($this->taxonomies[$name]);
    }
}
