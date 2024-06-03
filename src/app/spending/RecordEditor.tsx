"use client";

import { useRecordHandlerCtx } from "@/app/spending/RecordContextProvider";
import { Dropdown } from "@/components/Dropdown";
import { DEFAULT_CATEGORIES } from "@/utils/constants";
import { deleteSpendingRecord } from "@/utils/deleteSpendingRecord";
import { useRecordModalCtx } from "@/utils/externalStores";
import { FormEvent, useCallback, useState } from "react";

export const RecordEditor = ({ loading }: { loading: boolean }) => {
  const { reFetch } = useRecordHandlerCtx();
  const { useStore } = useRecordModalCtx();
  const [state, setState] = useStore((state) => state);
  const [record] = useStore((state) => state.record);
  const [category, setCategory] = useState(
    record?.category ?? DEFAULT_CATEGORIES[0],
  );

  const handleDeleteRecord = useCallback(async () => {
    if (!record) return;
    setState({
      loading: true,
    });
    await deleteSpendingRecord(record);
    reFetch();
    setState({
      loading: false,
    });
    state.onClose();
  }, [record, setState, reFetch, state]);

  const handleOnSubmitChange = useCallback(
    (event: FormEvent) => {
      if (!record) return;
      const data = new FormData(event.target as HTMLFormElement);
      state.addRecord({
        ...record,
        price: Number(data.get("price") as string),
        category,
        date: data.get("date") as string,
        desc: data.get("desc") as string,
      });
    },
    [state, category, record],
  );

  if (!record || loading)
    return (
      <div className="m-auto">
        <div className="loader-square"></div>
      </div>
    );
  return (
    <>
      <div className="w-full flex items-center justify-center">
        <span className="text-lg font-bold">編輯項目</span>
      </div>
      <form
        onSubmit={handleOnSubmitChange}
        className="flex flex-col flex-1 w-full gap-2"
      >
        <fieldset className="border border-solid border-gray-d0-500 rounded-md px-3 pt-1 pb-2">
          <legend className="bg-gray-800 px-2">金額</legend>
          <input
            type="number"
            name="price"
            className="bg-transparent focus:outline-none w-full"
            defaultValue={record.price}
          />
        </fieldset>

        <fieldset className="py-2">
          <Dropdown
            value={record.category}
            onChange={setCategory}
            placeHolder="選擇類型"
            className="border border-solid border-gray-d0-500 rounded-md p-1 pr-4 w-full"
          >
            {DEFAULT_CATEGORIES.map((category) => (
              <Dropdown.Option
                key={category}
                label={category}
                value={category}
              />
            ))}
          </Dropdown>
        </fieldset>

        <fieldset className="border border-solid border-gray-d0-500 rounded-md px-3 pt-1 pb-2">
          <legend className="bg-gray-800 px-2">日期</legend>
          <input
            type="date"
            name="date"
            className="bg-transparent focus:outline-none w-full"
            defaultValue={record.date}
          />
        </fieldset>

        <fieldset className="border border-solid border-gray-d0-500 rounded-md px-3 pt-1 pb-2">
          <legend className="bg-gray-800 px-2">說明</legend>
          <input
            type="text"
            name="desc"
            className="bg-transparent focus:outline-none w-full"
            defaultValue={record.desc}
          />
        </fieldset>

        <div className="w-full flex-1 flex items-end gap-2">
          <button
            type="button"
            className="flex-1 py-1 flex items-center justify-center rounded-md border border-solid border-red-ff-300 text-red-ff-300 hover:bg-red-ff-300 group transition-colors"
            onClick={handleDeleteRecord}
          >
            <span className="group-hover:text-gray-800 font-bold transition-colors">
              刪除
            </span>
          </button>
          <button
            type="submit"
            className="flex-1 py-1 flex items-center justify-center rounded-md border border-solid border-gray-d0-500/70 bg-gray-d0-500/70 text-gray-800 hover:border-gray-d0-500 hover:bg-gray-d0-500 group transition-colors"
          >
            <span className="group-hover:text-gray-800 font-bold transition-colors">
              送出
            </span>
          </button>
        </div>
      </form>
    </>
  );
};
