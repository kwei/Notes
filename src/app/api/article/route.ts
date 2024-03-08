import { markdownConverter } from "@/utils/markdownConverter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const queryList = req.url.split("?")[1].split("&");
  const id = getQueryString(queryList, "id");
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
        return list.map((obj) => {
          const path = obj.path.split("src/articles/")[1].split("/");
          const fileName = path.pop();
          return {
            path,
            fileName,
            fileUrl: obj.url,
          };
        });
      })
      .catch((e) => {
        console.log("fetch article list error: ", e);
      });
    return NextResponse.json(result);
  } else {
    const result = await fetch(
      `https://raw.githubusercontent.com/kwei/Notes/main/src/articles/${id}.md`,
    )
      .then((res) => res.text())
      .catch((e) => {
        console.log("fetch article error: ", e);
      });
    return NextResponse.json(markdownConverter(result));
  }
}

function getQueryString(queryList: string[], t: string) {
  const result = queryList.filter(
    (queryString) => queryString.split("=")[0] === t,
  )[0];
  if (result) return result.split("=")[1];
  else return null;
}
