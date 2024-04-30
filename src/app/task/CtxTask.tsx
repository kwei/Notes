"use client";

import { IMongoQueryRes, ITaskContextValue, ITodo } from "@/type";
import { TASK_STATUS } from "@/utils/constants";
import { useUserStoreCtx } from "@/utils/externalStores";
import { getTodoList } from "@/utils/getTodoList";
import { SessionProvider } from "next-auth/react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const CtxTask = ({ children }: { children: ReactNode }) => {
  const [list, setList] = useState({} as Record<TASK_STATUS, ITodo[]>);
  const { useStore: useUserStore } = useUserStoreCtx();
  const [email] = useUserStore((state) => state.email);

  const fetchList = useCallback(async () => {
    if (email === "") return;
    const taskTable = await fetchTodoList(email);
    if (Object.keys(taskTable).length > 0) {
      const sorted = {} as Record<TASK_STATUS, ITodo[]>;
      Object.entries(taskTable).forEach(([key, list]) => {
        sorted[key as TASK_STATUS] = sortTask(list);
      });
      setList(taskTable);
    }
  }, [email]);

  const contextValue = useMemo(
    () => ({
      list,
      reFetch: fetchList,
    }),
    [fetchList, list],
  );

  useEffect(() => {
    fetchList().finally();
  }, [fetchList]);

  return (
    <Ctx.Provider value={contextValue}>
      <SessionProvider>{children}</SessionProvider>
    </Ctx.Provider>
  );
};

const Ctx = createContext({
  list: {} as Record<TASK_STATUS, ITodo[]>,
  reFetch: async () => {},
} as ITaskContextValue);

export const useTaskCtx = () => {
  return useContext(Ctx);
};

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

async function fetchTodoList(email: string) {
  return getTodoList({
    userEmail: email,
  })
    .then((res: IMongoQueryRes) => {
      if (res.status) return JSON.parse(res.message) as ITodo[];
      return [];
    })
    .then((res) => {
      const _taskTable: Record<TASK_STATUS, ITodo[]> = {
        [TASK_STATUS.BACKLOG]: [],
        [TASK_STATUS.NEW_REQUEST]: [],
        [TASK_STATUS.IN_PROGRESS]: [],
        [TASK_STATUS.COMPLETE]: [],
      };
      res.forEach((task) => {
        _taskTable[task.status.name].push(task);
      });
      return _taskTable;
    });
}
