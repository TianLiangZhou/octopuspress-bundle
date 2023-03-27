<?php

namespace OctopusPress\Bundle\Plugin;

use JsonSerializable;

final class Manifest implements JsonSerializable
{
    private string $alias = '';

    private string $name = '';

    private string $description = '';

    private string $version = '1.0.0';

    private ?string $pluginDir = null;

    private ?string $staticDir = null;

    /**
     * @var array<int, array{name: string, homepage:string}>
     */
    private array $author = [];

    /**
     * @var string
     */
    private string $minPhpVersion = '';

    /**
     * @var string
     */
    private string $minVersion = '';

    private function __construct()
    {
    }

    /**
     * @return string
     */
    public function getMinVersion(): string
    {
        return $this->minVersion;
    }

    /**
     * @param string $minVersion
     * @return Manifest
     */
    public function setMinVersion(string $minVersion): Manifest
    {
        $this->minVersion = $minVersion;
        return $this;
    }

    /**
     * @return string
     */
    public function getMinPhpVersion(): string
    {
        return $this->minPhpVersion;
    }

    /**
     * @param string $minPhpVersion
     * @return Manifest
     */
    public function setMinPhpVersion(string $minPhpVersion): Manifest
    {
        $this->minPhpVersion = $minPhpVersion;
        return $this;
    }

    /**
     * @return string
     */
    public function getStaticDir(): string
    {
        return $this->staticDir;
    }

    /**
     * @param string $staticDir
     * @return Manifest
     */
    public function setStaticDir(string $staticDir): Manifest
    {
        $this->staticDir = $staticDir;
        return $this;
    }

    /**
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    private function __clone()
    {
    }

    /**
     * @return string
     */
    public function getPluginDir(): string
    {
        return $this->pluginDir ?? __DIR__;
    }

    /**
     * @param string $pluginDir
     * @return Manifest
     */
    public function setPluginDir(string $pluginDir): Manifest
    {
        $this->pluginDir = $pluginDir;
        return $this;
    }

    /**
     * @return Manifest
     */
    public static function builder(): Manifest
    {
        return new Manifest();
    }
    /**
     * @return string
     */
    public function getAlias(): string
    {
        return $this->alias;
    }

    /**
     * @param string $alias
     * @return Manifest
     */
    public function setAlias(string $alias): self
    {
        $this->alias = $alias;
        return $this;
    }

    /**
     * @return string
     */
    public function getVersion(): string
    {
        return $this->version;
    }

    /**
     * @param array{name: string, homepage: string} $author
     * @return Manifest
     */
    public function setAuthor(array $author): self
    {
        $this->author = isset($author[0]) ? $author : [$author];
        return $this;
    }

    /**
     * @param string $name
     * @param string $homepage
     * @return $this
     */
    public function addAuthor(string $name, string $homepage = '')
    {
        $this->author[] = ['name' => $name, 'homepage' => $homepage];
        return $this;
    }

    /**
     * @param string $version
     * @return Manifest
     */
    public function setVersion(string $version): self
    {
        $this->version = $version;
        return $this;
    }

    /**
     * @param string $name
     * @return Manifest
     */
    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @param string $description
     * @return Manifest
     */
    public function setDescription(string $description): self
    {
        $this->description = $description;
        return $this;
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        // TODO: Implement jsonSerialize() method.
        return [
            'name' => $this->getName(),
            'version' => $this->getVersion(),
            'description' => $this->getDescription(),
            'author' => $this->author,
        ];
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }
}
