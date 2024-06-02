"use client";
import { useTabCtx, useTabHandlerCtx } from "@/app/spending/TabCtxProvider";
import { SPENDING_PAGE_TAB, SPENDING_PAGE_TABS } from "@/utils/constants";

export const FunctionTab = () => {
  const { tab } = useTabCtx();
  return (
    <div className="w-full flex items-center justify-center">
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
      className="w-[100px] py-2 flex items-center justify-center transition-all border border-solid border-gray-d0-500 hover:shadow-lg hover:shadow-gray-d0-500/50"
      onClick={() => setTab(tab)}
    >
      <span className="font-bold">{tab}</span>
    </button>
  );
};
