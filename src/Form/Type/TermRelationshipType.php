<?php
declare(strict_types=1);
namespace OctopusPress\Bundle\Form\Type;

use OctopusPress\Bundle\Entity\TermRelationship;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TermRelationshipType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('id', EntityType::class, [
            'class' => TermTaxonomy::class,
            'choice_value' => 'id',
            'empty_data'   => null,
            'property_path' => 'taxonomy'
        ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => TermRelationship::class,
            'allow_extra_fields' => true,
        ]);
    }
}
