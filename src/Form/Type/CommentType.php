<?php
declare(strict_types=1);
namespace OctopusPress\Bundle\Form\Type;

use OctopusPress\Bundle\Entity\Comment;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CommentType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('content', TextType::class, ['required' => false, 'empty_data' => ''])
            ->add('email', EmailType::class, [
                'required' => false,
                'empty_data' => '',
                'property_path' => 'authorEmail'
            ])
            ->add('author', TextType::class, [
                'required' => false,
                'empty_data' => '',
            ])
            ->add('url', UrlType::class, [
                'required' => false,
                'empty_data' => '',
                'property_path' => 'authorUrl'
            ])
            ->add('approved', ChoiceType::class, [
                'choices' => array_combine(Comment::STATUS, Comment::STATUS),
                'data' => Comment::UNAPPROVED,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Comment::class,
            'allow_extra_fields' => true,
        ]);
    }
}
