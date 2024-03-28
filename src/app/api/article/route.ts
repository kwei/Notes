import { getQueryString } from "@/utils/getQueryString";
import { markdownConverter } from "@/utils/markdownConverter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const queryList = req.url.split("?")[1].split("&");
  const fileName = getQueryString(queryList, "fileName");
  const getList = getQueryString(queryList, "getList");

  if (getList === "true") {
    const result = await fetch(
      "https://api.github.com/repos/kwei/Notes/git/trees/main?recursive=1",
    )
      .then((res) => res.json())
      .then((res) => {
        if (!res.tree) throw new Error(res.message);
        return res.tree;
      })
      .then((tree: GitTreeObj[]) => {
        return tree.filter(
          (obj) => obj.path.includes("src/articles/") && obj.type === "blob",
        );
      })
      .then((list) => {
        const gitTree: GitTree = {};
        list.forEach((obj) => {
          const path = obj.path.split("src/articles/")[1].split("/");
          const category = path[0];
          const topic = path[1];
          const fileName = path[2];
          if (!gitTree[category]) gitTree[category] = {};
          if (!gitTree[category][topic]) gitTree[category][topic] = [];
          gitTree[category][topic].push({
            fileName,
            fileUrl: obj.url,
          });
        });
        return gitTree;
      })
      .catch((e) => {
        console.log("fetch article list error: ", e);
      });
    return NextResponse.json(result);
  } else if (fileName) {
    console.log(
      "fetch markdown: ",
      `https://raw.githubusercontent.com/kwei/Notes/main/src/articles/${fileName}`,
    );
    const result = await fetch(
      `https://raw.githubusercontent.com/kwei/Notes/main/src/articles/${fileName}`,
    )
      .then((res) => res.text())
      .catch((e) => {
        console.log("fetch article error: ", e);
      });
    return NextResponse.json(markdownConverter(result));
  }
  return NextResponse.json("");
}
