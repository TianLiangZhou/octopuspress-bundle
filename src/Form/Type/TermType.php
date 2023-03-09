<?php
declare(strict_types=1);
namespace OctopusPress\Bundle\Form\Type;

use OctopusPress\Bundle\Entity\Term;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TermType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('name', TextType::class)
            ->add('slug', TextType::class);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Term::class,
            'validation_groups' => ['Default'],
        ]);
    }
}
