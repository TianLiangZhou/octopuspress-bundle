<?php

namespace OctopusPress\Bundle\Repository;

use OctopusPress\Bundle\Entity\Role;
use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Entity\UserMeta;
use OctopusPress\Bundle\Util\RepositoryTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    use RepositoryTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(User $entity, bool $flush = true): void
    {
        $this->_em->persist($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function remove(User $entity, bool $flush = true): void
    {
        $this->_em->remove($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    public function managers(array $filters): array
    {
        $queryBuilder = $this->createQueryBuilder('a');

        $this->addFilters($queryBuilder, $filters);
        /**
         * @var $managers array<int, User>
         */
        $managers = $queryBuilder->leftJoin(
            UserMeta::class,
            'm',
            Join::WITH,
            'a.id = m.userId'
        )
        ->andWhere('m.metaKey = :name')
        ->setParameter('name', 'roles')
        ->getQuery()
        ->getResult();
        if (empty($managers)) {
            return [];
        }
        $collection = [];

        foreach ($managers as $manager) {
            $meta = $manager->getMeta('roles');
            if ($meta == null || empty($roleArray = $meta->getMetaValue())) {
                continue;
            }
            $roleQueryBuilder = $this->_em->createQueryBuilder();
            $roles = $roleQueryBuilder->select('r')
                ->from(Role::class, 'r')
                ->add('where', $queryBuilder->expr()->in('r.id', $roleArray))
                ->getQuery()
                ->getResult();
            $collection[] = array_merge(
                $manager->jsonSerialize(),
                [
                    'roles' => array_map(function (Role $item) {return $item->getId();}, $roles),
                    'roleName' => implode(',', array_map(function (Role $item) {return $item->getName();}, $roles))
                ]
            );
        }

        return $collection;
    }



    // /**
    //  * @return User[] Returns an array of User objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
    private function addFilters(QueryBuilder $qb, array $filters): void
    {
        // TODO: Implement addFilters() method.

        foreach ($filters as $name => $value) {
            if (null === $value) {
                continue;
            }
            switch ($name) {
                case 'id':
                case 'email':
                case 'account':
                    $qb->andWhere("a.$name = :$name");
                    break;
                case 'nickname':
                    $qb->andWhere($qb->expr()->like('a.' . $name, ':' . $name));
                    $value = $value . '%';
                    break;
                default:
                    continue 2;
            }
            $qb->setParameter($name, $value);
        }

    }

    /**
     * @param array<int, User> $records
     * @return array
     */
    public function handleRecords(array $records): array
    {
        // TODO: Implement handleRecords() method.
        $users = [];
        foreach ($records as $record) {
            $users[] = $record->jsonSerialize();
        }
        return $users;
    }
}
