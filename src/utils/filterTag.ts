import { ITodo } from "@/type";

export function filterTag(tag: string, list?: ITodo[]) {
  const res = new Set<ITodo>([]);
  if (!list) return [];
  if (tag === "") return list;
  const tagList = tag.split("; ");
  list.forEach((data) => {
    data.tags.forEach((tag) => {
      if (tagList.includes(tag.name)) {
        res.add(data);
      }
    });
  });
  return Array.from(res);
}
