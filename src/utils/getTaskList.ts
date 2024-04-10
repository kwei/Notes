import { Task } from "@/type";
import {
  COLOR_TABLE,
  TASK_COLOR,
  TASK_STATUS,
  TASK_TABLE,
} from "@/utils/constants";
import { Client } from "@notionhq/client";
import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface NotionProperty {
  Tags: {
    multi_select: {
      name: string;
      color: TASK_COLOR;
    }[];
  };
  Status: {
    id: string;
    select: {
      id: string;
      name: TASK_STATUS;
      color: TASK_COLOR;
    };
  };
  Name: {
    title: {
      plain_text: string;
    }[];
  };
  "Issue At": {
    date: {
      start: string;
    };
  };
  "End At": {
    date: {
      start: string;
    };
  };
  ID: {
    rich_text: {
      plain_text: string;
    }[];
  };
}

export const getTaskList = async () => {
  const notion = new Client({ auth: process.env.NOTION_TASK_SECRET });
  return notion.databases
    .query({ database_id: process.env.NEXT_PUBLIC_NOTION_TASK_TABLE_ID! })
    .then((pages) => pages.results as DatabaseObjectResponse[])
    .then((res) =>
      res.map((obj) => obj.properties as unknown as NotionProperty),
    )
    .then((list) => {
      list.forEach((data) => {
        // console.log("Task List Data: ", data);
      });
      return list;
    })
    .then((list) =>
      list.map(
        (data) =>
          ({
            id: data.ID.rich_text[0].plain_text,
            tags: data.Tags.multi_select.map((obj) => ({
              name: obj.name,
              color: COLOR_TABLE[obj.color],
            })),
            status: {
              id: data.Status.select.id,
              name: TASK_TABLE[data.Status.select.name],
              color: COLOR_TABLE[data.Status.select.color],
            },
            title: data.Name.title[0].plain_text,
            iat: new Date(data["Issue At"].date?.start),
            expiry: new Date(data["End At"].date?.start),
          }) as Task,
      ),
    );
};
