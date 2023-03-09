<?php

namespace OctopusPress\Bundle\Service;

use InvalidArgumentException;
use OctopusPress\Bundle\Bridge\Bridger;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class ServiceCenter
{
    private Requester $requester;

    private string $domain = 'https://localhost';
    private string $tempDir;

    /**
     * @param Requester $requester
     * @param Bridger $bridger
     */
    public function __construct(Requester $requester, Bridger $bridger)
    {
        $this->requester = $requester;
        $this->tempDir = $bridger->getTempDir();
    }

    /**
     * @return array
     */
    public function getThemes(): array
    {

        return [];
    }

    /**
     * @return array
     */
    public function getPlugins(): array
    {
        return [];
    }


    public function getThemeInfo(string $name)
    {
        $url = $this->domain . '/theme/'. $name;
        $this->requester->get($url);
    }

    public function getPluginInfo(string $name)
    {
        $url = $this->domain . '/plugin/'. $name;
        $this->requester->get($url);
    }

    public function downloadThemePackage(string $name)
    {
        $this->requester->get('');
        $downloadUrl = "";
        return $this->downloadPackage($downloadUrl);

    }

    public function downloadPluginPackage(string $name)
    {
        $this->requester->get('');
        $downloadUrl = "";
        return $this->downloadPackage($downloadUrl);
    }

    /**
     * @param string $url
     * @param array $options
     * @return string
     * @throws TransportExceptionInterface
     */
    public function downloadPackage(string $url, array $options = []): string
    {
        $file = sprintf('%s/%s.zip', $this->tempDir, explode('/', $url)[2]);
        $fd = fopen($file, 'w');
        $this->requester->download($url, $fd, $options);
        return $file;
    }

    /**
     * @example
     * - https://github.com/xxx/xxx
     * - https://github.com/xxx/xxx.git
     * - https://github.com/xxx/xxx/tree/v2.3.1
     * - https://github.com/xxx/xxx/tree/develop
     * - https://github.com/xxx/xxx/tree/develop
     * - https://github.com/xxx/xxx/archive/refs/tags/v2.0.3.zip
     *
     * @param string $url
     * @return string
     * @throws InvalidArgumentException
     */
    public function getGithubDownloadUrl(string $url): string
    {
        $urlParts = parse_url($url);
        if (empty($urlParts) || $urlParts['host'] !== 'github.com' || empty($urlParts['path']) || $urlParts['path'] == '/') {
            throw new InvalidArgumentException("Unrecognized github.com link");
        }
        $pathParts = pathinfo($urlParts['path']);
        $ext = $pathParts['extension'] ?? '';
        if (!empty(($ext))) {
            if ($ext == 'zip') {
                return $url;
            }
            if ($ext == 'git' || !str_ends_with($pathParts['dirname'], 'tree')) {
                return $urlParts['scheme'] . '://' . $urlParts['host'] . $pathParts['dirname'] . '/' . $pathParts['filename'] . '/archive/refs/heads/master.zip';
            }
            if (is_numeric($ext)) {
                return $urlParts['scheme'] . '://' . $urlParts['host'] . dirname($pathParts['dirname']) . '/archive/refs/tags/' . $pathParts['basename'] . '.zip';
            }
        }
        if (str_ends_with($pathParts['dirname'], '/tree')) {
            return $urlParts['scheme'] . '://' . $urlParts['host'] . dirname($pathParts['dirname']) . '/archive/refs/heads/' . $pathParts['basename'] . '.zip';
        }
        return $urlParts['scheme'] . '://' . $urlParts['host'] . $urlParts['path'] . '/archive/refs/heads/' . $pathParts['basename'] . '.zip';
    }
}
