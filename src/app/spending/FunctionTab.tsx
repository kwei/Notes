"use client";

import { useGetHash } from "@/hooks/useGetHash";
import {
  SPENDING_PAGE_TAB,
  SPENDING_PAGE_TAB_LABEL,
  SPENDING_PAGE_TABS,
} from "@/utils/constants";
import { useCallback } from "react";

export const FunctionTab = () => {
  const tab = useGetHash();
  return (
    <div className="mt-8 flex w-full items-center justify-center divide-x divide-gray-d0-500 border border-solid border-gray-d0-500">
      {SPENDING_PAGE_TABS.map((_tab) => (
        <TabItem key={_tab} tab={_tab} selected={_tab === tab} />
      ))}
    </div>
  );
};

const TabItem = ({
  tab,
  selected,
}: {
  tab: SPENDING_PAGE_TAB;
  selected: boolean;
}) => {
  const handleOnClick = useCallback(() => {
    window.history.pushState(
      null,
      "",
      `${window.location.origin}${window.location.pathname}#${tab}`,
    );
  }, [tab]);

  return (
    <button
      className={`flex flex-1 items-center justify-center py-2 transition-all ${selected ? "bg-gray-d0-500/70 text-gray-800" : "hover:bg-gray-d0-500/70 hover:text-gray-800"}`}
      onClick={handleOnClick}
    >
      <span className="font-bold">{SPENDING_PAGE_TAB_LABEL[tab]}</span>
    </button>
  );
};
