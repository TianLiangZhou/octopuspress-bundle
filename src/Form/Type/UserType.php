<?php
declare(strict_types=1);
namespace OctopusPress\Bundle\Form\Type;

use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Util\Formatter;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Event\PreSubmitEvent;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        if (!$options['is_update']) {
            $builder->add('account', TextType::class);
        }
        $builder->add('nickname', TextType::class)
            ->add('password', PasswordType::class)
            ->add('avatar', TextType::class, ['required' => false, 'empty_data' => ''])
            ->add('email', EmailType::class)
            ->add('url', UrlType::class, ['required' => false, 'empty_data' => ''])
            ->add('roles', CollectionType::class, [
                'required' => false,
                'allow_add' => true,
                'allow_delete' => true,
                'by_reference' => false,
            ])
            ->add('metas', CollectionType::class, [
                'entry_type' => UserMetaType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'by_reference' => false,
                'required' => false,
                'mapped' => false,
            ])
        ;
        $builder->addEventListener(FormEvents::PRE_SUBMIT, function (PreSubmitEvent $event) use ($options) {
            $data = $event->getData();
            if (empty($data['password']) && $options['is_update']) {
                unset($data['password']);
                $event->getForm()->remove("password");
            }
            if (!empty($data['roles']) && is_array($data['roles'])) {
                $data['roles'] = array_map('intval', $data['roles']);
            }
            $data['metas'] = [];
            if (!empty($data['meta'])) {
                foreach ($data['meta'] as $name => $value) {
                    $data['metas'][] = ['metaKey' => $name, 'metaValue' => Formatter::transform($value),];
                }
            }
            $event->setData($data);
        });
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'allow_extra_fields' => true,
            'is_update' => false,
        ]);
    }
}
