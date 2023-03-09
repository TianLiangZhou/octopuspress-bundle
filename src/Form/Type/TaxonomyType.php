<?php
declare(strict_types=1);
namespace OctopusPress\Bundle\Form\Type;

use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\Term;
use OctopusPress\Bundle\Entity\TermTaxonomy;
use OctopusPress\Bundle\Util\Formatter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\Event\PreSubmitEvent;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TaxonomyType extends AbstractType
{
    private EntityManagerInterface $entityManager;
    private Bridger $bridger;

    public function __construct(EntityManagerInterface $entityManager, Bridger $bridger)
    {
        $this->entityManager = $entityManager;
        $this->bridger = $bridger;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $names = $this->bridger->getTaxonomy()->getNames();
        $builder->add('description', TextType::class, ['required' => false, 'empty_data' => ''])
            ->add('parent', EntityType::class, [
                'required' => false,
                'empty_data' => null,
                'class' => TermTaxonomy::class,
                'choice_value' => 'id',
            ])
            ->add('term', TermType::class)
            ->add('taxonomy', ChoiceType::class, [
                'choices' => array_combine($names, $names),
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
                $data['term'] = [
                    'name' => trim($data['name']),
                    'slug' => Formatter::sanitizeWithDashes(trim($data['slug'])),
                ];
                if (!isset($data['parent']) || !is_numeric($data['parent']) || $data['parent'] < 1) {
                    $data['parent'] = null  ;
                }
                $data['metas'] = [];
                if (!empty($data['meta'])) {
                    foreach ($data['meta'] as $name => $value) {
                        $data['metas'][]  = ['metaKey' => $name, 'metaValue' => $value];
                    }
                }
                unset($data['meta']);
                $form->setData($data);
            });

        $builder->get('term')->addModelTransformer(
            new CallbackTransformer(
                function ($value) {
                    return $value;
                },
                function (Term $term) {
                    $id = $term->getId();
                    $repository = $this->entityManager->getRepository(Term::class);
                    if ($id == null) {
                        $findName = $repository->findOneBy([
                            'name' => $term->getName(),
                            'slug' => $term->getSlug(),
                        ]);
                        if ($findName != null) {
                            return $findName;
                        }
                    }
                    $identical = $repository->findOneBy(['slug' => $term->getSlug()]);
                    if ($identical) {
                        if ($id == null || ($identical->getId() != $id)) {
                            throw new \InvalidArgumentException("已存在相同的别名");
                        }
                    }
                    return $term;
                }
            )
        );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => TermTaxonomy::class,
            'allow_extra_fields' => true,
        ]);
    }
}
