import { Task } from "@/type";
import { getQueryString } from "@/utils/getQueryString";
import { getTaskList } from "@/utils/getTaskList";
import { markdownConverter } from "@/utils/markdownConverter";
import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { NotionToMarkdown } from "notion-to-md";

export async function GET(req: Request) {
  console.log("[GET] req url: ", req.url);
  const queryList = req.url.split("?")[1]?.split("&") ?? [];
  const pageId = getQueryString(queryList, "id");
  const notion = new Client({ auth: process.env.NOTION_TASK_SECRET });
  if (pageId) {
    const n2m = new NotionToMarkdown({ notionClient: notion });
    const md = n2m.toMarkdownString(await n2m.pageToMarkdown(pageId)).parent;
    return NextResponse.json(markdownConverter(md));
  }
  const taskList = await getTaskList();
  return NextResponse.json(taskList);
}

export async function POST(req: Request) {
  console.log("[POST] req url: ", req.url);
  const tasks = (await req.json()) as Task[];
  const notion = new Client({ auth: process.env.NOTION_TASK_SECRET });
  const result = [];
  for (const task of tasks) {
    const newProp = {
      Status: {
        select: {
          id: task.status.id,
          name: task.status.name,
          color: "default",
        },
      },
    };
    console.log(newProp);
    const res = await notion.pages.update({
      page_id: task.id,
      properties: newProp as any,
    });
    result.push(res);
  }
  return NextResponse.json(result);
}
