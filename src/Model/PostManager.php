<?php

namespace OctopusPress\Bundle\Model;

use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectRepository;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\PostMeta;
use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Event\OctopusEvent;
use OctopusPress\Bundle\Event\PostEvent;
use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Repository\PostMetaRepository;
use OctopusPress\Bundle\Repository\PostRepository;
use OctopusPress\Bundle\Util\Formatter;
use OctopusPress\Bundle\Util\Image;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Mime\MimeTypes;
use function Symfony\Component\String\b;

class PostManager
{
    private EventDispatcherInterface $dispatcher;
    private LoggerInterface $logger;
    private ManagerRegistry $managerRegistry;
    private Bridger $bridger;
    private PostRepository $repository;
    private PostMetaRepository $metaRepository;

    public function __construct(
        EventDispatcherInterface $dispatcher,
        LoggerInterface $logger,
        ManagerRegistry $managerRegistry,
        Bridger $bridger
    ) {
        $this->dispatcher = $dispatcher;
        $this->logger = $logger;
        $this->bridger = $bridger;
        $this->managerRegistry = $managerRegistry;
        $this->repository = $bridger->getPostRepository();
        $this->metaRepository = $bridger->getPostMetaRepository();
    }

    /**
     * @param Post $post
     * @param string $oldStatus
     * @return bool
     */
    public function save(Post $post, string $oldStatus): bool
    {
        try {
            if ($post->getId() != null) {
                $post->setModifiedAt(new \DateTime());
            }
            if ($post->getStatus() == Post::STATUS_PUBLISHED) {
                $createdAt = $post->getCreatedAt();
                if ($createdAt->getTimestamp() > time()) {
                    $post->setStatus(Post::STATUS_FUTURE);
                }
            }
            $postSaveBeforeEvent = new PostEvent($post, $oldStatus);
            $this->dispatcher->dispatch($postSaveBeforeEvent, OctopusEvent::POST_SAVE_BEFORE);
            $name = $post->getName();
            if (empty($name)) {
                $name = Formatter::sanitizeWithDashes($post->getTitle());
            } else {
                $checkName = Formatter::sanitizeWithDashes($name);
                if ($checkName != $name) {
                    $name = $checkName;
                }
            }
            $post->setName($this->getUniquePostSlug($name, $post));
            $doctrine = $this->managerRegistry->getManager();
            $doctrine->persist($post);
            $doctrine->flush();
            $this->bridger->getRelationRepository()
                ->createQueryBuilder('tr')
                ->andWhere('tr.post = :post AND tr.status != :status')
                ->setParameter('post', $post->getId())
                ->setParameter('status', $post->getStatus())
                ->set('status', $post->getStatus())
                ->update()
                ->getQuery()
                ->execute();
            $postSaveAfterEvent = new PostEvent($post, $oldStatus);
            $this->dispatcher->dispatch($postSaveAfterEvent, OctopusEvent::POST_SAVE_AFTER);
            return true;
        } catch (\Exception $_) {
            $this->logger->error('Save post error: %s', [$_->getMessage()]);
            return false;
        }
    }

    /**
     * @param string $name
     * @param Post $post
     * @return string
     * @throws NonUniqueResultException
     */
    private function getUniquePostSlug(string $name, Post $post): string
    {
        $queryBuilder = $this->repository->createQueryBuilder('p');
        $queryBuilder->andWhere('p.name = :name')
            ->setParameter('name', $name);
        if ($post->getId() != null) {
            $queryBuilder->andWhere('p.id != :id')->setParameter('id', $post->getId());
        }
        $other = $queryBuilder->getQuery()->getOneOrNullResult();
        if ($other != null) {
            $suffix = 2;
            do {
                $altPostName = $name . "-$suffix";
                $queryBuilder->setParameter('name', $altPostName);
                $other = $queryBuilder->getQuery()->getOneOrNullResult();
                $suffix++;
            } while ($other);
            $name = $altPostName;
        }
        return $name;
    }

    /**
     * @param Post[] $posts
     * @return void
     */
    public function delete(array $posts): void
    {
        if (empty($posts)) {
            return ;
        }
        try {
            foreach ($posts as $i => $post) {
                $this->repository->remove($post, (count($posts) - 1) === $i);
                $postDeleteEvent = new PostEvent($post, '');
                $this->dispatcher->dispatch($postDeleteEvent, OctopusEvent::POST_DELETE);
            }
        } catch (\Throwable $throwable) {
            $this->logger->error('Delete failed: ' . $throwable->getMessage());
        }
    }

