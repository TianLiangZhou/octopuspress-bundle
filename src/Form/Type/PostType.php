<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Form\Type;

use OctopusPress\Bundle\Entity\Post;
use DateTime;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Event\PreSubmitEvent;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PostType extends AbstractType
{

    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     * @return void
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('title', TextType::class)
            ->add('content', TextType::class, ['required' => false, 'empty_data' => ''])
            ->add('type', ChoiceType::class, [
                'choices' => $options['types'],
                'data' => Post::TYPE_POST,
            ])
            ->add('parent', NumberType::class, [
                'required' => false,
                'empty_data' => null,
                'mapped' => false,
            ])
            ->add('featuredImage', NumberType::class, [
                'required' => false,
                'empty_data' => null,
                'mapped' => false,
            ])
            ->add('author', NumberType::class, [
                'required' => false,
                'empty_data' => null,
                'mapped' => false,
            ])
            ->add('excerpt', TextType::class, ['required' => false, 'empty_data' => ''])
            ->add('status', ChoiceType::class, [
                'choices' => array_combine(Post::STATUS, Post::STATUS),
                'data' => Post::STATUS_PUBLISHED,
            ])
            ->add('metas', CollectionType::class, [
                'entry_type' => PostMetaType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'by_reference' => false,
                'required' => false,
                'mapped' => false,
            ])
            ->add('commentStatus', ChoiceType::class, [
                'required' => false,
                'choices' => [
                    Post::OPEN => Post::OPEN,
                    Post::CLOSED => Post::CLOSED,
                ],
                'data' => Post::OPEN,
            ])
            ->add('pingStatus', ChoiceType::class, [
                'required' => false,
                'choices' => [
                    Post::OPEN => Post::OPEN,
                    Post::CLOSED => Post::CLOSED,
                ],
                'data' => Post::OPEN,
            ])
            ->add('password', TextType::class, ['required' => false, 'empty_data' => ''])
            ->add('relationships', CollectionType::class, [
                'entry_type' => TermRelationshipType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'by_reference' => false,
                'mapped' => false,
                'property_path' => 'termRelationships',
            ])
            ->addEventListener(FormEvents::PRE_SUBMIT, function (PreSubmitEvent $event) {
                $data = $event->getData();
                if (!empty($data['date'])) {
                    $event->getForm()->add('date', DateTimeType::class, [
                        'widget' => 'single_text',
                        'html5' => true,
                        'data' => new DateTime(),
                        'property_path' => 'createdAt',
                        'input_format' => 'Y-m-d H:i:s',
                    ]);
                }
                if (empty($data['parent'])) {
                    $data['parent'] = null;
                }
                if (empty($data['author'])) {
                    $data['author'] = null;
                }
                $data['metas'] = [];
                if (!empty($data['meta'])) {
                    foreach ($data['meta'] as $name => $value) {
                        $data['metas'][] = ['metaKey' => $name, 'metaValue' => $value];
                    }
                }
                unset($data['meta']);
                $event->setData($data);
            });
    }

    /**
     * @param OptionsResolver $resolver
     * @return void
     */
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Post::class,
            'allow_extra_fields' => true,
            'types' => [],
        ]);
    }
}
