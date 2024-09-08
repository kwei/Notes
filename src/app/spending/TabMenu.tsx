"use client";

import { useGetHash } from "@/hooks/useGetHash";
import { SPENDING_PAGE_TAB } from "@/utils/constants";
import { ReactNode, useCallback } from "react";

export const TabMenu = ({ tab, children }: { tab: SPENDING_PAGE_TAB; children: ReactNode }) => {
  const currentTab = useGetHash();
  const handleOnClick = useCallback(() => {
    window.history.pushState(
      null,
      "",
      `${window.location.origin}${window.location.pathname}#${tab}`,
    );
  }, [tab]);

  return (
    <button
      className={`flex flex-1 items-center justify-center py-2 transition-all ${tab === currentTab ? "bg-gray-d0-500/70 text-gray-800" : "hover:bg-gray-d0-500/70 hover:text-gray-800"}`}
      onClick={handleOnClick}
    >
      {children}
    </button>
  );
};
