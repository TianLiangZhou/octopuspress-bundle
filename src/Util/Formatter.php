<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Util;

use JsonSerializable;

final class Formatter
{
    const ON = 'on';
    const OFF = 'off';

    /**
     * @param string $title
     * @return string
     */
    public static function sanitizeWithDashes(string $title): string
    {
        $title = strip_tags($title);
        $title = preg_replace('/\s+/', '-', $title);
        if (strlen($title) != mb_strlen($title)) {
            $title = urlencode($title);
        }
        $title = strtolower($title);
        if (strlen($title) > 198) {
            $title = substr($title, 0, 198);
        }
        // Convert &nbsp, &ndash, and &mdash to hyphens.
        $title = str_replace(array('%c2%a0', '%e2%80%93', '%e2%80%94'), '-', $title);
        // Convert &nbsp, &ndash, and &mdash HTML entities to hyphens.
        $title = str_replace(array('&nbsp;', '&#160;', '&ndash;', '&#8211;', '&mdash;', '&#8212;'), '-', $title);
        // Convert forward slash to hyphen.
        $title = str_replace('/', '-', $title);

        // Strip these characters entirely.
        $title = str_replace(
            array(
                // Soft hyphens.
                '%c2%ad',
                // &iexcl and &iquest.
                '%c2%a1',
                '%c2%bf',
                // Angle quotes.
                '%c2%ab',
                '%c2%bb',
                '%e2%80%b9',
                '%e2%80%ba',
                // Curly quotes.
                '%e2%80%98',
                '%e2%80%99',
                '%e2%80%9c',
                '%e2%80%9d',
                '%e2%80%9a',
                '%e2%80%9b',
                '%e2%80%9e',
                '%e2%80%9f',
                // Bullet.
                '%e2%80%a2',
                // &copy, &reg, &deg, &hellip, and &trade.
                '%c2%a9',
                '%c2%ae',
                '%c2%b0',
                '%e2%80%a6',
                '%e2%84%a2',
                // Acute accents.
                '%c2%b4',
                '%cb%8a',
                '%cc%81',
                '%cd%81',
                // Grave accent, macron, caron.
                '%cc%80',
                '%cc%84',
                '%cc%8c',
                // Non-visible characters that display without a width.
                '%e2%80%8b', // Zero width space.
                '%e2%80%8c', // Zero width non-joiner.
                '%e2%80%8d', // Zero width joiner.
                '%e2%80%8e', // Left-to-right mark.
                '%e2%80%8f', // Right-to-left mark.
                '%e2%80%aa', // Left-to-right embedding.
                '%e2%80%ab', // Right-to-left embedding.
                '%e2%80%ac', // Pop directional formatting.
                '%e2%80%ad', // Left-to-right override.
                '%e2%80%ae', // Right-to-left override.
                '%ef%bb%bf', // Byte order mark.
                '%ef%bf%bc', // Object replacement character.
            ),
            '',
            $title
        );

        // Convert non-visible characters that display with a width to hyphen.
        $title = str_replace(
            array(
                '%e2%80%80', // En quad.
                '%e2%80%81', // Em quad.
                '%e2%80%82', // En space.
                '%e2%80%83', // Em space.
                '%e2%80%84', // Three-per-em space.
                '%e2%80%85', // Four-per-em space.
                '%e2%80%86', // Six-per-em space.
                '%e2%80%87', // Figure space.
                '%e2%80%88', // Punctuation space.
                '%e2%80%89', // Thin space.
                '%e2%80%8a', // Hair space.
                '%e2%80%a8', // Line separator.
                '%e2%80%a9', // Paragraph separator.
                '%e2%80%af', // Narrow no-break space.
            ),
            '-',
            $title
        );

        // Convert &times to 'x'.
        $title = str_replace('%c3%97', 'x', $title);

        $title = preg_replace('/[^%a-z0-9_-]/', '', $title);
        return trim(preg_replace('/-+/', '-', $title), '-');
    }

    /**
     * @param string $value
     * @param bool $associative
     * @return int|array|string
     */
    public static function reverseTransform(string $value, bool $associative = false): mixed
    {
        if (str_starts_with($value, '{') || str_starts_with($value, '[')) {
            return json_decode($value, $associative);
        } elseif (is_numeric($value)) {
            return (int)$value;
        } else {
            return $value;
        }
    }

    /**
     * @param array<int|string,mixed>|string|bool|int|JsonSerializable|null $value
     * @return string
     */
    public static function transform(array|string|bool|int|null|JsonSerializable $value): string
    {
        return !is_scalar($value)
            ? (json_encode($value, JSON_UNESCAPED_UNICODE) ?: '')
            : (is_bool($value) ? ($value ? self::ON : self::OFF) : (string)$value);
    }

    /**
     * @param string $str
     * @return string
     */
    public static function base64UrlEncode(string $str): string
    {
        return rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
    }

    /**
     * @param string $str
     * @return string
     */
    public static function base64UrlDecode(string $str): string
    {
        return base64_decode(str_pad(strtr($str, '-_', '+/'), strlen($str) % 4, '=', STR_PAD_RIGHT));
    }
}
