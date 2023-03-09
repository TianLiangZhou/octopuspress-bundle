<?php

namespace OctopusPress\Bundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

class MetaType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('metaKey', TextType::class)
            ->add('metaValue', TextType::class, ['required' => false, 'empty_data' => '']);
    }
}
