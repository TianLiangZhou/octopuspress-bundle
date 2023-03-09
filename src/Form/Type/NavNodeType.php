<?php

namespace OctopusPress\Bundle\Form\Type;

use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Form\Model\NavNode;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Event\PreSubmitEvent;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 *
 */
class NavNodeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('id', NumberType::class, [
                'required' => false, 'empty_data' => '0',
            ])
            ->add('title', TextType::class)
                ->add('objectId', NumberType::class, [
                    'required' => false, 'empty_data' => '0',
                ])
                ->add('type', ChoiceType::class, [
                    'choices' => [
                        Post::TYPE_POST => Post::TYPE_POST,
                        Post::TYPE_PAGE => Post::TYPE_PAGE,
                        TermTaxonomy::CATEGORY => TermTaxonomy::CATEGORY,
                        TermTaxonomy::TAG => TermTaxonomy::TAG,
                        'custom' => 'custom',
                    ],
                ])
                ->add('url', TextType::class, [
                    'required' => false, 'empty_data' => '',
                ]);
        $builder->addEventListener(FormEvents::PRE_SUBMIT, function (PreSubmitEvent $event) {
            $data = $event->getData();
            if (!empty($data['children'])) {
                $event->getForm()->add(
                    "children",
                    CollectionType::class,
                    [
                        'entry_type' => NavNodeType::class,
                        'allow_add' => true,
                        'allow_delete' => true,
                        'by_reference' => false,
                        'required' => false,
                    ]
                );
            }
        });
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => NavNode::class,
            'allow_extra_fields' => true,
        ]);
    }
}
