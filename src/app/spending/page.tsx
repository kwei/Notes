import { TabMenu } from "@/app/spending/TabMenu";
import { RecordContextProvider } from "@/app/spending/RecordContextProvider";
import { RecordModal } from "@/app/spending/RecordModal";
import { TabSelector } from "@/app/spending/TabSelector";
import { SPENDING_PAGE_TAB_LABEL, SPENDING_PAGE_TABS } from "@/utils/constants";
import { RecordModalProvider } from "@/utils/externalStores";

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col items-center">
      <div className="flex w-full flex-1 flex-col justify-between p-5 md:w-2/3 lg:w-1/3">
        <RecordContextProvider>
          <RecordModalProvider>
            <TabSelector />
            <div className="mt-8 flex w-full items-center justify-center divide-x divide-gray-d0-500 border border-solid border-gray-d0-500">
              {SPENDING_PAGE_TABS.map((_tab) => (
                <TabMenu key={_tab} tab={_tab}>
                  <span className="font-bold">
                    {SPENDING_PAGE_TAB_LABEL[_tab]}
                  </span>
                </TabMenu>
              ))}
            </div>
            <RecordModal />
          </RecordModalProvider>
        </RecordContextProvider>
      </div>
    </main>
  );
}
