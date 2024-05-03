import { CtxTask } from "@/app/task/CtxTask";
import { TaskBoardContainer } from "@/app/task/TaskBoardContainer";
import { TaskModal } from "@/app/task/TaskModal";
import { Toast } from "@/components/Toast";
import { UserInfo } from "@/components/UserInfo";
import { IUser } from "@/type";
import {
  TaskModalProvider,
  ToastProvider,
  UserProvider,
} from "@/utils/externalStores";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();
  const userInfo: IUser | null = session?.user
    ? {
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? "",
      }
    : null;

  return (
    <main className="flex w-full flex-1 flex-col xl:p-4 items-center">
      <UserProvider>
        <ToastProvider>
          <CtxTask>
            <TaskModalProvider>
              <UserInfo user={userInfo} />
              {userInfo && <TaskBoardContainer />}
              <TaskModal />
            </TaskModalProvider>
          </CtxTask>
          <Toast />
        </ToastProvider>
      </UserProvider>
    </main>
  );
}
