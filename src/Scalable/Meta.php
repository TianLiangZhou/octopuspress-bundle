<?php

namespace OctopusPress\Bundle\Scalable;

use OctopusPress\Bundle\Customize\AbstractControl;

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
     * @param AbstractControl|null $control
     * @return $this
     */
    public function registerTaxonomy(string $taxonomy, string $key, array $args = [], AbstractControl $control = null): Meta
    {
        $this->taxonomy[$taxonomy][] = $this->register($key, $args, $control);
        return $this;
    }

    /**
     * @param string $type
     * @param string $key
     * @param array $args
     * @param AbstractControl|null $control
     * @return $this
     */
    public function registerPost(string $type, string $key, array $args = [], AbstractControl $control = null): Meta
    {
        $this->post[$type][] = $this->register($key, $args, $control);
        return $this;
    }

    /**
     * @param string $key
     * @param array $args
     * @param AbstractControl|null $control
     * @return $this
     */
    public function registerUser(string $key, array $args = [], AbstractControl $control = null): Meta
    {
        $this->user[] = $this->register($key, $args, $control);
        return $this;
    }

    /**
     * @param string $key
     * @param array $args
     * @param AbstractControl|null $control
     * @return $this
     */
    public function registerComment(string $key, array $args = [], AbstractControl $control = null): Meta
    {
        $this->comment[] = $this->register($key, $args, $control);
        return $this;
    }

    /**
     * @param string $key
     * @param array $args
     * @param AbstractControl|null $control
     * @return array
     */
    private function register(string $key, array $args = [], AbstractControl $control = null): array
    {
        $meta = array_merge([
            'key'    => $key,
            'showUi' => true,
            'isCreated' => true,
            'isUpdated' => true,
            'control'   => null,
        ], $args);
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
