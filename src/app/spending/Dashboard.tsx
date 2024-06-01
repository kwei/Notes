"use client";

import {
  useRecordCtx,
  useRecordHandlerCtx,
} from "@/app/spending/RecordContextProvider";
import { RecordModal } from "@/app/spending/RecordModal";
import { IRecord } from "@/type";
import { INPUT_RECORD_TYPE, RecordModalType } from "@/utils/constants";
import { RecordModalProvider, useRecordModalCtx } from "@/utils/externalStores";
import { useCallback, useMemo, useState } from "react";

const WEEKDAY = ["日", "一", "二", "三", "四", "五", "六"];

export const Dashboard = () => {
  const { total, income, outcome, list } = useRecordCtx();
  const [isAddRecord, setIsAddRecord] = useState(false);

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
      <RecordModalProvider>
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
          <AddRecordBtn handleLoading={setIsAddRecord} />
        </div>

        <RecordModal loading={isAddRecord} />
      </RecordModalProvider>
    </div>
  );
};

const AddRecordBtn = ({
  handleLoading,
}: {
  handleLoading: (status: boolean) => void;
}) => {
  const { updateList } = useRecordHandlerCtx();
  const { useStore } = useRecordModalCtx();
  const [, setState] = useStore((state) => state);

  const addRecord = useCallback(
    (record: IRecord) => {
      handleLoading(true);
      setTimeout(() => {
        updateList(INPUT_RECORD_TYPE.ADD, record);
        handleLoading(false);
      }, 3000);
    },
    [handleLoading, updateList],
  );

  const handleCloseRecordModal = useCallback(() => {
    setState({
      open: false,
      step: RecordModalType.Step_1,
      record: undefined,
    });
  }, [setState]);

  const handleOpenRecordModal = useCallback(() => {
    setState({
      open: true,
      onClose: handleCloseRecordModal,
      addCategory: () => {},
      addRecord,
    });
  }, [setState, handleCloseRecordModal, addRecord]);

  return (
    <button
      className="underline underline-offset-8 text-xl font-semibold hover:text-green-50-500 transition-colors"
      onClick={handleOpenRecordModal}
    >
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 新增 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </button>
  );
};
