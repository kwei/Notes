"use client";

import { useRecordContext } from "@/app/group/[groupId]/RecordContext";
import { useCallback } from "react";
import { FaPen } from "react-icons/fa6";

export const EditGroupBtn = () => {
  const { groupInfo } = useRecordContext();

  const handleEditGroup = useCallback(() => {
    if (!groupInfo) return;
  }, [groupInfo]);

  return (
    <button
      type="button"
      onClick={handleEditGroup}
      className="group flex size-8 items-center justify-center gap-2 rounded-full p-px transition-colors hover:bg-gray-500/50 sm:size-auto sm:rounded-md sm:p-2"
    >
      <FaPen className="size-4 transition-colors group-hover:text-blue-300" />
      <span className="hidden transition-colors group-hover:text-blue-300 sm:inline">
        Edit Group
      </span>
    </button>
  );
};
