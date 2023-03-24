<?php
declare(strict_types=1);

namespace OctopusPress\Bundle\Controller\Admin;

use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException as ORMExceptionAlias;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Entity\Option;
use OctopusPress\Bundle\Repository\OptionRepository;
use OctopusPress\Bundle\Util\Formatter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class SiteController
 * @package App\Controller\Backend
 */
#[Route('/site', name: 'setting_')]
class SiteController extends AdminController
{
    private OptionRepository $repository;

    public function __construct(Bridger $bridger)
    {
        parent::__construct($bridger);
        $this->repository = $bridger->getOptionRepository();
    }

    /**
     * @return JsonResponse
     */
    #[Route('/basic', name: 'site_basic')]
    public function basic(): JsonResponse
    {
        $map = $this->query($this->repository::$defaultGeneralNames);
        if (empty($map['timezone'])) {
            $map['timezone'] = date_default_timezone_get();
        }
        return $this->json([
            'timezone' => timezone_identifiers_list(),
            'option' => $map,
        ]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws ORMException
     * @throws OptimisticLockException
     */
    #[Route('/basic/save', name: 'site_basic_save', options: ['name' => '保存基础配置', 'parent' => 'setting_option'], methods: Request::METHOD_POST)]
    public function basicSave(Request $request): JsonResponse
    {
        return $this->save($request->toArray(), $this->repository::$defaultGeneralNames);
    }

    /**
     * @return JsonResponse
     */
    #[Route('/media', name: 'site_media')]
    public function media(): JsonResponse
    {
        return $this->json([
            'option' => $this->query($this->repository::$defaultMediaNames),
        ]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws ORMException
     * @throws OptimisticLockException
     */
    #[Route('/media/save', name: 'site_media_save', options: ['name' => '保存媒体配置', 'parent' => 'setting_option'], methods: Request::METHOD_POST)]
    public function mediaSave(Request $request): JsonResponse
    {
        return $this->save($request->toArray(), $this->repository::$defaultMediaNames);
    }

    /**
     * @return JsonResponse
     */
    #[Route('/content', name: 'content')]
    public function content(): JsonResponse
    {
        $query = $this->query($this->repository::$defaultContentNames);
        if (empty($query['permalink_structure'])) {
            $query['permalink_structure'] = 'post_permalink_normal';
        }
        return $this->json([
            'option' => $query,
        ]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws ORMException
     * @throws OptimisticLockException
     */
    #[Route('/content/save', name: 'content_save', options: ['name' => '保存站点内容配置', 'parent' => 'setting_option'], methods: Request::METHOD_POST)]
    public function contentSave(Request $request): JsonResponse
    {
        $names = $this->repository::$defaultContentNames;
        unset($names[0], $names[1]);
        return $this->save($request->toArray(), $names);
    }

    /**
     * @param array $names
     * @return array
     */
    private function query(array $names): array
    {
        $options = $this->repository->findBy(['name' => $names,]);
        $map = [];
        foreach ($options as $option) {
            $map[$option->getName()] = $option->getValue();
        }
        foreach ($names as $name) {
            $map[$name] = Formatter::reverseTransform($map[$name] ?? '');
        }
        return $map;
    }

    /**
     * @param array $options
     * @param array $names
     * @return JsonResponse
     * @throws ORMException
     * @throws OptimisticLockException
     */
    private function save(array $options, array $names): JsonResponse
    {
        $collection = $this->repository->findBy(['name' => $names]);
        $entityManager = $this->getEM();
        foreach ($names as $name) {
            $item = null;
            foreach ($collection as $option) {
                if ($option->getName() == $name) {
                    $item = $option;
                    break;
                }
            }
            if ($item == null) {
                $item = new Option();
            }
            $item->setName($name)->setValue($options[$name]);
            $entityManager->persist($item);
        }
        $this->getEM()->flush();
        return $this->json([
        ]);
    }
}
