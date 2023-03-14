<?php

namespace OctopusPress\Bundle\Form\Type;

use OctopusPress\Bundle\Form\Model\InstallRequest;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 *
 */
class InstallType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->setMethod(Request::METHOD_POST);
        $builder->add('title', TextType::class)
            ->add('subtitle', TextType::class, ['required' => false])
            ->add('account', TextType::class)
            ->add('password', PasswordType::class)
            ->add('email', EmailType::class);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => InstallRequest::class,
            'csrf_token_id'   => 'install',
            'csrf_field_name' => '_token',
        ]);
    }
}
