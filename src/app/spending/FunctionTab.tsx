"use client";
import { useTabCtx, useTabHandlerCtx } from "@/app/spending/TabCtxProvider";
import { SPENDING_PAGE_TAB, SPENDING_PAGE_TABS } from "@/utils/constants";

export const FunctionTab = () => {
  const { tab } = useTabCtx();
  return (
    <div className="flex w-full items-center justify-center pt-8">
      {SPENDING_PAGE_TABS.map(
        (_tab) => _tab !== tab && <TabItem key={_tab} tab={_tab} />,
      )}
    </div>
  );
};

const TabItem = ({ tab }: { tab: SPENDING_PAGE_TAB }) => {
  const { setTab } = useTabHandlerCtx();
  return (
    <button
      className="flex w-[100px] items-center justify-center border border-solid border-gray-d0-500 py-2 transition-all hover:shadow-lg hover:shadow-gray-d0-500/50"
      onClick={() => setTab(tab)}
    >
      <span className="font-bold">{tab}</span>
    </button>
  );
};
