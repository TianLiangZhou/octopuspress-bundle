<?php

namespace OctopusPress\Bundle\Model;

use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use InvalidArgumentException;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\OctopusPressKernel;
use OctopusPress\Bundle\Repository\OptionRepository;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use ZipArchive;
use function Symfony\Component\String\u;

abstract class PackageManager
{
    protected Filesystem $filesystem;
    protected Bridger $bridger;
    protected OptionRepository $optionRepository;

    protected string $namePattern = '/^[a-z0-9]([_.-]?[a-z0-9]+)*\/[a-z0-9](([_.]|-{1,2})?[a-z0-9]+)*$/';

    protected string $themeNamePattern = '/^[a-z0-9](([_.]|-{1,2})?[a-z0-9]+)*$/';

    protected string $versionPattern = '/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/';

    public function __construct(Bridger $bridger)
    {
        $this->bridger = $bridger;
        $this->filesystem = new Filesystem();
        $this->optionRepository = $this->bridger->getOptionRepository();
    }

    /**
     * @param string $packageType
     * @param string $packageName
     * @return void
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws ORMException
     * @throws OptimisticLockException
     * @throws \Exception
     */
    public function install(string $packageName): void
    {
        $host = rtrim($_SERVER['SERVER_CENTER_HOST'] ?? $this->bridger->getParameter('service_center_host'), '/');
        $officialInfo = $this->bridger->getClient()->request('GET', $host. '/package/' . $packageName . '.json', [
            'timeout' => 15,
            'no_proxy' => '127.0.0.1,localhost',
            'headers' => [
                'Content-Type' => 'application/json',
            ]
        ])->toArray();
        $zipFile = $this->downloadCenterPackage($packageName);
        if (!file_exists($zipFile)) {
            throw new \RuntimeException("安装失败");
        }
        if (!empty($officialInfo['content'])) {
            unset($officialInfo['content']);
        }
        try {
            $packageInfo = $this->getPackageInfo($zipFile);
        } catch (\Exception $e) {
            unlink($zipFile);
            throw $e;
        }
        $this->setup(array_merge($packageInfo, $officialInfo));
    }


    /**
     * @param string $zipFile
     * @return void
     * @throws \Exception
     */
    public function externalInstall(string $zipFile): void
    {
        try {
            $packageInfo = $this->getPackageInfo($zipFile);
        } catch (\Exception $e) {
            unlink($zipFile);
            throw $e;
        }
        $packageInfo['packageName'] = str_replace('/', '_', $packageInfo['packageName']);
        $this->setup($packageInfo);
    }

    /**
     * @param string $zipFile
     * @return array
     * @throws \Exception
     */
    public function getPackageInfo(string $zipFile): array
    {
        $tempPath = $this->extractPackage($zipFile);
        $finder = Finder::create()
            ->files()
            ->depth('< 2')
            ->name(['composer.json', 'package.json'])
            ->in($tempPath);
        $composerFile = null; $packageFile = null;
        foreach ($finder as $item) {
            if ($item->getFilename() === 'composer.json') {
                $composerFile = $item;
                break;
            } else {
                $packageFile = $item;
            }
        }
        if ($composerFile) {
            $composerFile = $composerFile->getPathname();
            $jsonInfo = json_decode(file_get_contents($composerFile), true);
            $packageName = $jsonInfo['name'];
            preg_match($this->namePattern, $packageName, $matches);
            if (empty($matches)) {
                throw new InvalidArgumentException('composer.json wrong format name.');
            }
            $version = empty($jsonInfo['version']) ? '1.0.0' : (string) $jsonInfo['version'];
            $opVersion = empty($jsonInfo['extra']['mini-op']) ? OctopusPressKernel::OCTOPUS_PRESS_VERSION : (string) $jsonInfo['extra']['mini-op'];
            $phpVersion = empty($jsonInfo['extra']['mini-php']) ? PHP_VERSION : (string) $jsonInfo['extra']['mini-php'];
            $name = empty($jsonInfo['extra']['name'])
                ? str_replace('/', '_', $packageName)
                : (string) $jsonInfo['extra']['name'];
            $entrypoint = (string) ($jsonInfo['extra']['entrypoint'] ?? '');
            $autoload = $jsonInfo['autoload'] ?? [];
            $psr4     = $autoload['psr-4'] ?? [];
            if (empty($entrypoint)) {
                $namespace = $psr4 ? array_key_first($psr4) : '\\OctopusPress\\Plugin\\';
                $entrypoint = $namespace . $this->getNameForClass($packageName);
            }
            $authors = isset($jsonInfo['authors'][0]) ? $jsonInfo['authors'] : [$jsonInfo['authors']];
        } elseif ($packageFile) {
            $packageFile = $packageFile->getPathname();
            $jsonInfo = json_decode(file_get_contents($packageFile), true);
            $packageName = $jsonInfo['name'];
            preg_match($this->themeNamePattern, $packageName, $matches);
            if (empty($matches)) {
                throw new InvalidArgumentException('package.json wrong format version.');
            }
            $version = empty($jsonInfo['version']) ? '1.0.0' : (string) $jsonInfo['version'];
            $opVersion = empty($jsonInfo['config']['mini-op']) ? OctopusPressKernel::OCTOPUS_PRESS_VERSION : (string) $jsonInfo['config']['mini-op'];
            $phpVersion = empty($jsonInfo['config']['mini-php']) ? PHP_VERSION : (string) $jsonInfo['config']['mini-php'];
            $name = empty($jsonInfo['config']['name']) ? $packageName : $jsonInfo['extra']['name'];
            $entrypoint = (string) ($jsonInfo['config']['entrypoint'] ?? 'functions.php');
            $authors = isset($jsonInfo['author']) ? [$jsonInfo['author']] : [];
        } else {
            throw new InvalidArgumentException('Zip archive composer.json or package.json file does not exist.');
        }
        preg_match($this->versionPattern, $version, $matches);
        if (empty($matches)) {
            throw new InvalidArgumentException('wrong format version.');
        }
        preg_match($this->versionPattern, $opVersion, $matches);
        if (empty($matches)) {
            throw new InvalidArgumentException('invalid op version number.');
        }
        preg_match($this->versionPattern, $phpVersion, $matches);
        if (empty($matches)) {
            throw new InvalidArgumentException('invalid php version number.');
        }
        $keywords = [];
        if (isset($jsonInfo['keywords'][0])) {
            $keywords = $jsonInfo['keywords'];
        } elseif (isset($jsonInfo['keywords']) && $jsonInfo['keywords']) {
            $keywords[] = $jsonInfo['keywords'];
        }
        $description = (string) ($jsonInfo['description'] ?? '');
        $homepage = (string) ($jsonInfo['homepage'] ?? '');
        $logo = $screenshot = "";
        if ((isset($jsonInfo['extra']['logo']) && $jsonInfo['extra']['logo']) ||
            (isset($jsonInfo['config']['logo']) && $jsonInfo['config']['logo'])
        ) {
            $logo = (string) ($jsonInfo['extra']['logo'] ?? $jsonInfo['config']['logo']);
        }
        if ((isset($jsonInfo['extra']['screenshot']) && $jsonInfo['extra']['screenshot']) ||
            (isset($jsonInfo['config']['screenshot']) && $jsonInfo['config']['screenshot'])
        ) {
            $screenshot = (string) ($jsonInfo['extra']['screenshot'] || $jsonInfo['config']['screenshot']);
        }
        $packageInfo = [
            'packageName'  => $packageName,
            'name'         => $name,
            'description'  => $description,
            'keywords'     => $keywords,
            'version'      => $version,
            'authors'      => $authors,
            'homepage'     => $homepage,
            'entrypoint'   => $entrypoint,
            'miniOP'       => $opVersion,
            'miniPHP'      => $phpVersion,
            'logo'         => $logo,
            'screenshot'   => $screenshot,
            'tempDir'      => $tempPath,
        ];
        if ($composerFile) {
            $packageInfo['composerFile'] = $composerFile;
        } else {
            $packageInfo['packageFile'] = $packageFile;
        }
        return $packageInfo;
    }

