<?php

namespace OctopusPress\Bundle\Form\Type;

use OctopusPress\Bundle\Entity\UserMeta;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserMetaType extends MetaType
{
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => UserMeta::class,
        ]);
    }
}
