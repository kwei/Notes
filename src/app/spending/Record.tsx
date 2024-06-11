"use client";
import { useRecordHandlerCtx } from "@/app/spending/RecordContextProvider";
import { IRecord } from "@/type";
import { INPUT_RECORD_TYPE, RecordModalType } from "@/utils/constants";
import { useRecordModalCtx } from "@/utils/externalStores";
import { updateSpendingRecord } from "@/utils/updateSpendingRecord";
import { useCallback, useMemo, useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";

interface Props {
  category: string;
  list: IRecord[];
}

export const Record = (props: Props) => {
  const { category, list } = props;
  const { updateList, reFetch } = useRecordHandlerCtx();
  const { useStore } = useRecordModalCtx();
  const [, setState] = useStore((state) => state);
  const [open, setOpen] = useState(false);

  const total = useMemo(
    () => list.reduce((sum, d) => sum + d.price, 0),
    [list],
  );

  const handleCloseRecordModal = useCallback(() => {
    setState({
      open: false,
      record: undefined,
      loading: false,
    });
  }, [setState]);

  const updateRecord = useCallback(
    (record: IRecord, newRecord: IRecord) => {
      setState({
        loading: true,
      });
      updateSpendingRecord(record, newRecord).then(async ({ status }) => {
        updateList(INPUT_RECORD_TYPE.UPDATE, record);
        await reFetch();
        if (!status) console.error("Setting Spending Record Failed.");
        handleCloseRecordModal();
      });
    },
    [updateList, reFetch, handleCloseRecordModal, setState],
  );

  const handleOpenRecordModal = useCallback(
    (record: IRecord) => {
      setState({
        open: true,
        record,
        step: RecordModalType.Step_4,
        onClose: handleCloseRecordModal,
        addCategory: () => {},
        addRecord: (newRecord) => updateRecord(record, newRecord),
      });
    },
    [setState, handleCloseRecordModal, updateRecord],
  );

  return (
    <div className="flex w-full flex-col items-center rounded-lg bg-gray-800 shadow shadow-gray-900">
      <button
        className="flex w-full flex-col rounded-lg bg-gray-800 py-2 pr-4"
        onClick={() => setOpen((prevState) => !prevState)}
      >
        <span className="flex w-full items-center justify-between">
          <span className="rounded-r-md bg-stone-400 py-1 pl-4 pr-3 font-bold text-gray-800">
            {category}
          </span>
          <span>${total}</span>
        </span>
      </button>

      <div
        className={`grid w-full overflow-hidden transition-all duration-400 ${open ? "grid-rows-1" : "grid-rows-0"}`}
      >
        <div className="row-span-1 flex flex-col divide-y divide-stone-500 px-4 py-2">
          {list.map((item) => (
            <button
              key={item.id}
              className="grid grid-cols-5 py-1 transition-colors hover:bg-stone-300/30"
              onClick={() => handleOpenRecordModal(item)}
            >
              <span
                className="col-span-1 text-left"
                title={new Date(`${item.date}T${item.time}`).toLocaleString()}
              >
                {formatLocalDate(item.date)}
              </span>
              <span
                className="col-span-3 overflow-hidden text-ellipsis text-nowrap text-left"
                title={item.desc}
              >
                {item.desc}
              </span>
              <span className="col-span-1 flex items-center justify-end">
                <span>${item.price}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        className="flex items-center justify-center text-stone-500"
        onClick={() => setOpen((prevState) => !prevState)}
      >
        <IoChevronDownOutline
          className={`size-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
};

function formatLocalDate(localDateString: string) {
  return new Date(localDateString)
    .toLocaleDateString()
    .split("/")
    .slice(1)
    .join("/");
}
