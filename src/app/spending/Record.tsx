"use client";
import { useRecordHandlerCtx } from "@/app/spending/RecordContextProvider";
import { Accordion } from "@/components/Accordion";
import { IRecord } from "@/type";
import { INPUT_RECORD_TYPE, RecordModalType } from "@/utils/constants";
import { useRecordModalCtx } from "@/utils/externalStores";
import { normalizeNumber } from "@/utils/normalizeNumber";
import { updateSpendingRecord } from "@/utils/updateSpendingRecord";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [sortedList, setSortedList] = useState<IRecord[]>([]);

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

  useEffect(() => {
    const worker = new Worker("sortRecordSW.js");
    worker.onmessage = (event) => {
      const { data } = event.data;
      setSortedList(data);
    };
    worker.postMessage({ data: list });
  }, [list]);

  return (
    <div className="bg-gray-40-300 relative flex w-full flex-col items-center rounded-lg pb-3">
      <Accordion
        label={
          <span className="flex w-full cursor-pointer select-none items-center justify-between">
            <span className="rounded-r-md bg-stone-400 py-1 pl-4 pr-3 font-bold text-gray-800">
              {category}
            </span>
            <span>${normalizeNumber(Math.abs(total))}</span>

            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center">
              <IoChevronDownOutline className="size-3 text-stone-500 group-open/accordion:rotate-180" />
            </div>
          </span>
        }
        className="bg-gray-40-300 flex w-full flex-col rounded-lg py-2 pr-4"
      >
        <div className="row-span-1 flex flex-col divide-y divide-stone-500 px-4 py-2">
          {sortedList.map((item) => (
            <Item key={item.id} item={item} onClick={handleOpenRecordModal} />
          ))}
        </div>
      </Accordion>
    </div>
  );
};

const Item = ({
  item,
  onClick,
}: {
  item: IRecord;
  onClick: (item: IRecord) => void;
}) => {
  const handleOnClick = useCallback(() => {
    onClick(item);
  }, [item, onClick]);
  return (
    <button
      className="grid select-none grid-cols-5 py-1 transition-colors hover:bg-stone-300/30"
      onClick={handleOnClick}
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
        <span>${normalizeNumber(item.price)}</span>
      </span>
    </button>
  );
};

function formatLocalDate(localDateString: string) {
  return new Date(localDateString)
    .toLocaleDateString()
    .split("/")
    .slice(1)
    .join("/");
}
