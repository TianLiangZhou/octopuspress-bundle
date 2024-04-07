<?php
declare(strict_types=1);
namespace OctopusPress\Bundle\Form\Type;

use OctopusPress\Bundle\Entity\TermRelationship;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Repository\TaxonomyRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TermRelationshipType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $taxonomies = $options['taxonomies'] ?? [];
        $builder->add('id', EntityType::class, [
            'class' => TermTaxonomy::class,
            'query_builder' => function (TaxonomyRepository $repository) use ($taxonomies) {
                return $repository->createQueryBuilder('tt')
                    ->where('tt.id IN (:id)')
                    ->setParameter('id', $taxonomies);
            },
            'choice_value' => 'id',
            'empty_data'   => null,
            'property_path' => 'taxonomy'
        ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => TermRelationship::class,
            'allow_extra_fields' => true,
            'taxonomies' => [],
        ]);
    }
}
