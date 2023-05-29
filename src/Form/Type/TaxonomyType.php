<?php
declare(strict_types=1);
namespace OctopusPress\Bundle\Form\Type;

use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Util\Formatter;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Event\PreSubmitEvent;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TaxonomyType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('description', TextType::class, ['required' => false, 'empty_data' => ''])
            ->add('parent', NumberType::class, [
                'required' => false,
                'empty_data' => null,
                'mapped'   => false,
            ])
            ->add('name', TextType::class, [
                'mapped' => false,
            ])
            ->add('slug', TextType::class, ['required' => false, 'empty_data' => '', 'mapped' => false])
            ->add('taxonomy', ChoiceType::class, [
                'choices' => $options['taxonomies'],
            ])
            ->add('metas', CollectionType::class, [
                'entry_type' => TermMetaType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'by_reference' => false,
                'required' => false,
                'mapped' => false,
            ])
            ->addEventListener(FormEvents::PRE_SUBMIT, function (PreSubmitEvent $form) use ($builder) {
                $data = $form->getData();
                if (empty($data['parent'])) {
                    $data['parent'] = null;
                }
                $data['metas'] = [];
                if (!empty($data['meta'])) {
                    foreach ($data['meta'] as $name => $value) {
                        $data['metas'][]  = ['metaKey' => $name, 'metaValue' => Formatter::transform($value)];
                    }
                }
                unset($data['meta']);
                $form->setData($data);
            });
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => TermTaxonomy::class,
            'allow_extra_fields' => true,
            'taxonomies' => [],
        ]);
    }
}
