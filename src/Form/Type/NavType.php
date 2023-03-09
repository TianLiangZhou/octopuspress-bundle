<?php

namespace OctopusPress\Bundle\Form\Type;

use OctopusPress\Bundle\Form\Model\NavForm;
use Doctrine\DBAL\Types\ObjectType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 *
 */
class NavType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('id', NumberType::class)
            ->add('name', TextType::class)
            ->add('nodes', CollectionType::class, [
                'entry_type' => NavNodeType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'by_reference' => false,
                'required' => false,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => NavForm::class,
            'allow_extra_fields' => true,
        ]);
    }
}
