"use client";

import {
  useRecordCtx,
  useRecordHandlerCtx,
} from "@/app/spending/RecordContextProvider";
import { IRecord } from "@/type";
import { INPUT_RECORD_TYPE, RecordModalType } from "@/utils/constants";
import { useRecordModalCtx } from "@/utils/externalStores";
import { setSpendingRecord } from "@/utils/setSpendingRecord";
import { useCallback, useState } from "react";

const WEEKDAY = ["日", "一", "二", "三", "四", "五", "六"];

export const Dashboard = () => {
  const { useStore } = useRecordModalCtx();
  const [, setState] = useStore((state) => state);
  const { loading } = useRecordCtx();
  const { filterByMonth } = useRecordHandlerCtx();
  const { total, outcome, income } = filterByMonth();

  const handleSetLoading = useCallback(
    (status: boolean) => {
      setState({
        loading: status,
      });
    },
    [setState],
  );

  if (loading) {
    return (
      <div className="m-auto">
        <div className="loader-square"></div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full flex items-center justify-center gap-1">
        <span className="text-2xl font-bold">
          {new Date().getMonth() + 1}/{new Date().getDate()}
        </span>
        <span className="text-2xl font-bold">
          (週{WEEKDAY[new Date().getDay()]})
        </span>
      </div>

      <div className="w-full rounded-2xl border border-solid border-gray-d0-500 p-4 flex items-center justify-between gap-4">
        <span className="text-xl font-bold">本月</span>
        <span
          className={`text-xl font-bold ${total < 0 ? "text-red-500/80" : "text-green-500/80"}`}
        >
          ${total}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full">
        <div className="col-span-1 rounded-lg p-2 bg-green-300/50 flex items-center justify-between gap-4">
          <span className="text-lg">收入</span>
          <span className="text-lg">${income}</span>
        </div>
        <div className="col-span-1 rounded-lg p-2 bg-red-300/50 flex items-center justify-between gap-4">
          <span className="text-lg">支出</span>
          <span className="text-lg">${outcome}</span>
        </div>
      </div>

      <div className="w-full flex items-center justify-center pt-8">
        <AddRecordBtn handleLoading={handleSetLoading} />
      </div>
    </div>
  );
};

const AddRecordBtn = ({
  handleLoading,
}: {
  handleLoading: (status: boolean) => void;
}) => {
  const { updateList, reFetch } = useRecordHandlerCtx();
  const { useStore } = useRecordModalCtx();
  const [, setState] = useStore((state) => state);

  const addRecord = useCallback(
    (record: IRecord) => {
      handleLoading(true);
      setSpendingRecord(record).then(({ status }) => {
        updateList(INPUT_RECORD_TYPE.ADD, record);
        reFetch();
        if (!status) console.error("Setting Spending Record Failed.");
        handleLoading(false);
      });
    },
    [handleLoading, updateList, reFetch],
  );

  const handleCloseRecordModal = useCallback(() => {
    setState({
      open: false,
      record: undefined,
    });
  }, [setState]);

  const handleOpenRecordModal = useCallback(() => {
    setState({
      open: true,
      step: RecordModalType.Step_1,
      onClose: handleCloseRecordModal,
      addCategory: () => {},
      addRecord,
    });
  }, [setState, handleCloseRecordModal, addRecord]);

  return (
    <button className="p-2 pb-0 group" onClick={handleOpenRecordModal}>
      <span className="col-span-1 px-12 pb-2 text-xl font-semibold border-b border-dashed border-b-gray-d0-500 group-hover:border-b-green-50-500 group-hover:text-green-50-500 group-hover:shadow-down-side group-hover:shadow-green-50-500/70 duration-300 transition-all">
        輸入!
      </span>
    </button>
  );
};
