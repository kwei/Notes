"use client";

import { useTaskContext } from "@/app/task/v2/TasksContext";
import { ITag } from "@/type";
import { useMemo } from "react";

export const useAllTags = () => {
  const { tasks: list } = useTaskContext();

  const allTagStringify = useMemo(() => {
    const res = new Set<string>([]);
    Object.values(list).forEach((tasks) =>
      tasks.forEach((task) => {
        task.tags.forEach((tag) => {
          res.add(JSON.stringify(tag));
        });
      }),
    );
    return Array.from(res);
  }, [list]);

  const allTags = useMemo(() => {
    const unsorted = allTagStringify.map((s) => JSON.parse(s) as ITag);
    return sortTags(unsorted);
  }, [allTagStringify]);

  return { allTags };
};

export function sortTags(tags: ITag[]) {
  const unsorted = Array.from(tags);
  const sorted = unsorted.map((d) => d.name).sort();
  const res: ITag[] = [];
  sorted.forEach((tagName) => {
    const tag = unsorted.find((d) => d.name === tagName);
    if (tag) res.push(tag);
  });
  return res;
}
