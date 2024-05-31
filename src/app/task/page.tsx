import { CtxTask } from "@/app/task/CtxTask";
import { TaskBoardContainer } from "@/app/task/TaskBoardContainer";
import { TaskModal } from "@/app/task/TaskModal";
import { Toast } from "@/components/Toast";
import { TaskModalProvider, ToastProvider } from "@/utils/externalStores";

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col xl:p-4 items-center">
      <ToastProvider>
        <CtxTask>
          <TaskModalProvider>
            <TaskBoardContainer />
            <TaskModal />
          </TaskModalProvider>
        </CtxTask>
        <Toast />
      </ToastProvider>
    </main>
  );
}
