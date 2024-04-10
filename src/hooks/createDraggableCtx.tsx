"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

export function createDraggableCtx<D>() {
  const Ctx = createContext<{
    dragged?: D;
    setDragged: (target?: D) => void;
  }>({
    dragged: undefined,
    setDragged: (target?: D) => {},
  });

  const CtxProvider = ({ children }: { children: ReactNode }) => {
    const [dragged, setDragged] = useState<D>();

    const updateDragged = useCallback((target?: D) => {
      setDragged(target);
    }, []);

    const value = useMemo(
      () => ({
        dragged,
        setDragged: updateDragged,
      }),
      [dragged, updateDragged],
    );
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
  };

  return {
    CtxProvider,
    Ctx,
  };
}
