<?php

use OctopusPress\Bundle\OctopusPressKernel;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Dotenv\Dotenv;

require __DIR__ . '/../vendor/autoload.php';

(new Dotenv())->bootEnv(__DIR__ . '/../.env');

$kernel = new class($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']) extends OctopusPressKernel{};
return new Application($kernel);
