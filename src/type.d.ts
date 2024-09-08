import { RecordModalType, TASK_STATUS } from "@/utils/constants";

type ITag = {
  name: string;
  color: string;
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

interface IRecord {
  id: string;
  price: number;
  desc: string;
  category: string;
  date: string;
  time: string;
  email: string;
}

interface RecordCtxValue {
  loading: boolean;
  list: IRecord[];
}

interface IRecordModal {
  record?: IRecord;
  step: RecordModalType;
  open: boolean;
  loading: boolean;
  addCategory: (category: string) => void;
  addRecord: (record: IRecord) => void;
  onClose: () => void;
}

interface ISubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
