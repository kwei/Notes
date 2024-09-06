"use client";

import { IMongoQueryRes, ITodo, IUser } from "@/type";
import { TASK_STATUS } from "@/utils/constants";
import { useUserStoreCtx } from "@/utils/externalStores";
import { getTodoList } from "@/utils/getTodoList";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export const TasksContext = ({
  tasks: _tasks,
  children,
}: {
  tasks: ITodo[];
  children: ReactNode;
}) => {
  const { useStore: useUserStore } = useUserStoreCtx();
  const [user] = useUserStore((state) => state);
  const [tasks, setTasks] = useState(_tasks);

  const parse2TaskTable = (tasks: ITodo[]) => {
    const _taskTable: Record<TASK_STATUS, ITodo[]> = {
      [TASK_STATUS.BACKLOG]: [],
      [TASK_STATUS.NEW_REQUEST]: [],
      [TASK_STATUS.IN_PROGRESS]: [],
      [TASK_STATUS.COMPLETE]: [],
    };
    tasks.forEach((task) => {
      _taskTable[task.status.name].push(task);
    });
    return _taskTable;
  };
  
  const getUser = useCallback(() => {
    return user;
  }, [user])

  const reFetch = useCallback(async () => {
    return getTodoList({ userEmail: user.email })
      .then((res: IMongoQueryRes) => {
        if (res.status) return JSON.parse(res.message) as ITodo[];
        return [];
      })
      .then(setTasks);
  }, [user.email]);

  const ctxVal = useMemo(
    () => ({
      tasks: parse2TaskTable(
        sortTask(tasks.filter((task) => task.userEmail === user.email)),
      ),
      reFetch,
      getUser,
    }),
    [tasks, user.email, reFetch, getUser],
  );

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext<{
  tasks: Record<TASK_STATUS, ITodo[]>;
  reFetch: () => Promise<void>;
  getUser: () => IUser;
}>({
  tasks: {
    [TASK_STATUS.BACKLOG]: [],
    [TASK_STATUS.NEW_REQUEST]: [],
    [TASK_STATUS.COMPLETE]: [],
    [TASK_STATUS.IN_PROGRESS]: [],
  },
  reFetch: async () => {},
  getUser: () => ({
    name: "",
    email: "",
    image: "",
  }),
});

export const useTaskContext = () => useContext(Ctx);

function sortTask(list: ITodo[]) {
  return list.sort((a, b) => {
    if (!a.expiry && b.expiry) {
      return 1;
    } else if (a.expiry && !b.expiry) {
      return -1;
    } else if (a.expiry && b.expiry) {
      return new Date(a.expiry).getTime() - new Date(b.expiry).getTime();
    }
    return 0;
  });
}
