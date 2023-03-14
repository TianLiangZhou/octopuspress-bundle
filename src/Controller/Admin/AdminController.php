<?php
declare(strict_types=1);


namespace OctopusPress\Bundle\Controller\Admin;



use InvalidArgumentException;
use OctopusPress\Bundle\Controller\Controller;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 *
 */
abstract class AdminController extends Controller
{

    /**
     * @param string $formType
     * @param object $entity
     * @param array $formData
     * @param array $options
     * @return JsonResponse|null
     */
    protected function validResponse(string $formType, object $entity, array $formData, array $options = []): ?JsonResponse
    {
        try {
            $this->validation($formType, $entity, $formData, $options);
        } catch (\Throwable $exception) {
            return $this->json(['message' => $exception->getMessage()], Response::HTTP_NOT_ACCEPTABLE);
        }
        return null;
    }

    /**
     * @param string $formType
     * @param object $entity
     * @param array $formData
     * @param array $options
     * @return FormInterface
     */
    protected function validation(string $formType, object $entity, array $formData, array $options = []): FormInterface
    {
        if ($this->container->has('security.csrf.token_manager')) {
            $options['csrf_protection'] = false;
        }
        $form = $this->createForm($formType, $entity, $options);
        $form->submit($formData);
        if (!$form->isValid()) {
            $errorArray = [];
            foreach ($form->getErrors(true) as $error) {
                $errorArray[] =  $error->getMessage();
            }
            throw new InvalidArgumentException(implode(';', $errorArray));
        }
        return $form;
    }
}
