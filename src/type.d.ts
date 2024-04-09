import { TASK_COLOR, TASK_STATUS } from "@/utils/constants";

interface GitTreeObj {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
}

interface GitTree {
  [category: string]: {
    [topic: string]: {
      fileName: string;
      fileUrl: string;
    }[];
  };
}

interface ArticleList {
  category: string;
  topic: string;
  name: string;
  id: string;
}

type ArticleTable = Record<string, ArticleTopics>;
type ArticleTopics = Record<string, Article[]>;
type Article = { name: string; id: string };

interface Task {
  id: string;
  title: string;
  tags: {
    name: string;
    color: TASK_COLOR;
  }[];
  status: {
    id: string;
    name: TASK_STATUS;
    color: TASK_COLOR;
  }
  iat?: Date;
  expiry?: Date;
}