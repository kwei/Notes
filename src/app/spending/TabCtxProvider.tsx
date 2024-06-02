"use client";
import { SPENDING_PAGE_TAB } from "@/utils/constants";
import { createContext, ReactNode, useContext, useState } from "react";

export const TabCtxProvider = ({ children }: { children: ReactNode }) => {
  const [tab, setTab] = useState(SPENDING_PAGE_TAB.DEFAULT);
  return (
    <TabHandlerCtx.Provider value={{ setTab }}>
      <TabCtx.Provider value={{ tab }}>{children}</TabCtx.Provider>
    </TabHandlerCtx.Provider>
  );
};

const TabCtx = createContext({
  tab: SPENDING_PAGE_TAB.DEFAULT,
});

export const useTabCtx = () => useContext(TabCtx);

const TabHandlerCtx = createContext({
  setTab: (tab: SPENDING_PAGE_TAB) => {},
});

export const useTabHandlerCtx = () => useContext(TabHandlerCtx);
