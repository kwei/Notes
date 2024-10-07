"use client";

import { useRecordContext } from "@/app/group/[groupId]/RecordContext";
import { deleteGroupInfo } from "@/utils/deleteGroupInfo";
import { useUserStoreCtx } from "@/utils/externalStores";
import { updateUserData } from "@/utils/updateUserData";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { FaTrashCan } from "react-icons/fa6";

export const DeleteGroupBtn = () => {
  const { useStore: useUserStore } = useUserStoreCtx();
  const [user, setUser] = useUserStore((state) => state);
  const { groupInfo } = useRecordContext();
  const route = useRouter();

  const handleDeleteGroup = useCallback(async () => {
    if (!groupInfo) return;
    const originalGroups = user.groups ?? [];
    const i = originalGroups.indexOf(groupInfo.groupId);
    if (i === -1) return;
    const newGroups = [...originalGroups];
    newGroups.splice(i, 1);
    const newUserData = {
      ...user,
      groups: newGroups,
    };
    await updateUserData(user, newUserData);
    setUser(newUserData);
    await deleteGroupInfo(groupInfo.groupId);
    route.push("/group");
  }, [groupInfo]);

  return (
    <button
      type="button"
      onClick={handleDeleteGroup}
      className="group flex size-8 items-center justify-center gap-2 rounded-full p-px transition-colors hover:bg-gray-500/50 sm:size-auto sm:rounded-md sm:p-2"
    >
      <FaTrashCan className="size-4 transition-colors group-hover:text-red-300" />
      <span className="hidden transition-colors group-hover:text-red-300 sm:inline">
        Delete Group
      </span>
    </button>
  );
};
