"use client";
import { IRecord, RecordCtxValue } from "@/type";
import { INPUT_RECORD_TYPE } from "@/utils/constants";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

const initState = {
  total: 20,
  income: 0,
  outcome: 0,
  list: [],
};

type Action = {
  type: INPUT_RECORD_TYPE;
  data: IRecord;
};

const reducer = (state: RecordCtxValue, action: Action) => {
  const newState = JSON.parse(JSON.stringify(state)) as RecordCtxValue;
  switch (action.type) {
    case INPUT_RECORD_TYPE.ADD:
      const indexForAdd = newState.list.findIndex(
        (d) => d.id === action.data.id,
      );
      if (indexForAdd === -1) {
        newState.list.push(action.data);
        newState.total += action.data.price;
        if (action.data.price > 0) {
          newState.income += action.data.price;
        } else {
          newState.outcome += action.data.price;
        }
        return newState;
      }
      return state;
    case INPUT_RECORD_TYPE.DELETE:
      const indexForDelete = newState.list.findIndex(
        (d) => d.id === action.data.id,
      );
      if (indexForDelete !== -1) {
        newState.list.splice(indexForDelete, 1);
        newState.total -= action.data.price;
        if (action.data.price > 0) {
          newState.income -= action.data.price;
        } else {
          newState.outcome -= action.data.price;
        }
        return newState;
      }
      return state;
    case INPUT_RECORD_TYPE.UPDATE:
      const indexForUpdate = newState.list.findIndex(
        (d) => d.id === action.data.id,
      );
      if (indexForUpdate !== -1) {
        const old = newState.list[indexForUpdate];
        newState.list[indexForUpdate] = action.data;
        newState.total += action.data.price - old.price;
        if (action.data.price > 0) {
          newState.income += action.data.price - old.price;
        } else {
          newState.outcome += action.data.price - old.price;
        }
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
  const [state, dispatch] = useReducer(reducer, initState);

  const ctxValue = useMemo(() => state, [state]);

  const updateList = useCallback(
    (type: INPUT_RECORD_TYPE, record: IRecord) => {
      dispatch({
        type,
        data: record,
      });
    },
    [dispatch],
  );

  return (
    <RecordHandlerCtx.Provider value={{ updateList }}>
      <RecordCtx.Provider value={ctxValue}>{children}</RecordCtx.Provider>
    </RecordHandlerCtx.Provider>
  );
};

const RecordCtx = createContext<RecordCtxValue>({
  total: 0,
  income: 0,
  outcome: 0,
  list: [],
});

const RecordHandlerCtx = createContext({
  updateList: (type: INPUT_RECORD_TYPE, record: IRecord) => {},
});

export const useRecordCtx = () => {
  return useContext(RecordCtx);
};

export const useRecordHandlerCtx = () => {
  return useContext(RecordHandlerCtx);
};
