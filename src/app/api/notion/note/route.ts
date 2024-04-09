import { getArticleList } from "@/utils/getArticleList";
import { getQueryString } from "@/utils/getQueryString";
import { markdownConverter } from "@/utils/markdownConverter";
import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { NotionToMarkdown } from "notion-to-md";

export async function GET(req: Request) {
  console.log("req url: ", req.url);
  const queryList = req.url.split("?")[1]?.split("&") ?? [];
  const pageId = getQueryString(queryList, "id");
  const notion = new Client({ auth: process.env.NOTION_NOTE_SECRET });
  if (pageId) {
    const n2m = new NotionToMarkdown({ notionClient: notion });
    const md = n2m.toMarkdownString(await n2m.pageToMarkdown(pageId)).parent;
    return NextResponse.json(markdownConverter(md));
  }
  const articleList = await getArticleList();
  return NextResponse.json(articleList);
}
