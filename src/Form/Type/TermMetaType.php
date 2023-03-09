<?php

namespace OctopusPress\Bundle\Form\Type;

use OctopusPress\Bundle\Entity\TermMeta;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TermMetaType extends MetaType
{
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => TermMeta::class,
        ]);
    }
}
