<?php

namespace OctopusPress\Bundle\CKFinder;

use CKSource\CKFinder\CKFinder;
use CKSource\CKFinder\Event\CKFinderEvent;
use CKSource\CKFinder\Event\CopyFileEvent;
use CKSource\CKFinder\Event\DeleteFileEvent;
use CKSource\CKFinder\Event\DeleteFolderEvent;
use CKSource\CKFinder\Event\EditFileEvent;
use CKSource\CKFinder\Event\FileUploadEvent;
use CKSource\CKFinder\Event\MoveFileEvent;
use CKSource\CKFinder\Event\RenameFolderEvent;
use CKSource\CKFinder\Filesystem\File\EditedFile;
use CKSource\CKFinder\Filesystem\File\File;
use CKSource\CKFinder\Filesystem\File\UploadedFile;
use CKSource\CKFinder\Filesystem\Folder\WorkingFolder;
use CKSource\CKFinder\Plugin\PluginInterface;
use CKSource\CKFinder\Utils;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use League\Flysystem\FileAttributes;
use League\Flysystem\FilesystemException;
use OctopusPress\Bundle\Entity\Post;
use OctopusPress\Bundle\Entity\User;
use OctopusPress\Bundle\Model\PostManager;
use OctopusPress\Bundle\Util\UserAwareInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;

/**
 *
 */
class AttachmentPlugin implements PluginInterface, UserAwareInterface
{
    private ?File $file = null;
    private PostManager $postManager;
    private User $user;
    private CKFinder $finder;
    /**
     * @var array<int|string, string>
     */
    private array $files = [];

    /**
     * @param PostManager $postManager
     */
    public function __construct(PostManager $postManager)
    {
        $this->postManager = $postManager;
    }

    /**
     * @param CKFinder $app
     * @return void
     */
    public function setContainer(CKFinder $app): void
    {
        // TODO: Implement setContainer() method.
        $this->finder = $app;
        $this->finder->on(CKFinderEvent::FILE_UPLOAD, [$this, 'onAttachmentUpload']);
        $this->finder->on(CKFinderEvent::CREATE_RESPONSE_PREFIX . 'fileUpload', [$this, 'onAttachmentUploadResponse']);
        $this->finder->on(CKFinderEvent::CREATE_RESPONSE_PREFIX . 'quickUpload', [$this, 'onAttachmentUploadResponse']);
        $this->finder->on(CKFinderEvent::CREATE_RESPONSE_PREFIX . 'getFiles', [$this, 'onAttachmentGetFilesResponse']);

        $this->finder->on(CKFinderEvent::CREATE_RESPONSE_PREFIX . 'renameFile', [$this, 'onAttachmentRenameFileResponse']);
        $this->finder->on(CKFinderEvent::RENAME_FOLDER, [$this, 'onAttachmentRenameFolder']);
        $this->finder->on(CKFinderEvent::CREATE_RESPONSE_PREFIX . 'renameFolder', [$this, 'onAttachmentRenameFolderResponse']);

        $this->finder->on(CKFinderEvent::MOVE_FILE, [$this, 'onAttachmentMoveFile']);
        $this->finder->on(CKFinderEvent::CREATE_RESPONSE_PREFIX . 'moveFiles', [$this, 'onAttachmentMoveFileResponse']);
        $this->finder->on(CKFinderEvent::COPY_FILE, [$this, 'onAttachmentCopyFile']);
        $this->finder->on(CKFinderEvent::CREATE_RESPONSE_PREFIX . 'copyFiles', [$this, 'onAttachmentCopyFileResponse']);

        $this->finder->on(CKFinderEvent::DELETE_FILE, [$this, 'onAttachmentDeleteFile']);
        $this->finder->on(CKFinderEvent::CREATE_RESPONSE_PREFIX . 'deleteFiles', [$this, 'onAttachmentDeleteFileResponse']);
        $this->finder->on(CKFinderEvent::DELETE_FOLDER, [$this, 'onAttachmentDeleteFolder']);
        $this->finder->on(CKFinderEvent::CREATE_RESPONSE_PREFIX . 'deleteFolder', [$this, 'onAttachmentDeleteFolderResponse']);

        $this->finder->on(CKFinderEvent::SAVE_IMAGE, [$this, 'onAttachmentSaveImage']);
        $this->finder->on(CKFinderEvent::CREATE_RESPONSE_PREFIX . 'saveImage', [$this, 'onAttachmentSaveImageResponse']);
    }

