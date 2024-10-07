"use client";

import { Accordion } from "@/components/Accordion";
import { IGroupRecord } from "@/type";
import { normalizeNumber } from "@/utils/normalizeNumber";
import { useCallback, useMemo } from "react";

export const RecordList = ({ list }: { list: IGroupRecord[] }) => {
  const getGroupTable = useCallback(() => {
    const res: Record<string, IGroupRecord[]> = {};
    list.forEach((item) => {
      if (!res[item.category]) res[item.category] = [item];
      else res[item.category].push(item);
    });
    return res;
  }, [list]);

  const getTotalCost = (list: IGroupRecord[]) => {
    return list.map((d) => d.price).reduce((total = 0, val) => total + val);
  };

  const categoryMap = useMemo(() => getGroupTable(), [getGroupTable]);

  return (
    <div className="mt-4 flex flex-col gap-2">
      {Object.keys(categoryMap).map((key) => (
        <div
          key={key}
          className="group rounded-md border border-solid border-gray-500"
        >
          <Accordion
            label={
              <Label text={key} totalCost={getTotalCost(categoryMap[key])} />
            }
          >
            <div className="flex w-full flex-col gap-1 border-t border-solid border-gray-500 py-2">
              {categoryMap[key].map((record) => (
                <Record key={record.id} record={record} />
              ))}
            </div>
          </Accordion>
        </div>
      ))}
    </div>
  );
};

const Label = ({ text, totalCost }: { text: string; totalCost: number }) => {
  return (
    <div className="flex w-full cursor-pointer select-none items-center justify-between py-2 pr-2 transition-all group-hover:brightness-125">
      <span className="rounded-r bg-gray-500 px-2 py-1 font-bold">{text}</span>
      <span>${normalizeNumber(totalCost)}</span>
    </div>
  );
};

const Record = ({ record }: { record: IGroupRecord }) => {
  return (
    <div className="grid cursor-default select-none grid-cols-5 px-2 transition-colors hover:bg-gray-500/50">
      <span className="col-span-1 text-start">
        {record.date.split("-").slice(1).join("/")}
      </span>
      <span className="col-span-3 text-start">{record.desc}</span>
      <span className="col-span-1 text-end">${record.price}</span>
    </div>
  );
};
