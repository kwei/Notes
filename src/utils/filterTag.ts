import { ITodo } from "@/type";

export function filterTag(tag: string, list: ITodo[]) {
  const res: ITodo[] = [];
  if (tag === "") return list;
  const tagList = tag.split("; ");
  list.forEach((data) => {
    const tagNames = data.tags.map((tag) => tag.name);
    tagNames.forEach((tagName) => {
      if (
        tagList.includes(tagName) &&
        !res.some((data) => data.tags.map((tag) => tag.name).includes(tagName))
      ) {
        res.push(data);
      }
    });
  });
  return res;
}
