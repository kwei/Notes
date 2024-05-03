"use client";

import { useTaskCtx } from "@/app/task/CtxTask";
import { ITag } from "@/type";
import { useMemo } from "react";

export const useAllTags = () => {
  const { list } = useTaskCtx();

  const allTagStringify = useMemo(() => {
    const res = new Set<string>([]);
    Object.values(list).forEach((tasks) =>
      tasks.forEach((task) => {
        task.tags.forEach((tag) => {
          res.add(JSON.stringify(tag));
        });
      }),
    );
    return Array.from(res).sort();
  }, [list]);

  const allTags = useMemo(
    () => allTagStringify.map((s) => JSON.parse(s) as ITag),
    [allTagStringify],
  );

  return { allTags };
};