    /**
     * @param User $user
     * @return void
     */
    public function setUser(User $user): void
    {
        // TODO: Implement setUser() method.
        $this->user = $user;
    }

    /**
     * @param FileUploadEvent $event
     * @return void
     */
    public function onAttachmentUpload(FileUploadEvent $event): void
    {
        $this->file = $event->getFile();
    }

    /**
     * @param ViewEvent $event
     * @return void
     * @throws \Doctrine\ORM\ORMException
     * @throws OptimisticLockException
     */
    public function onAttachmentRenameFileResponse(ViewEvent $event): void
    {
        /**
         * @var array{name?:string,newName?:string, renamed?: int} $controllerResult
         */
        $controllerResult = $event->getControllerResult();
        if (empty($controllerResult) || $controllerResult['renamed'] != 1) {
            return ;
        }
        $path = $this->finder->getWorkingFolder()->getPath();
        $file = $path . $controllerResult['name'];
        $newFile = $path . $controllerResult['newName'];
        $attachment = $this->postManager->getPostRepository()->findOneBy([
            'type' => Post::TYPE_ATTACHMENT,
            'guid' => $file,
        ]);
        if ($attachment == null) {
            return ;
        }
        $title = pathinfo($controllerResult['newName'], PATHINFO_FILENAME);
        $attachment->setTitle($title)
            ->setContent($newFile)
            ->setGuid($newFile);
        $this->postManager->save($attachment);
    }

    /**
     * @param RenameFolderEvent $event
     * @return void
     * @throws FilesystemException
     */
    public function onAttachmentRenameFolder(RenameFolderEvent $event): void
    {
        $this->folderFiles($event->getWorkingFolder());
    }

    /**
     * @param WorkingFolder $workingFolder
     * @return void
     * @throws FilesystemException
     */
    private function folderFiles(WorkingFolder $workingFolder): void
    {
        $backend = $workingFolder->getBackend();
        $directoryPath = $backend->buildPath($workingFolder->getResourceType(), $workingFolder->getClientCurrentFolder());
        $contents = $backend->listContents($directoryPath, true);
        $files = [];
        foreach ($contents->getIterator() as $item) {
            if (!$item instanceof FileAttributes) {
                continue;
            }
            $files[] = $item->path();
        }
        $this->files = $files;
    }

    /**
     * @param ViewEvent $event
     * @return void
     * @throws OptimisticLockException
     * @throws \Doctrine\ORM\ORMException
     */
    public function onAttachmentRenameFolderResponse(ViewEvent $event): void
    {
        /**
         * @var array{newName?:string,newPath?:string, renamed?: int} $controllerResult
         */
        $controllerResult = $event->getControllerResult();
        if (empty($controllerResult) || $controllerResult['renamed'] != 1) {
            return ;
        }
        if (count($this->files) < 1) {
            return ;
        }
        $postRepository = $this->postManager->getPostRepository();
        $posts = $postRepository
            ->findBy([
                'type' => Post::TYPE_ATTACHMENT,
                'guid' => $this->files,
            ]);
        foreach ($posts as $index => $post) {
            $content = $post->getContent();
            if (empty($content)) {
                continue;
            }
            $content = str_replace(
                $this->finder->getWorkingFolder()->getClientCurrentFolder(),
                $controllerResult['newPath'],
                $content
            );
            $post->setContent($content)
                ->setGuid($content);
            $postRepository->add($post, $index == count($posts) - 1);
        }
    }

    /**
     * @param MoveFileEvent $event
     * @return void
     */
    public function onAttachmentMoveFile(MoveFileEvent $event): void
    {
        $movedFile = $event->getFile();
        $targetFilePath = $movedFile->getTargetFilePath();
        $filePath = $movedFile->getFilePath();
        $this->files[$filePath] = $targetFilePath;
    }

