<?php
declare(strict_types=1);
namespace OctopusPress\Bundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Event\PreSubmitEvent;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SiteOptionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('collection', CollectionType::class, [
                'entry_type' => OptionType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'by_reference' => false,
            ])
            ->addEventListener(FormEvents::PRE_SUBMIT, function (PreSubmitEvent $event) {
                $data = $event->getData();
                $options = [];
                foreach ($data as $key => $value) {
                    $options[] = ['name' => $key, 'value' => $value];
                }
                $data = ['collection' => $options];
                $event->setData($data);
            });
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => \stdClass::class,
            'allow_extra_fields' => true,
        ]);
    }
}
