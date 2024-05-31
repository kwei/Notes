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

interface ITaskContextValue {
  list: Record<TASK_STATUS, ITodo[]>;
  loading: boolean;
  reFetch: () => Promise<void>;
}

type ITag = {
  name: string;
  color: TASK_COLOR;
};

type IMsgLog = {
  text: string;
  datetime: string;
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
  msgLog?: IMsgLog[];
  complete?: boolean;
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

interface IRecord {
  id: string;
  price: number;
  desc: string;
  category: string;
  date: string
}

interface RecordCtxValue {
  total: number;
  income: number;
  outcome: number;
  list: IRecord[];
}
