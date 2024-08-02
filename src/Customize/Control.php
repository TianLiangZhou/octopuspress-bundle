<?php

namespace OctopusPress\Bundle\Customize;

class Control extends AbstractControl
{
    /**
     * @param string $id
     * @param string $label
     * @param array $args
     * @return static
     */
    public static function create(string $id, string $label, array $args = []): static
    {
        $args['label'] = $label;
        return new static($id, $args);
    }

    public static function createInput(string $id, string $label, array $args = []): static
    {
        $args['type'] = self::INPUT;
        return self::create($id, $label, $args);
    }

    public static function createFile(string $id, string $label, array $args = []): static
    {
        $args['type'] = self::FILE;
        return self::create($id, $label, $args);
    }
    public static function createImage(string $id, string $label, array $args = []): static
    {
        $args['type'] = self::IMAGE;
        return self::create($id, $label, $args);
    }
    public static function createVideo(string $id, string $label, array $args = []): static
    {
        $args['type'] = self::VIDEO;
        return self::create($id, $label, $args);
    }
    public static function createAudio(string $id, string $label, array $args = []): static
    {
        $args['type'] = self::AUDIO;
        return self::create($id, $label, $args);
    }

    public static function createTextarea(string $id, string $label, array $args = []): static
    {
        $args['type'] = self::TEXTAREA;
        return self::create($id, $label, $args);
    }

    public static function createDate(string $id, string $label, array $args = []): static
    {
        $args['type'] = self::DATE;
        return self::create($id, $label, $args);
    }
    public static function createDatetime(string $id, string $label, array $args = []): static
    {
        $args['type'] = self::DATETIME;
        return self::create($id, $label, $args);
    }

    public static function createSelect(string $id, string $label, array $args = []): static
    {
        $args['type'] = self::SELECT;
        return self::create($id, $label, $args);
    }
    public static function createSelectSearch(string $id, string $label, array $args = []): static
    {
        $args['type'] = self::SELECT_SEARCH;
        return self::create($id, $label, $args);
    }

    public static function createCheckbox(string $id, string $label, array $args = []): static
    {
        $args['type'] = self::CHECKBOX;
        return self::create($id, $label, $args);
    }
    public static function createRadio(string $id, string $label, array $args = []): static
    {
        $args['type'] = self::RADIO;
        return self::create($id, $label, $args);
    }

    public static function createSwitch(string $id, string $label, array $args = []): static
    {
        $args['type'] = self::SWITCH;
        return self::create($id, $label, $args);
    }
    public static function createColor(string $id, string $label, array $args = []): static
    {
        $args['type'] = self::COLOR;
        return self::create($id, $label, $args);
    }

    public static function createGroup(string $id, string $label, array $args = []): static
    {
        $args['type'] = self::GROUP;
        return self::create($id, $label, $args);
    }

    public static function createHidden(string $id, string $label, array $args = []): static
    {
        $args['type'] = self::HIDDEN;
        return self::create($id, $label, $args);
    }

    public static function createCustom(string $id, string $label, array $args = []): static
    {
        $args['type'] = self::CUSTOM;
        return self::create($id, $label, $args);
    }
}