    /**
     * @param string $packageType
     * @param array $condition
     * @return array
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function market(string $packageType, array $condition = []): array
    {
        $host = rtrim($_SERVER['SERVER_CENTER_HOST'] ?? $this->bridger->getParameter('service_center_host'), '/');
        return $this->bridger->getClient()->request('GET', $host. '/package/' . $packageType . '.json', [
            'timeout' => 15,
            'no_proxy' => '127.0.0.1,localhost',
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'query'   => $condition,
        ])->toArray();
    }

    /**
     * @param string $packageFile
     * @return string
     * @throws \Exception
     */
    public function extractPackage(string $packageFile): string
    {
        $zipArchive = new ZipArchive();
        if ($zipArchive->open($packageFile) !== true) {
            throw new InvalidArgumentException('Zip cannot be opened.');
        }
        $tempPath = rtrim(sys_get_temp_dir(), '\\/') . DIRECTORY_SEPARATOR . bin2hex(random_bytes(4));
        if (mkdir($tempPath) === false) {
            throw new InvalidArgumentException('Permission denied.');
        }
        $zipArchive->extractTo($tempPath);
        $zipArchive->close();
        return $tempPath;
    }

    /**
     * @param string $name
     * @return string
     */
    public function getNameForClass(string $name): string
    {
        return u($name)->camel()->title()->toString();
    }

    /**
     * @param string $url
     * @param string $filename
     * @param array $options
     * @return string
     * @throws TransportExceptionInterface
     */
    public function downloadPackage(string $url, string $filename, array $options = []): string
    {
        $file = sprintf('%s/%s.zip', $this->bridger->getTempDir(), $filename);
        $fd = fopen($file, 'w');
        $this->download($url, $fd, $options);
        return $file;
    }


    /**
     * @param string $name
     * @return string
     * @throws TransportExceptionInterface
     */
    public function downloadCenterPackage(string $name): string
    {
        $host = rtrim($_SERVER['SERVER_CENTER_HOST'] ?? $this->bridger->getParameter('service_center_host'), '/');
        $downloadUrl = $host . '/package/' . $name . '/download';
        return $this->downloadPackage($downloadUrl, $name);
    }

    /**
     * @param string $url
     * @return string
     * @throws TransportExceptionInterface
     */
    public function downloadGithubPackage(string $url): string
    {
        return $this->downloadPackage(
            $this->getGithubDownloadUrl($url),
            pathinfo($url, PATHINFO_BASENAME)
        );
    }


    /**
     * @throws TransportExceptionInterface
     */
    public function download(string $url, $fd, array $options = [], string $method = 'GET'): void
    {
        if (!is_resource($fd)) {
            return ;
        }
        $client = $this->bridger->getClient();
        $response = $client->request($method, $url, $options);
        foreach ($client->stream($response) as $chunk) {
            fwrite($fd, $chunk->getContent());
        }
        fclose($fd);
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
