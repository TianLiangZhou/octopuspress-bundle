<?php

namespace OctopusPress\Bundle\Util;

use OctopusPress\Bundle\Entity\User;

interface UserAwareInterface
{
    public function setUser(User $user): void;
}
