<?php

namespace OctopusPress\Bundle\Controller;

use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Plugin\Plugin;
use OctopusPress\Bundle\Util\DoctrineTrait;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Contracts\Service\Attribute\Required;

abstract class Controller extends AbstractController
{
    use DoctrineTrait;

    protected ManagerRegistry $doctrine;
    protected Bridger $bridger;
    protected Plugin  $plugin;

    public function __construct(Bridger $bridger)
    {
        $this->bridger = $bridger;
    }

    #[Required]
    public function setDeps(ManagerRegistry $doctrine): void
    {
        $this->doctrine = $doctrine;
    }

    /**
     * @param Plugin $plugin
     */
    public function setPlugin(Plugin $plugin): void
    {
        $this->plugin = $plugin;
    }
}
