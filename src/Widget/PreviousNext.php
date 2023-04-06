<?php

namespace OctopusPress\Bundle\Widget;

use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use OctopusPress\Bundle\Entity\Post;
use Twig\TemplateWrapper;

class PreviousNext extends AbstractWidget
{

    protected function template(): string|TemplateWrapper
    {
        // TODO: Implement template() method.
        return "";
    }

    /**
     * @throws NonUniqueResultException
     * @throws NoResultException
     */
    protected function context(array $attributes = []): array
    {
        // TODO: Implement context() method.
        if (empty($attributes['entity']) || !$attributes['entity'] instanceof Post) {
            return [
                'previous' => null,
                'next'     => null,
            ];
        }
        $entity = $attributes['entity'];
        $post = $this->getBridger()->getPostRepository();
        $queryBuilder = $post->createQueryBuilder('p')
            ->andWhere('p.id < :id AND p.type = :type AND p.status = :status')
            ->addOrderBy('p.id', 'DESC')
            ->setParameters([
                'id' => $entity->getId(),
                'type' => $entity->getType(),
                'status' => $entity->getStatus(),
            ]);
        $previous = $queryBuilder
            ->getQuery()
            ->setMaxResults(1)
            ->getOneOrNullResult();
        $next = $queryBuilder->where('p.id > :id AND p.type = :type AND p.status = :status')
            ->addOrderBy('p.id', 'ASC')
            ->getQuery()
            ->setMaxResults(1)
            ->getOneOrNullResult();

        return [
            'previous' => $previous,
            'next'     => $next,
        ];

    }

    public function delayRegister(): void
    {
        // TODO: Implement delayRegister() method.
    }
}
