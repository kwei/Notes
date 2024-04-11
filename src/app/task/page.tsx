import { TaskBoard } from "@/app/task/TaskBoard";
import { UserInfo } from "@/components/UserInfo";
import { IUser } from "@/type";
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
    <main className="flex w-full flex-1 flex-col md:p-4 p-8">
      <UserInfo user={userInfo} />
      {userInfo && (
        <TaskBoard user={userInfo} />
      )}
    </main>
  );
}
