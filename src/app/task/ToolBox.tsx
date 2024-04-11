"use client";

import { useDraggableTask } from "@/app/task/DraggableTask";
import { IMongoQueryRes } from "@/type";
import { ROUTES } from "@/utils/constants";
import { updateTodo } from "@/utils/updateTodo";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface Props {
  className?: string;
}

export const ToolBox = ({ className = "" }: Props) => {
  const router = useRouter();
  const { dragged, updated, setUpdated, setDragged } = useDraggableTask();

  const reFresh = useCallback(() => {
    router.push(ROUTES["Task"]);
  }, [router]);

  const update = useCallback(() => {
    if (dragged && updated) {
      updateTodo(dragged, updated)
        .then((res: IMongoQueryRes) => {
          console.log(res.status, JSON.parse(res.message));
        })
        .finally(() => {
          setUpdated();
          setDragged();
        });
    }
  }, [dragged, setDragged, setUpdated, updated]);

  return (
    <div className={`w-full flex items-center justify-end gap-4 ${className}`}>
      <button
        className="transition-colors rounded-md px-2 py-1 border border-solid border-gray-d0-500 hover:bg-blue-5F-500/70 font-semibold"
        onClick={update}
      >
        Save Change
      </button>
      <button className="transition-colors rounded-md px-2 py-1 border border-solid border-gray-d0-500 hover:bg-red-ff-500/70 font-semibold">
        Export
      </button>
      <button
        className="transition-colors rounded-md px-2 py-1 border border-solid border-gray-d0-500 hover:bg-green-50-500/70 font-semibold"
        onClick={reFresh}
      >
        Sync
      </button>
    </div>
  );
};
