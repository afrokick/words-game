import { onMount } from 'svelte';
import { GameEventBus } from './gameEventBus';

type EventsKeys = keyof typeof GameEventBus;

export function onEvent<T extends EventsKeys>(key: T, callback: Parameters<(typeof GameEventBus[T])['on']>[0]) {
  onMount(() => GameEventBus[key].on(callback as any));
}
