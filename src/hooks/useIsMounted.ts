import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

export const useIsMounted = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => true, // клиент
    () => false, // сервер
  );
