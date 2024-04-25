"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useSyncExternalStore,
} from "react";

interface Observer<T> {
  get: () => T;
  set: (value: Partial<T>) => void;
  subscribe: (publish: () => void) => () => void;
}

export function createExternalStore<Store>(init: Store) {
  // Observer
  const useObserver = (): Observer<Store> => {
    const store = useRef(init);
    const subscribers = useRef(new Set<() => void>());

    const get = useCallback(() => store.current, []);
    const set = useCallback((value: Partial<Store>) => {
      store.current = { ...store.current, ...value };
      subscribers.current.forEach((publish) => publish());
    }, []);
    const subscribe = useCallback((publish: () => void) => {
      subscribers.current.add(publish);
      return () => {
        subscribers.current.delete(publish);
      };
    }, []);

    return { get, set, subscribe };
  };

  const Ctx = createContext<Observer<Store> | null>(null);

  const Provider = ({ children }: { children: ReactNode }) => (
    <Ctx.Provider value={useObserver()}>{children}</Ctx.Provider>
  );

  const useStore = <Selector,>(
    selector: (store: Store) => Selector,
  ): [Selector, (value: Partial<Store>) => void] => {
    const store = useContext(Ctx);
    if (!store)
      throw new Error("useStore must be used within the store provider.");

    const state = useSyncExternalStore(
      store.subscribe,
      () => selector(store.get()),
      () => selector(init),
    );

    return [state, store.set];
  };

  return { Provider, useStore };
}
