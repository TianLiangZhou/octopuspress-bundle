<?php

namespace OctopusPress\Bundle\Scalable;

use OctopusPress\Bundle\Bridge\Bridger;
use OctopusPress\Bundle\Event\FilterEvent;
use Symfony\Component\EventDispatcher\EventDispatcher;

final class Hook
{
    private EventDispatcher $dispatcher;
    private Bridger $bridger;

    public function __construct(Bridger $bridger)
    {
        $this->dispatcher = new EventDispatcher();
        $this->bridger = $bridger;
    }


    /**
     * @param string $name
     * @param callable|array $callback
     * @param int $priority
     * @return Hook
     */
    public function add(string $name, callable|array $callback, int $priority = 0): Hook
    {
        $this->dispatcher->addListener($name, $callback, $priority);
        return $this;
    }

    /**
     * @param string $name
     * @param mixed $value
     * @param mixed ...$args
     * @return mixed
     */
    public function filter(string $name, mixed $value, mixed ...$args): mixed
    {
        $listeners = $this->dispatcher->getListeners($name);
        if (empty($listeners)) {
            return $value;
        }
        array_unshift($args, $value);
        $event = new FilterEvent($this->bridger);
        $args[] = $event;
        foreach ($listeners as $listener) {
            /**
             * @var callable $listener
             */
            $value = call_user_func_array($listener, $args);
            if ($event->isPropagationStopped()) {
                return $value;
            }
            $args[0] = $value;
        }
        return $value;
    }

    /**
     * @param string $name
     * @param mixed ...$args
     * @return void
     */
    public function action(string $name, mixed ...$args): void
    {
        $listeners = $this->dispatcher->getListeners($name);
        if (empty($listeners)) {
            return ;
        }
        $event = new FilterEvent($this->bridger);
        $args[] = $event;
        foreach ($listeners as $listener) {
            if ($event->isPropagationStopped()) {
                break;
            }
            /**
             * @var callable $listener
             */
            call_user_func_array($listener, $args);
        }
    }

    /**
     * @param string $name
     * @param callable|array $callback
     * @return void
     */
    public function remove(string $name, callable|array $callback): void
    {
        $this->dispatcher->removeListener($name, $callback);
    }

    /**
     * @param string $name
     * @return bool
     */
    public function has(string $name): bool
    {
        return $this->dispatcher->hasListeners($name);
    }
}
