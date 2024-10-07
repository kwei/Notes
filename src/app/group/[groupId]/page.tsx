import { DeleteGroupBtn } from "@/app/group/[groupId]/DeleteGroupBtn";
import { EditGroupBtn } from "@/app/group/[groupId]/EditGroupBtn";
import { RecordContext } from "@/app/group/[groupId]/RecordContext";
import { Report } from "@/app/group/[groupId]/Report";
import Link from "next/link";
import { ImArrowLeft } from "react-icons/im";

export default async function Home() {
  const groupTableUrl = "/group";
  return (
    <main className="flex w-full flex-1 justify-center px-2 md:px-4">
      <div className="flex w-full flex-col items-center">
        <RecordContext>
          <div className="flex w-full justify-between">
            <Link
              href={groupTableUrl}
              className="flex items-center gap-2 text-gray-d0-500"
            >
              <ImArrowLeft className="size-4" />
              Back
            </Link>
            <div className="flex items-center gap-2">
              <EditGroupBtn />
              <span className="bg-gray-500 px-px py-2"></span>
              <DeleteGroupBtn />
            </div>
          </div>
          <div className="w-[300px]">
            <Report />
          </div>
        </RecordContext>
      </div>
    </main>
  );
}
