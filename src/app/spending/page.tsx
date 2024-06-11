import { FunctionTab } from "@/app/spending/FunctionTab";
import { RecordContextProvider } from "@/app/spending/RecordContextProvider";
import { RecordModal } from "@/app/spending/RecordModal";
import { TabCtxProvider } from "@/app/spending/TabCtxProvider";
import { TabSelector } from "@/app/spending/TabSelector";
import { RecordModalProvider } from "@/utils/externalStores";

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col items-center">
      <div className="flex w-full flex-1 flex-col justify-between p-5 md:w-2/3 lg:w-1/3">
        <RecordContextProvider>
          <TabCtxProvider>
            <RecordModalProvider>
              <TabSelector />
              <FunctionTab />

              <RecordModal />
            </RecordModalProvider>
          </TabCtxProvider>
        </RecordContextProvider>
      </div>
    </main>
  );
}
