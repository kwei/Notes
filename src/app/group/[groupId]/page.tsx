import { RecordContext } from "@/app/group/[groupId]/RecordContext";
import { Report } from "@/app/group/[groupId]/Report";
import Link from "next/link";
import { FaTrashCan } from "react-icons/fa6";
import { ImArrowLeft } from "react-icons/im";

export default async function Home() {
  const groupTableUrl = "/group";
  return (
    <main className="flex w-full flex-1 justify-center px-2 md:px-4">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full justify-between">
          <Link
            href={groupTableUrl}
            className="flex items-center gap-2 text-gray-d0-500"
          >
            <ImArrowLeft className="size-4" />
            Back
          </Link>
          <button
            type="button"
            className="group flex size-8 items-center justify-center gap-2 rounded-full p-px transition-colors hover:bg-gray-500/50 sm:size-auto sm:rounded-md sm:p-2"
          >
            <FaTrashCan className="size-4 transition-colors group-hover:text-red-300" />
            <span className="hidden transition-colors group-hover:text-red-300 sm:inline">
              Delete Group
            </span>
          </button>
        </div>
        <div className="w-[300px]">
          <RecordContext>
            <Report />
          </RecordContext>
        </div>
      </div>
    </main>
  );
}
