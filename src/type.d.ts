import { TASK_COLOR, TASK_STATUS, TOAST_TYPE } from "@/utils/constants";

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
  reFetch: () => Promise<void>;
}

type ITag = {
  name: string;
  color: TASK_COLOR;
};

interface ITodo {
  id?: string;
  title: string;
  tags: ITag[];
  status: {
    name: TASK_STATUS;
  };
  iat?: Date;
  expiry?: Date;
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

interface IMetaConfig {}

interface IToast {
  type: TOAST_TYPE;
  show: boolean;
  msg: string;
}

interface ITaskModal {
  task: ITodo;
  open: boolean;
  action: "update" | "add";
  onClose: () => void;
  handleLoading: (status: boolean) => void;
}