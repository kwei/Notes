"use client";

import { createExternalStore } from "@/utils/createExternalStore";
import { createContext, ReactNode, useContext, useMemo } from "react";

export function createExternalStoreProvider<Store>(init: Store) {
  const { Provider, useStore } = createExternalStore(init);
  const Ctx = createContext({ useStore });

  const CtxProvider = ({ children }: { children: ReactNode }) => (
    <Provider>
      <Ctx.Provider value={useMemo(() => ({ useStore }), [])}>
        {children}
      </Ctx.Provider>
    </Provider>
  );

  const useCtx = () => useContext(Ctx);

  return { Provider: CtxProvider, useStoreCtx: useCtx };
}
