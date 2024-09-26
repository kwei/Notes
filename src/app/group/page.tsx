import { GroupInfoContext } from "@/app/group/GroupInfoContext";
import { GroupInfoModalContext } from "@/app/group/GroupInfoModalContext";
import { GroupTable } from "@/app/group/GroupTable";

export default async function Home() {
  return (
    <main className="flex w-full flex-1 justify-center px-4">
      <GroupInfoContext>
        <div className="w-full">
          <GroupInfoModalContext>
            <GroupTable />
          </GroupInfoModalContext>
        </div>
      </GroupInfoContext>
    </main>
  );
}
