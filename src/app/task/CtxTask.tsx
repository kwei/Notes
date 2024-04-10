"use client";

import { ITaskContextValue, Task } from "@/type";
import { TASK_STATUS } from "@/utils/constants";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface Props {
  children: ReactNode;
  contextValue: Record<TASK_STATUS, Task[]>;
}

export const CtxTask = (props: Props) => {
  const [list, setList] = useState({} as Record<TASK_STATUS, Task[]>);

  const contextValue = useMemo(
    () => ({
      list,
      set2List: (status: TASK_STATUS, task: Task) => {
        setList((prevState) => {
          const newState = { ...prevState };
          const i = newState[status].findIndex(
            (data) => JSON.stringify(data) === JSON.stringify(task),
          );
          if (i === -1) newState[status].push(task);
          newState[status] = sortTask(newState[status]);
          return newState;
        });
      },
      removeFromList: (status: TASK_STATUS, task: Task) => {
        setList((prevState) => {
          const newState = { ...prevState };
          const i = newState[status].findIndex(
            (data) => JSON.stringify(data) === JSON.stringify(task),
          );
          if (i !== -1) delete newState[status][i];
          return newState;
        });
      },
    }),
    [list],
  );

  useEffect(() => {
    if (Object.keys(props.contextValue).length > 0) {
      const sorted = {} as Record<TASK_STATUS, Task[]>;
      Object.entries(props.contextValue).forEach(([key, list]) => {
        sorted[key as TASK_STATUS] = sortTask(list);
      });
      setList(props.contextValue);
    }
  }, [props.contextValue]);

  return <Ctx.Provider value={contextValue}>{props.children}</Ctx.Provider>;
};

const Ctx = createContext({
  list: {} as Record<TASK_STATUS, Task[]>,
  set2List: () => {},
  removeFromList: () => {},
} as ITaskContextValue);

export const useTaskCtx = () => {
  return useContext(Ctx);
};

function sortTask(list: Task[]) {
  return list.sort((a, b) => {
    if (!a.iat && b.iat) {
      return 1;
    } else if (a.iat && !b.iat) {
      return -1;
    } else if (a.iat && b.iat) {
      console.log(
        new Date(a.iat).getTime(),
        new Date(b.iat).getTime(),
        new Date(a.iat).getTime() - new Date(b.iat).getTime(),
      );
      return new Date(a.iat).getTime() - new Date(b.iat).getTime();
    }
    return 0;
  });
}
