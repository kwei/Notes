"use client";

import { useTaskCtx } from "@/app/task/CtxTask";
import { ROUTES } from "@/utils/constants";
import { useRouter } from "next/navigation";

interface Props {
  className?: string;
}

export const ToolBox = ({ className = "" }: Props) => {
  const router = useRouter();
  const { list } = useTaskCtx();

  function reFresh() {
    router.push(ROUTES["Task"]);
  }

  function update() {
    fetch("/api/notion/task", {
      method: "POST",
      body: JSON.stringify(Object.values(list).flat()),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("update task: ", res);
      })
      .finally(() => {
        reFresh();
      });
  }

  return (
    <div className={`w-full flex items-center justify-end gap-4 ${className}`}>
      <button onClick={update}>Update</button>
      <button>export</button>
      <button onClick={reFresh}>Sync</button>
    </div>
  );
};
