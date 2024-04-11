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
    updated?: D;
    setDragged: (target?: D) => void;
    setUpdated: (target?: D) => void;
  }>({
    dragged: undefined,
    updated: undefined,
    setDragged: (target?: D) => {},
    setUpdated: (target?: D) => {},
  });

  const CtxProvider = ({ children }: { children: ReactNode }) => {
    const [dragged, setDragged] = useState<D>();
    const [updated, setUpdated] = useState<D>();

    const updateDragged = useCallback((target?: D) => {
      setDragged(target);
    }, []);

    const updateUpdated = useCallback((target?: D) => {
      setUpdated(target);
    }, []);

    const value = useMemo(
      () => ({
        dragged,
        updated,
        setDragged: updateDragged,
        setUpdated: updateUpdated,
      }),
      [dragged, updateDragged, updateUpdated, updated],
    );
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
  };

  return {
    CtxProvider,
    Ctx,
  };
}
