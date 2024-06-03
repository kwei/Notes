"use client";
import { IRecord, RecordCtxValue } from "@/type";
import { INPUT_RECORD_TYPE } from "@/utils/constants";
import { useUserStoreCtx } from "@/utils/externalStores";
import { getSpendingRecord } from "@/utils/getSpendingRecord";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

const initState = {
  loading: true,
  list: [],
};

type Action = {
  type: INPUT_RECORD_TYPE;
  data: IRecord;
};

const reducer = (state: RecordCtxValue, action: Action) => {
  const newState = JSON.parse(JSON.stringify(state)) as RecordCtxValue;
  let index = 0;
  switch (action.type) {
    case INPUT_RECORD_TYPE.ADD:
      index = newState.list.findIndex((d) => d.id === action.data.id);
      if (index === -1) {
        newState.list.push(action.data);
        return newState;
      }
      return state;
    case INPUT_RECORD_TYPE.DELETE:
      index = newState.list.findIndex((d) => d.id === action.data.id);
      if (index !== -1) {
        newState.list.splice(index, 1);
        return newState;
      }
      return state;
    case INPUT_RECORD_TYPE.UPDATE:
      index = newState.list.findIndex((d) => d.id === action.data.id);
      if (index !== -1) {
        newState.list[index] = action.data;
        return newState;
      }
      return state;
    default:
      return state;
  }
};

export const RecordContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { useStore } = useUserStoreCtx();
  const [email] = useStore((state) => state.email);
  const [state, dispatch] = useReducer(reducer, initState);
  const [loading, setLoading] = useState(initState.loading);

  const fetch = useCallback(() => {
    if (email === "") return;
    getSpendingRecord({ email }).then(({ status, message }) => {
      if (status) {
        (JSON.parse(message) as IRecord[]).forEach((item) => {
          dispatch({
            type: INPUT_RECORD_TYPE.ADD,
            data: item,
          });
        });
      }
      setLoading(false);
    });
  }, [email]);

  const filterByMonth = useCallback(
    (
      date:
        | string
        | undefined = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}`,
    ) => {
      let total = 0,
        income = 0,
        outcome = 0;
      state.list.forEach((data) => {
        if (date === data.date.split("-").slice(0, 2).join("-")) {
          total += data.price;
          if (data.price > 0) {
            income += data.price;
          } else {
            outcome += data.price;
          }
        }
      });
      return { total, income, outcome };
    },
    [state],
  );

  const ctxValue = useMemo(
    () => ({
      ...state,
      loading,
    }),
    [loading, state],
  );

  const handlerCtxValue = useMemo(
    () => ({
      updateList: (type: INPUT_RECORD_TYPE, record: IRecord) => {
        dispatch({
          type,
          data: record,
        });
      },
      reFetch: fetch,
      filterByMonth,
    }),
    [filterByMonth, fetch, dispatch],
  );

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <RecordHandlerCtx.Provider value={handlerCtxValue}>
      <RecordCtx.Provider value={ctxValue}>{children}</RecordCtx.Provider>
    </RecordHandlerCtx.Provider>
  );
};

const RecordCtx = createContext<RecordCtxValue>({
  loading: true,
  list: [],
});

const RecordHandlerCtx = createContext({
  updateList: (type: INPUT_RECORD_TYPE, record: IRecord) => {},
  reFetch: () => {},
  filterByMonth: (date?: string) => ({
    total: 0,
    income: 0,
    outcome: 0,
  }),
});

export const useRecordCtx = () => {
  return useContext(RecordCtx);
};

export const useRecordHandlerCtx = () => {
  return useContext(RecordHandlerCtx);
};
