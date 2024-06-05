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
      <div className="flex w-full items-center justify-center">
        <span className="text-lg font-bold">編輯項目</span>
      </div>
      <form
        onSubmit={handleOnSubmitChange}
        className="flex w-full flex-1 flex-col gap-2"
      >
        <fieldset className="rounded-md border border-solid border-gray-d0-500 px-3 pb-2 pt-1">
          <legend className="bg-gray-800 px-2">金額</legend>
          <input
            type="number"
            name="price"
            className="w-full bg-transparent focus:outline-none"
            defaultValue={record.price}
          />
        </fieldset>

        <fieldset className="py-2">
          <Dropdown
            value={record.category}
            onChange={setCategory}
            placeHolder="選擇類型"
            className="w-full rounded-md border border-solid border-gray-d0-500 p-1 pr-4"
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

        <fieldset className="rounded-md border border-solid border-gray-d0-500 px-3 pb-2 pt-1">
          <legend className="bg-gray-800 px-2">日期</legend>
          <input
            type="date"
            name="date"
            className="w-full bg-transparent focus:outline-none"
            defaultValue={record.date}
          />
        </fieldset>

        <fieldset className="rounded-md border border-solid border-gray-d0-500 px-3 pb-2 pt-1">
          <legend className="bg-gray-800 px-2">說明</legend>
          <input
            type="text"
            name="desc"
            className="w-full bg-transparent focus:outline-none"
            defaultValue={record.desc}
          />
        </fieldset>

        <div className="flex w-full flex-1 items-end gap-2">
          <button
            type="button"
            className="group flex flex-1 items-center justify-center rounded-md border border-solid border-red-ff-300 py-1 text-red-ff-300 transition-colors hover:bg-red-ff-300"
            onClick={handleDeleteRecord}
          >
            <span className="font-bold transition-colors group-hover:text-gray-800">
              刪除
            </span>
          </button>
          <button
            type="submit"
            className="group flex flex-1 items-center justify-center rounded-md border border-solid border-gray-d0-500/70 bg-gray-d0-500/70 py-1 text-gray-800 transition-colors hover:border-gray-d0-500 hover:bg-gray-d0-500"
          >
            <span className="font-bold transition-colors group-hover:text-gray-800">
              送出
            </span>
          </button>
        </div>
      </form>
    </>
  );
};