    /**
     * @param ViewEvent $event
     * @return void
     * @throws OptimisticLockException
     * @throws \Doctrine\ORM\ORMException
     */
    public function onAttachmentMoveFileResponse(ViewEvent $event): void
    {
        /**
         * @var array{moved: int} $controllerResult
         */
        $controllerResult = $event->getControllerResult();
        if (empty($controllerResult['moved']) || count($this->files) != $controllerResult['moved']) {
            return ;
        }
        $postRepository = $this->postManager->getPostRepository();
        $posts = $postRepository->findBy([
            'type' => Post::TYPE_ATTACHMENT,
            'guid' => array_keys($this->files),
        ]);
        foreach ($posts as $index => $post) {
            $guid = $post->getGuid();
            if (!isset($this->files[$guid])) {
                continue;
            }
            $post->setGuid($this->files[$guid])
                ->setContent($this->files[$guid]);
            $postRepository->add($post, count($posts) - 1 == $index);
        }
    }

    /**
     * @param CopyFileEvent $event
     * @return void
     */
    public function onAttachmentCopyFile(CopyFileEvent $event): void
    {
        $this->files[] = $event->getFile()->getTargetFilePath();
    }

    /**
     * @param ViewEvent $event
     * @return void
     * @throws ORMException
     */
    public function onAttachmentCopyFileResponse(ViewEvent $event): void
    {
        /**
         * @var array{copied: int} $controllerResult
         */
        $controllerResult = $event->getControllerResult();
        if ($controllerResult['copied'] != count($this->files)) {
            return ;
        }
        $rootDirectory = rtrim($this->finder->getWorkingFolder()->getBackend()->getRootDirectory() ?? '', '\\/');
        foreach ($this->files as $file) {
            if ($this->insertAttachment($rootDirectory, $file) < 1) {
                $controllerResult['copied']--;
                if (file_exists($rootDirectory . DIRECTORY_SEPARATOR . $file)) {
                    unlink($rootDirectory . DIRECTORY_SEPARATOR . $file);
                }
            }
        }
        $event->setControllerResult($controllerResult);
    }

    /**
     * @param DeleteFileEvent $event
     * @return void
     */
    public function onAttachmentDeleteFile(DeleteFileEvent $event): void
    {
        $this->files[] = $event->getFile()->getFilePath();
    }

    /**
     * @param ViewEvent $event
     * @return void
     */
    public function onAttachmentDeleteFileResponse(ViewEvent $event): void
    {
        /**
         * @var array{deleted:int} $controllerResult
         */
        $controllerResult = $event->getControllerResult();
        if (empty($controllerResult['deleted']) || count($this->files) != $controllerResult['deleted']) {
            return ;
        }
        $this->deleteFiles();
    }

    /**
     * @param DeleteFolderEvent $event
     * @return void
     * @throws FilesystemException
     */
    public function onAttachmentDeleteFolder(DeleteFolderEvent $event): void
    {
        $this->folderFiles($event->getWorkingFolder());
    }

    /**
     * @param ViewEvent $event
     * @return void
     */
    public function onAttachmentDeleteFolderResponse(ViewEvent $event): void
    {
        /**
         * @var array{deleted: int} $controllerResult
         */
        $controllerResult = $event->getControllerResult();
        if (empty($controllerResult['deleted'])) {
            return ;
        }
        $this->deleteFiles();
    }

    /**
     * @param EditFileEvent $fileEvent
     * @return void
     */
    public function onAttachmentSaveImage(EditFileEvent $fileEvent): void
    {
        $this->file = $fileEvent->getFile();
    }

