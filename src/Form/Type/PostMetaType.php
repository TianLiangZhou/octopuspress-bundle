<?php

namespace OctopusPress\Bundle\Form\Type;

use OctopusPress\Bundle\Entity\PostMeta;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PostMetaType extends MetaType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => PostMeta::class,
        ]);
    }
}
