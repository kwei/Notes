"use client";

import { useGroupInfo } from "@/app/group/GroupInfoContext";
import { useGroupInfoModal } from "@/app/group/GroupInfoModalContext";
import { IGroup } from "@/type";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { MdAdd } from "react-icons/md";
import Image from "next/image";

export const GroupTable = () => {
  const { initialing, groups } = useGroupInfo();

  const hasGroup = useMemo(() => Object.keys(groups).length > 0, [groups]);

  if (initialing) {
    return <div>loading...</div>;
  }

  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 md:gap-4 lg:grid-cols-6 xl:grid-cols-7">
      {!hasGroup ? (
        <AddGroupBlock />
      ) : (
        <>
          {Object.keys(groups).map((key) => (
            <GroupBlock key={key} info={groups[key]} />
          ))}
          <AddGroupBlock />
        </>
      )}
    </div>
  );
};

const AddGroupBlock = () => {
  const { open } = useGroupInfoModal();
  return (
    <button
      type="button"
      onClick={open}
      className="relative flex aspect-square w-full items-center justify-center rounded-2xl border border-solid border-gray-500 p-4 transition-colors hover:bg-gray-500/50 sm:col-span-1"
    >
      <MdAdd className="size-8" />
    </button>
  );
};

const GroupBlock = ({ info }: { info: IGroup }) => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.push(`/group/${info.groupId}`)}
      className="relative flex aspect-square w-full items-center justify-center rounded-2xl border border-solid border-gray-500 p-4 transition-colors hover:bg-gray-500/50 sm:col-span-1"
    >
      <h3 className="m-0 w-full break-words p-0 text-center text-sm font-bold md:text-lg lg:text-xl">
        {info.name}
      </h3>
      <div className="absolute bottom-0 left-0 right-0 flex flex-wrap gap-1 p-2">
        {info.members.map((member) => (
          <Image
            key={member.email}
            title={member.name}
            className="m-0 size-5 rounded-full"
            width={20}
            height={20}
            src={member.image}
            alt="user image"
          />
        ))}
      </div>
    </button>
  );
};
