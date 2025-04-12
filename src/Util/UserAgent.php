<?php

namespace OctopusPress\Bundle\Util;

use Detection\MobileDetect;

final class UserAgent extends MobileDetect
{
    /**
     * List of additional operating systems for pc.
     * @var array
     */
    protected static array $additionalOperatingSystems = [
        'Windows' => 'Windows',
        'Windows NT' => 'Windows NT',
        'OS X' => 'Mac OS X',
        'Debian' => 'Debian',
        'Ubuntu' => 'Ubuntu',
        'Macintosh' => 'PPC',
        'OpenBSD' => 'OpenBSD',
        'Linux' => 'Linux',
        'ChromeOS' => 'CrOS',
    ];

    /**
     * List of additional browsers.
     * @var array
     */
    protected static array $additionalBrowsers = [
        'Opera Mini' => 'Opera Mini',
        'Opera' => 'Opera|OPR',
        'Edge' => 'Edge|Edg',
        'Coc Coc' => 'coc_coc_browser',
        'UCBrowser' => 'UCBrowser',
        'Vivaldi' => 'Vivaldi',
        'Chrome' => 'Chrome',
        'Firefox' => 'Firefox',
        'Safari' => 'Safari',
        'IE' => 'MSIE|IEMobile|MSIEMobile|Trident/[.0-9]+',
        'Netscape' => 'Netscape',
        'Mozilla' => 'Mozilla',
        'WeChat'  => 'MicroMessenger',
    ];

    /**
     * @param string $userAgent
     * @return UserAgent
     */
    public static function builder(string $userAgent): UserAgent
    {
        return new self([], $userAgent);
    }

    /**
     * Match a detection rule and return the matched key.
     *
     * @param array $rules
     * @param string|null $userAgent
     * @return ?string
     */
    protected function findDetectionRulesAgainstUA(array $rules, ?string $userAgent = null): ?string
    {
        // Loop given rules
        foreach ($rules as $key => $regex) {
            if (empty($regex)) {
                continue;
            }

            // Check match
            if ($this->match($regex, $userAgent)) {
                return $key;
            }
        }

        return null;
    }

    /**
     * Get the browser name.
     * @param string|null $userAgent
     * @return string
     */
    public function browser(?string $userAgent = null): string
    {
        return $this->findDetectionRulesAgainstUA(
            array_merge(self::getBrowsers(), self::$additionalBrowsers),
            $userAgent
        ) ?? 'Other';
    }

    /**
     * Get the platform name.
     * @param  string|null $userAgent
     * @return string
     */
    public function os(?string $userAgent = null): string
    {
        return $this->findDetectionRulesAgainstUA(
            array_merge(self::$additionalOperatingSystems, self::getOperatingSystems()),
            $userAgent
        ) ?? 'Other';
    }

    /**
     * Get the device name.
     * @param  string|null $userAgent
     * @return string
     */
    public function device(?string $userAgent = null): string
    {
        $rules = array_merge(
            self::getPhoneDevices(),
            self::getTabletDevices(),
        );
        return $this->findDetectionRulesAgainstUA($rules, $userAgent) ?? 'Other';
    }
}
