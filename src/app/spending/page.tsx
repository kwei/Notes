import { FunctionTab } from "@/app/spending/FunctionTab";
import { NotificationRegister } from "@/app/spending/NotificationRegister";
import { RecordContextProvider } from "@/app/spending/RecordContextProvider";
import { TabCtxProvider } from "@/app/spending/TabCtxProvider";
import { TabSelector } from "@/app/spending/TabSelector";

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col items-center">
      <NotificationRegister />
      <div className="flex flex-col justify-between my-4 p-5 w-full flex-1 md:w-2/3 lg:w-1/3">
        <RecordContextProvider>
          <TabCtxProvider>
            <TabSelector />
            <FunctionTab />
          </TabCtxProvider>
        </RecordContextProvider>
      </div>
    </main>
  );
}
