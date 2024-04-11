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
  };
  iat?: Date;
  expiry?: Date;
}

interface ITaskContextValue {
  list: Record<TASK_STATUS, ITodo[]>;
  set2List: (status: TASK_STATUS, task: ITodo) => void;
  removeFromList: (status: TASK_STATUS, task: ITodo) => void;
}

interface ITodo {
  id?: string;
  title: string;
  tags: {
    name: string;
    color: TASK_COLOR;
  }[];
  status: {
    name: TASK_STATUS;
    color: TASK_COLOR;
  };
  iat?: Date;
  expiry?: date;
  userEmail: string;
  detail: string;
}

interface IUser {
  name: string;
  email: string;
  image: string;
}

interface IMongoQuery<D> {
  method: "get" | "set" | "update" | "delete";
  filter: Partial<D>;
  data: D;
}

interface IMongoQueryRes {
  status: boolean;
  message: string;
}
