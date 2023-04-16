<?php

namespace OctopusPress\Bundle\Scalable;

use OctopusPress\Bundle\Customize\AbstractControl;
use OctopusPress\Bundle\Customize\Control;

final class Meta
{
    private array $comment = [];
    private array $post    = [];
    private array $taxonomy = [];
    private array $user    = [];


    /**
     * @param string $taxonomy
     * @param string $key
     * @param array $args
     * @param AbstractControl|array|null $control
     * @return $this
     */
    public function registerTaxonomy(string|array $taxonomy, string $key, array $args = [], AbstractControl|array $control = null): Meta
    {
        foreach ((array) $taxonomy as $t) {
            $this->taxonomy[$t][] = $this->register($key, $args, $control);
        }
        return $this;
    }

    /**
     * @param string $type
     * @param string $key
     * @param array $args
     * @param AbstractControl|array|null $control
     * @return $this
     */
    public function registerPost(string|array $type, string $key, array $args = [], AbstractControl|array $control = null): Meta
    {
        foreach ((array) $type as $t) {
            $this->post[$t][] = $this->register($key, $args, $control);
        }
        return $this;
    }

    /**
     * @param string $key
     * @param array $args
     * @param AbstractControl|array|null $control
     * @return $this
     */
    public function registerUser(string $key, array $args = [], AbstractControl|array $control = null): Meta
    {
        $this->user[] = $this->register($key, $args, $control);
        return $this;
    }

    /**
     * @param string $key
     * @param array $args
     * @param AbstractControl|array|null $control
     * @return $this
     */
    public function registerComment(string $key, array $args = [], AbstractControl|array $control = null): Meta
    {
        $this->comment[] = $this->register($key, $args, $control);
        return $this;
    }

    /**
     * @param string $key
     * @param array $args
     * @param AbstractControl|array|null $control
     * @return array
     */
    private function register(string $key, array $args = [], AbstractControl|array $control = null): array
    {
        $meta = array_merge([
            'key'    => $key,
            'showUi' => true,
            'isCreated' => true,
            'isUpdated' => true,
            'control'   => null,
        ], $args);
        if (!empty($control) && is_array($control)) {
            $control = new Control($key, $control);
        }
        if (!$meta['control'] instanceof AbstractControl) {
            $meta['control'] = $control;
        }
        if ($meta['control']) {
            $meta['control']->setId($key);
        }
        if (!$meta['showUi']) {
            $meta['isUpdated'] = $meta['isCreated'] = false;
        }
        return $meta;
    }

    /**
     * @return array
     */
    public function getUser(): array
    {
        return $this->user;
    }


    /**
     * @return array
     */
    public function getTaxonomy(): array
    {
        return $this->taxonomy;
    }


    /**
     * @return array
     */
    public function getPost(): array
    {
        return $this->post;
    }


    /**
     * @return array
     */
    public function getComment(): array
    {
        return $this->comment;
    }

    /**
     * @param string $type
     * @return array
     */
    public function getPostType(string $type): array
    {
        return $this->post[$type] ?? [];
    }


    /**
     * @param string $taxonomy
     * @return array
     */
    public function getTermTaxonomy(string $taxonomy): array
    {
        return $this->taxonomy[$taxonomy] ?? [];
    }
}
