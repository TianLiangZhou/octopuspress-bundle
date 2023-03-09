<?php

namespace OctopusPress\Bundle\Service;

use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class Requester
{
    /**
     * @var HttpClientInterface
     */
    private HttpClientInterface $client;

    /**
     * @param HttpClientInterface $client
     */
    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
    }

    /**
     * @throws TransportExceptionInterface
     */
    public function download(string $url, $fd, array $options = [], string $method = 'GET'): void
    {
        if (!is_resource($fd)) {
            return ;
        }
        $response = $this->client->request($method, $url, $options);
        foreach ($this->client->stream($response) as $chunk) {
            fwrite($fd, $chunk->getContent());
        }
        fclose($fd);
    }

    public function post(string $url, array $options = [])
    {
        $response = $this->client->request('POST', $url, $options);

    }

    public function get(string $url, array $options = [])
    {
        $response = $this->client->request('GET', $url,  $options);
    }

    public function put(string $url, array $options = [])
    {
        $response = $this->client->request('PUT', $url,  $options);
    }

    public function delete(string $url, array $options = [])
    {

        $response = $this->client->request('DELETE', $url,  $options);
    }

    public function head(string $url, array $options = [])
    {

        $response = $this->client->request('HEAD', $url,  $options);
    }

    public function options(string $url, array $options = [])
    {
        $response = $this->client->request('OPTIONS', $url,  $options);
    }
}
