<?php

namespace OctopusPress\Bundle\Scalable;


final class Theme
{
    /**
     * @var array<string, string>
     */
    private array $themeNavigation = [];

    /**
     * @var array<string, array<string, mixed>>
     */
    private array $themeFeatures = [];

    /**
     * @var array<string, array<string, mixed>>
     */
    private array $registeredThemeFeatures = [];

    /**
     * @param array<string, string> $locations
     * @return Theme
     */
    public function registerThemeNavigation(array $locations): self
    {
        foreach ($locations as $alias => $name) {
            if (is_numeric($alias) || !is_string($name)) {
                continue;
            }
            $this->themeNavigation[$alias] = $name;
        }
        return $this;
    }

    /**
     * @param string $feature
     * @param array<string, mixed> $args
     * @return Theme
     */
    public function addThemeSupport(string $feature, array $args = []): self
    {
        switch ($feature) {
            case 'custom_logo':
                $args = $this->themeCustomLogo($args);
                break;
            case 'custom_background':
                $args = $this->themeCustomBackground($args);
                break;
            case 'custom_header':
                $args = $this->themeCustomHeader($args);
                break;
            case 'bootstrap':
                $args = $this->themeBootstrap($args);
                break;
            case 'jQuery':
                $args = array_merge(['version' => 3], $args);
                break;
            case 'nebular':
                $args = array_merge(['theme' => null], $args);
                break;
        }
        $this->themeFeatures[$feature] = $args;
        return $this;
    }

    /**
     * @param string $feature
     * @return bool
     */
    public function isThemeSupport(string $feature): bool
    {
        return isset($this->themeFeatures[$feature]);
    }

    /**
     * @param string $feature
     * @return array<string, mixed>
     */
    public function getThemeSupport(string $feature): array
    {
        return $this->themeFeatures[$feature] ?? [];
    }


    /**
     * @param string $feature
     * @param array<string, mixed> $args
     * @return Theme
     */
    public function registerThemeFeature(string $feature, array $args): self
    {
        $defaults = [
            'type' => 'boolean',
            'description' => '',
            'schema' => null,
        ];
        $args = array_merge($defaults, $args);
        if (!in_array($args['type'], ['string', 'boolean', 'integer', 'number', 'array', 'object'], true)) {
            throw new \InvalidArgumentException("Type is 'string', 'boolean', 'integer', 'number', 'array', 'object'!");
        }
        if ($args['type'] === 'array' && empty($args['schema']['items'])) {
            throw new \InvalidArgumentException("Array type items not empty!");
        }
        if ($args['type'] === 'object' && empty($args['schema']['properties'])) {
            throw new \InvalidArgumentException("Array type items not empty!");
        }
        $this->registeredThemeFeatures[$feature] = $args;
        return $this;
    }

    /**
     * @return string[]
     */
    public function getThemeNavigation(): array
    {
        return $this->themeNavigation;
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function getThemeFeatures(): array
    {
        return $this->themeFeatures;
    }

    /**
     * @param array<string, mixed> $args
     * @return array<string, mixed>
     */
    private function themeCustomLogo(array $args): array
    {
        $defaults = [
            'width'                => null,
            'height'               => null,
            'flex-width'           => false,
            'flex-height'          => false,
            'header-text'          => '',
            'unlink-homepage-logo' => false,
        ];
        return array_merge($defaults, $args);
    }

    /**
     * @param array<string, mixed> $args
     * @return array<string, mixed>
     */
    private function themeCustomBackground(array $args): array
    {

        $defaults = [
            'default-image'          => '',
            'default-preset'         => 'default',
            'default-position-x'     => 'left',
            'default-position-y'     => 'top',
            'default-size'           => 'auto',
            'default-repeat'         => 'repeat',
            'default-attachment'     => 'scroll',
            'default-color'          => '',
            'wp-head-callback'       => '_custom_background_cb',
            'admin-head-callback'    => '',
            'admin-preview-callback' => '',
        ];
        return array_merge($defaults, $args);
    }

    /**
     * @param array<string, mixed> $args
     * @return array<string, mixed>
     */
    private function themeCustomHeader(array $args): array
    {

        $defaults = [
            'default-image'          => '',
            'random-default'         => false,
            'width'                  => 0,
            'height'                 => 0,
            'flex-height'            => false,
            'flex-width'             => false,
            'default-text-color'     => '',
            'header-text'            => true,
            'uploads'                => true,
            'wp-head-callback'       => '',
            'admin-head-callback'    => '',
            'admin-preview-callback' => '',
            'video'                  => false,
            'video-active-callback'  => 'is_front_page',
        ];
        return array_merge($defaults, $args);
    }


    /**
     * @param array $args
     * @return array<string, mixed>
     */
    private function themeBootstrap(array $args): array
    {
        $defaults = [
            'version' => 5,
        ];
        return array_merge($defaults, $args);
    }

    /**
     * @retrun array<string, array<string, mixed>>
     */
    public function getRegisteredThemeFeatures(): array
    {
        return $this->registeredThemeFeatures;
    }
}
