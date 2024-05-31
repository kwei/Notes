import { Dashboard } from "@/app/spending/Dashboard";
import { NotificationRegister } from "@/app/spending/NotificationRegister";
import { RecordContextProvider } from "@/app/spending/RecordContextProvider";

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col items-center">
      <NotificationRegister />
      <div className="flex flex-col my-4 p-5 w-full lg:w-1/3">
        <RecordContextProvider>
          <Dashboard />
        </RecordContextProvider>
      </div>
    </main>
  );
}
