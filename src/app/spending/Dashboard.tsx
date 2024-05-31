"use client";

import {
  useRecordCtx,
  useRecordHandlerCtx,
} from "@/app/spending/RecordContextProvider";
import { useFocusRef } from "@/hooks/useFocusRef";
import { INPUT_RECORD_TYPE } from "@/utils/constants";
import { RecordModalProvider, useRecordModalCtx } from "@/utils/externalStores";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const WEEKDAY = ["日", "一", "二", "三", "四", "五", "六"];

export const Dashboard = () => {
  const { total, income, outcome, list } = useRecordCtx();
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
          <AddRecordBtn />
        </div>

        <RecordModal />
      </RecordModalProvider>
    </div>
  );
};

const AddRecordBtn = () => {
  const { useStore } = useRecordModalCtx();
  const [, setState] = useStore((state) => state);

  const handleCloseRecordModal = useCallback(() => {
    setState({
      open: false,
      record: null,
      addCategory: () => {},
      addRecord: () => {},
      onClose: () => {},
    });
  }, [setState]);

  const handleOpenRecordModal = useCallback(() => {
    setState({
      open: true,
      onClose: handleCloseRecordModal,
    });
  }, [setState, handleCloseRecordModal]);

  return (
    <button
      className="underline underline-offset-8 text-xl font-semibold hover:text-green-50-500 transition-colors"
      onClick={handleOpenRecordModal}
    >
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 新增 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </button>
  );
};

const RecordModal = () => {
  const { useStore } = useRecordModalCtx();
  const [state, setState] = useStore((state) => state);
  const ref = useFocusRef<HTMLDivElement>(() => {
    setState({
      step: "1",
    });
    state.onClose();
  });

  if (!state.open) return null;
  return (
    <div className="fixed z-40 left-0 right-0 top-0 bottom-0 bg-transparent flex flex-col items-center justify-end">
      <div
        ref={ref}
        className="w-full md:w-auto rounded-t-2xl p-8 flex flex-col bg-gray-800 gap-4"
        style={{
          width: ref.current?.clientWidth,
        }}
      >
        {state.step === "1" && <Calculator />}
        {state.step === "2" && <CategorySelector />}
      </div>
    </div>
  );
};

const Calculator = () => {
  const [sign, setSign] = useState(false);
  const [total, setTotal] = useState(0);
  const { useStore } = useRecordModalCtx();
  const [, setState] = useStore((state) => state);

  const handleOnNextStep = useCallback(() => {
    setState({
      step: "2",
    });
  }, []);

  return (
    <>
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center">
          <button
            className={`rounded-l-md py-1 px-4 text-gray-800 font-semibold transition-colors ${sign ? "bg-red-300/60 hover:bg-red-300/70" : "bg-red-300"}`}
            onClick={() => setSign(false)}
          >
            支出
          </button>
          <button
            className={`rounded-r-md py-1 px-4 text-gray-800 font-semibold transition-colors ${sign ? "bg-green-300" : "bg-green-300/60 hover:bg-green-300/70"}`}
            onClick={() => setSign(true)}
          >
            收入
          </button>
        </div>
        <button className="bg-stone-400 py-1 px-4 rounded-md flex items-center justify-center">
          <span className="text-gray-800 font-semibold">C</span>
        </button>
      </div>

      <div className="rounded-md px-3 py-4 w-full bg-stone-400 text-right text-gray-800 font-bold">
        {total}
      </div>

      <div className="w-full grid grid-cols-4 gap-2">
        <div className="col-span-3 grid grid-cols-3 gap-2">
          {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "="].map(
            (v) => (
              <button
                key={v}
                className="col-span-1 flex items-center justify-center py-2 px-4 bg-stone-400 rounded-md hover:bg-stone-300 transition-colors"
              >
                <span className="text-gray-800 font-semibold">{v}</span>
              </button>
            ),
          )}
        </div>
        <div className="col-span-1 flex flex-col gap-2">
          {["/", "x", "-", "+"].map((v) => (
            <button
              key={v}
              className="flex items-center justify-center py-2 px-4 bg-stone-400 rounded-md hover:bg-stone-300 transition-colors"
            >
              <span className="text-gray-800 font-semibold">{v}</span>
            </button>
          ))}
          <button
            className="flex items-center justify-center py-2 px-4 bg-stone-400 rounded-md hover:bg-stone-300 transition-colors"
            onClick={handleOnNextStep}
          >
            <span className="text-gray-800 font-semibold">下一步</span>
          </button>
        </div>
      </div>
    </>
  );
};

