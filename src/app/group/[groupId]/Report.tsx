"use client";

import { InputRecord } from "@/app/group/[groupId]/InputRecord";
import { RecordList } from "@/app/group/[groupId]/RecordList";
import { useRecordContext } from "@/app/group/[groupId]/RecordContext";
import { Accordion } from "@/components/Accordion";
import { useState } from "react";
import { FaAngleUp } from "react-icons/fa6";

export const Report = () => {
  const { loading, groupInfo, spending } = useRecordContext();
  const [inputting, setInputting] = useState(false);

  if (loading || !groupInfo) return "loading...";

  return (
    <div className="flex w-full flex-col">
      <h2 className="mb-2 w-full text-center text-xl font-bold">
        {groupInfo.name}
      </h2>
      <div className="flex w-full flex-col rounded-md border border-solid border-gray-500">
        <Accordion className="w-full" label="" open={inputting}>
          <InputRecord
            members={groupInfo.members.filter(
              (_member) => _member.email !== groupInfo.owner.email,
            )}
            groupId={groupInfo.groupId}
          />
        </Accordion>
        <button
          type="button"
          onClick={() => setInputting((prevState) => !prevState)}
          className={`w-full ${inputting ? "rounded-b-md py-1" : "rounded-md py-2"} flex items-center justify-center bg-gray-600 transition-colors hover:bg-gray-500`}
        >
          {inputting ? <FaAngleUp className="size-4" /> : "Open Input Section"}
        </button>
      </div>
      <RecordList list={spending} />
    </div>
  );
};
