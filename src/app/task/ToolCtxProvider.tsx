"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export const ToolCtxProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const handleSetSelectedTag = useCallback((tag: string) => {
    setSelectedTag(tag);
  }, []);

  const handleSetSelectedPeriod = useCallback((period: string) => {
    setSelectedPeriod(period);
  }, []);

  const contextValue = useMemo(
    () => ({
      selectedTag,
      selectedPeriod,
      setSelectedTag: handleSetSelectedTag,
      setSelectedPeriod: handleSetSelectedPeriod,
    }),
    [
      handleSetSelectedPeriod,
      handleSetSelectedTag,
      selectedPeriod,
      selectedTag,
    ],
  );

  return <ToolCtx.Provider value={contextValue}>{children}</ToolCtx.Provider>;
};

const ToolCtx = createContext({
  selectedTag: "",
  setSelectedTag: (tag: string) => {},
  selectedPeriod: "",
  setSelectedPeriod: (period: string) => {},
});

export const useTollCtx = () => useContext(ToolCtx);
