import { TaskBoardContainer } from "@/app/task/TaskBoardContainer";
import { UserInfo } from "@/components/UserInfo";
import { IUser } from "@/type";
import { UserProvider } from "@/utils/externalStores";
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
    <main className="flex w-full flex-1 flex-col md:p-4">
      <UserProvider>
        <UserInfo user={userInfo} />
        {userInfo && <TaskBoardContainer />}
      </UserProvider>
    </main>
  );
}
