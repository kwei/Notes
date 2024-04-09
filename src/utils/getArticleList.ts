import { ArticleList } from "@/type";
import { Client } from "@notionhq/client";
import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface NotionProperty {
  Topic: {
    rich_text: {
      plain_text: string;
    }[];
  };
  Category: {
    rich_text: {
      plain_text: string;
    }[];
  };
  ID: {
    rich_text: {
      plain_text: string;
    }[];
  };
  Name: {
    title: {
      plain_text: string;
    }[];
  };
}

export const getArticleList = async () => {
  const notion = new Client({ auth: process.env.NOTION_NOTE_SECRET });
  return notion.databases
    .query({ database_id: process.env.NEXT_PUBLIC_NOTION_NOTE_TABLE_ID! })
    .then((pages) => pages.results as DatabaseObjectResponse[])
    .then((res) =>
      res.map((obj) => obj.properties as unknown as NotionProperty),
    )
    .then((list) =>
      list.map(
        (data) =>
          ({
            category: data.Category.rich_text[0].plain_text,
            topic: data.Topic.rich_text[0].plain_text,
            name: data.Name.title[0].plain_text,
            id: data.ID.rich_text[0].plain_text,
          }) as ArticleList,
      ),
    );
};