    /**
     * @param string $file
     * @param string $filename
     * @param User $user
     * @return int
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function saveAttachment(string $file, string $filename, User $user): int
    {
        $mimeType =  MimeTypes::getDefault()->guessMimeType($file);
        $post = new Post();
        $post->setTitle(pathinfo($file, PATHINFO_FILENAME));
        $post->setAuthor($user);
        $post->setType(Post::TYPE_ATTACHMENT);
        $post->setMimeType($mimeType);
        $post->setContent($filename);
        $post->setPingStatus(Post::CLOSED);
        $post->setStatus(Post::STATUS_INHERIT);
        $post->setGuid($filename);
        $post->setParent(null);
        if ($this->save($post, '')) {
            $metadata = $this->generateAttachmentMetadata($post, $file);
            $meta = new PostMeta();
            $meta->setPost($post)
                ->setMetaKey('_attachment_metadata')
                ->setMetaValue($metadata);
            $metaFile = new PostMeta();
            $metaFile->setPost($post)
                ->setMetaKey('_wp_attached_file')
                ->setMetaValue($filename);
            $this->metaRepository->add($metaFile, false);
            $this->metaRepository->add($meta);
            return $post->getId();
        }
        return 0;
    }

    /**
     * @param Post $attachment
     * @param string $file
     * @return array
     */
    private function generateAttachmentMetadata(Post $attachment, string $file): array
    {
        $mimeType = $attachment->getMimeType();
        $metadata = [];
        if (str_starts_with($mimeType, 'image/')) {
            // Make thumbnails and other intermediate sizes.
            $metadata = $this->createImageSubsizes($file, $attachment->getContent());
        } elseif (str_starts_with($mimeType, 'video/')) {
            $metadata = $this->readVideoMetadata($file);
        } elseif (str_starts_with($mimeType, 'audio/')) {
            $metadata = $this->readAudioMetadata($file);
        }
        if (!isset($metadata['filesize'])) {
            $metadata['filesize'] = filesize($file);
        }
        return $metadata;
    }


    /**
     * @param string $file
     * @param string $filename
     * @return array
     */
    private function createImageSubsizes(string $file, string $filename): array
    {
        $imageInfo = getimagesize($file);
        if (empty($imageInfo)) {
            return [];
        }
        $imageMeta = array(
            'width'    => $imageInfo[0],
            'height'   => $imageInfo[1],
            'file'     => $filename,
            'filesize' => filesize($file),
            'sizes'    => array(),
        );
        $sizes = $this->bridger->getMedia()->getRegisteredImageSubsizes();
        $this->makeImageSubsizes($sizes, $imageMeta, $file);
        return $imageMeta;
    }

    /**
     * @param string $file
     * @return array
     */
    private function readVideoMetadata(string $file): array
    {
        return [];
    }

    /**
     * @param string $file
     * @return array
     */
    private function readAudioMetadata(string $file): array
    {
        return [];
    }

    /**
     * @param array $sizes
     * @param array $metaData
     * @param string $file
     * @return void
     */
    private function makeImageSubsizes(array $sizes, array &$metaData, string $file): void
    {
        if (empty($metaData)) {
            return ;
        }
        if (is_array($metaData['sizes'])) {
            foreach ($metaData['sizes'] as $sizeName => $sizeMeta) {
                if (array_key_exists($sizeName, $sizes)) {
                    unset($sizes[$sizeName]);
                }
            }
        } else {
            $metaData['sizes'] = [];
        }
        if (empty($sizes)) {
            return ;
        }
        $imageData = file_get_contents($file);
        foreach ($sizes as $sizeName => $sizeData) {
            try {
                $image = Image::create($imageData);
            } catch (\Throwable $exception) {
                continue;
            }
            if ($image->resizeCrop($sizeData['width'], $sizeData['height'], $sizeData['crop'], 100) == null) {
                continue;
            }
            $pathInfo = pathinfo($metaData['file']);
            $newFilename = sprintf(
                '%s/%s-%dx%d.%s',
                $pathInfo['dirname'],
                $pathInfo['filename'],
                $sizeData['width'],
                $sizeData['height'],
                $pathInfo['extension']
            );
            $newFile = str_replace($metaData['file'], $newFilename, $file);
            if (!$image->save($newFile)) {
                continue;
            }
            $metaData['sizes'][$sizeName] = [
                'file'     => $newFilename,
                'filesize' => $image->getDataSize(),
                'width'    => $image->getWidth(),
                'height'   => $image->getHeight(),
                'mime_type'=> $image->getMimeType(),
            ];
            $image = null;
        }

    }

    /**
     * @return PostRepository
     */
    public function getPostRepository(): ObjectRepository
    {
        return $this->repository;
    }
}