    /**
     * @param ViewEvent $event
     * @return void
     * @throws ORMException
     */
    public function onAttachmentSaveImageResponse(ViewEvent $event): void
    {
        if (!$this->file instanceof EditedFile) {
            return ;
        }
        /**
         * @var array{saved: int, date: int, size: int} $controllerResult
         */
        $controllerResult = $event->getControllerResult();
        if (empty($controllerResult['saved']) || !$this->file->isSaveAsNew()) {
            return ;
        }
        $rootDirectory = rtrim($this->file->getWorkingFolder()->getBackend()->getRootDirectory() ?? '', '\\/');
        $id = $this->insertAttachment($rootDirectory, $this->file->getFilePath());
        $file = $rootDirectory . DIRECTORY_SEPARATOR . $this->file->getFilePath();
        $controllerResult['file'] = [
            'name' => $this->file->getFilename(),
            'date' => Utils::formatDate(filemtime($file)?: 0),
            'size' => Utils::formatDate(filesize($file) ?: 0),
            'id'   => $id,
        ];
        $event->setControllerResult($controllerResult);
    }

    /**
     * @return void
     */
    private function deleteFiles(): void
    {
        $repository = $this->postManager->getPostRepository();
        $repository->createQueryBuilder('p')
            ->andWhere('p.type = :type')
            ->setParameter('type', Post::TYPE_ATTACHMENT)
            ->andWhere('p.guid IN (:guid)')
            ->setParameter('guid', $this->files, Connection::PARAM_STR_ARRAY)
            ->delete()
            ->getQuery()
            ->execute();
    }

    /**
     * @param ViewEvent $event
     * @return void
     */
    public function onAttachmentGetFilesResponse(ViewEvent $event): void
    {
        /**
         * @var \stdClass $object
         */
        $object = $event->getControllerResult();
        if (empty($object->files) || ($workingFolder = $this->finder->getWorkingFolder()) == null) {
            return ;
        }
        $path = $workingFolder->getPath();

        $files = array_map(function ($item) use ($path) {
            return $path . $item['name'];
        }, $object->files);
        $fileMaps = array_flip($files);
        $posts = $this->postManager->getPostRepository()->findBy([
            'type' => Post::TYPE_ATTACHMENT,
            'content' => $files,
        ]);
        $newFiles = [];
        foreach ($posts as $post) {
            $filename = $post->getContent();
            if (isset($fileMaps[$filename])) {
                $fileArray = $object->files[$fileMaps[$filename]];
                $fileArray['id'] = $post->getId();
                $newFiles[] = $fileArray;
            }
        }
        $object->files = $newFiles;
        $event->setControllerResult($object);
    }

    /**
     * @param ViewEvent $event
     * @return void
     * @throws ORMException|\Doctrine\ORM\ORMException
     */
    public function onAttachmentUploadResponse(ViewEvent $event): void
    {
        $response = $event->getControllerResult();
        if (!$this->file instanceof UploadedFile || ($workingFolder = $this->finder->getWorkingFolder()) == null) {
            return ;
        }
        if (!isset($response['uploaded']) || $response['uploaded'] !== 1) {
            return ;
        }
        $rootDirectory = rtrim($workingFolder->getBackend()->getRootDirectory() ?? '', '\\/');
        $filePath = sprintf('%s%s', $workingFolder->getPath(), $response['fileName']);
        $id = $this->insertAttachment($rootDirectory, $filePath);
        $file = $rootDirectory . DIRECTORY_SEPARATOR . $filePath;
        $response['file'] = [
            'name' => $response['fileName'],
            'date' => Utils::formatDate(filemtime($file)?: 0),
            'size' => Utils::formatDate(filesize($file) ?: 0),
            'id'   => $id,
        ];
        $event->setControllerResult($response);
    }


    /**
     * @param string $rootDirectory
     * @param string $filename
     * @return int
     * @throws OptimisticLockException
     * @throws \Doctrine\ORM\ORMException
     */
    private function insertAttachment(string $rootDirectory, string $filename): int
    {
        $file = $rootDirectory . DIRECTORY_SEPARATOR . $filename;
        return $this->postManager->saveAttachment($file, $filename, $this->user);
    }

    /**
     * @return array<string, mixed>
     */
    public function getDefaultConfig(): array
    {
        // TODO: Implement getDefaultConfig() method.
        return [];
    }
}