const CategorySelector = () => {
  const { useStore } = useRecordModalCtx();
  const [, setState] = useStore((state) => state);

  const handleOnPreviousStep = useCallback(() => {
    setState({
      step: "1",
    });
  }, []);

  return (
    <>
      <div className="w-full flex items-center pb-2">
        <button className='hover:text-green-50-500 transition-colors' onClick={handleOnPreviousStep}>上一步</button>
      </div>

      <div className="w-full grid grid-cols-4 gap-2">
        <button className="col-span-1 py-2 px-4 flex items-center justify-center bg-stone-400 rounded-md hover:bg-stone-300 transition-colors">
          <span className="text-gray-800 font-semibold">飲食</span>
        </button>
        <button className="col-span-1 py-2 px-4 flex items-center justify-center bg-stone-400 rounded-md hover:bg-stone-300 transition-colors">
          <span className="text-gray-800 font-semibold">交通</span>
        </button>
        <button className="col-span-1 py-2 px-4 flex items-center justify-center bg-stone-400 rounded-md hover:bg-stone-300 transition-colors">
          <span className="text-gray-800 font-semibold">薪水</span>
        </button>
        <button className="col-span-1 py-2 px-4 flex items-center justify-center bg-stone-400 rounded-md hover:bg-stone-300 transition-colors">
          <span className="text-gray-800 font-semibold">娛樂</span>
        </button>

        {/* ... */}
        <div className="col-span-4 grid grid-cols-4 gap-2">
          <button className="col-span-1 py-2 px-4 flex items-center justify-center bg-stone-400 rounded-md hover:bg-stone-300 transition-colors">
            <span className="text-gray-800 font-semibold">+</span>
          </button>
        </div>

        <div className="col-span-4 flex items-center justify-end pt-4">
          <button className="py-2 px-4 flex items-center justify-center bg-blue-5F-500/80 rounded-md hover:bg-blue-5F-500 transition-colors">
            <span className="text-gray-800 font-semibold">送出</span>
          </button>
        </div>
      </div>
    </>
  );
};

const Controller = () => {
  const { updateList } = useRecordHandlerCtx();

  const addFakePositiveRecord = useCallback(() => {
    updateList(INPUT_RECORD_TYPE.ADD, {
      id: uuidv4(),
      price: 20,
      category: "",
      date: "",
      desc: "",
    });
  }, []);

  const addFakeNegativeRecord = useCallback(() => {
    updateList(INPUT_RECORD_TYPE.ADD, {
      id: uuidv4(),
      price: -20,
      category: "",
      date: "",
      desc: "",
    });
  }, []);

  const addFakeSpecificRecord = useCallback(() => {
    updateList(INPUT_RECORD_TYPE.ADD, {
      id: "123",
      price: 20,
      category: "",
      date: "",
      desc: "",
    });
  }, []);

  const updateFakeSpecificRecord = useCallback(() => {
    updateList(INPUT_RECORD_TYPE.UPDATE, {
      id: "123",
      price: 50,
      category: "",
      date: "",
      desc: "",
    });
  }, []);

  const deleteFakeSpecificRecord = useCallback(() => {
    updateList(INPUT_RECORD_TYPE.DELETE, {
      id: "123",
      price: 50,
      category: "",
      date: "",
      desc: "",
    });
  }, []);

  return (
    <div className="flex items-center gap-4">
      <button onClick={addFakePositiveRecord}>Add Positive</button>
      <button onClick={addFakeNegativeRecord}>Add Negative</button>
      <button onClick={addFakeSpecificRecord}>Add Specific</button>
      <button onClick={updateFakeSpecificRecord}>Update Specific</button>
      <button onClick={deleteFakeSpecificRecord}>Delete Specific</button>
    </div>
  );
};
