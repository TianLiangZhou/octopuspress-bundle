<?php

namespace OctopusPress\Bundle\Scalable;

use OctopusPress\Bundle\Bridge\Bridger;
use Symfony\Component\EventDispatcher\EventDispatcher;

final class Hook
{
    private EventDispatcher $dispatcher;
    private Bridger $bridge;

    public function __construct(Bridger $bridge)
    {
        $this->dispatcher = new EventDispatcher();
        $this->bridge = $bridge;
    }


    /**
     * @param string $name
     * @param callable $callback
     * @param int $priority
     * @return Hook
     */
    public function add(string $name, callable $callback, int $priority = 0)
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
        $args[] = $this->bridge;
        foreach ($listeners as $listener) {
            /**
             * @var callable $listener
             */
            $value = call_user_func_array($listener, $args);
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
        $args[] = $this->bridge;
        foreach ($listeners as $listener) {
            /**
             * @var callable $listener
             */
            call_user_func_array($listener, $args);
        }
    }

    /**
     * @param string $name
     * @param callable $callback
     * @return void
     */
    public function remove(string $name, callable $callback): void
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
