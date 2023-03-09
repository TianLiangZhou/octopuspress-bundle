<?php

namespace OctopusPress\Bundle\Entity;

use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Table;

/**
 * DoctrineMigrationVersions
 */
#[Table(name: "doctrine_migration_versions",)]
class DoctrineMigrationVersions
{
    /**
     * @var string
     */
    #[Column(name: "version", type: "string", length: 191, nullable: false)]
    #[Id]
    #[GeneratedValue(strategy: "IDENTITY")]
    private $version;

    /**
     * @var \DateTime|null
     */
    #[Column(name: "executed_at", type: "datetime", nullable: true)]
    private $executedAt;

    /**
     * @var int|null
     */
    #[Column(name: "execution_time", type: "integer", nullable: true)]
    private $executionTime;
}
