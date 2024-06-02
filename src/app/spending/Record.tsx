"use client";
import { IRecord } from "@/type";
import { useMemo, useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";

export const Record = ({
  category,
  list,
}: {
  category: string;
  list: IRecord[];
}) => {
  const [open, setOpen] = useState(false);

  const total = useMemo(
    () => list.reduce((sum = 0, d) => sum + d.price, 0),
    [list],
  );

  return (
    <div className="w-full flex flex-col items-center py-2 px-4 bg-gray-800 rounded-md group">
      <button
        className="w-full flex flex-col bg-gray-800"
        onClick={() => setOpen((prevState) => !prevState)}
      >
        <span className="w-full flex items-center justify-between">
          <span>{category}</span>
          <span>${total}</span>
        </span>
      </button>

      <div
        className={`w-full grid transition-all overflow-hidden ${open ? "grid-rows-1" : "grid-rows-0"}`}
      >
        <div className="row-span-1 flex flex-col py-2 divide-y divide-stone-500">
          {list.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-5 py-1 hover:bg-stone-300/30 transition-colors"
            >
              <span className="col-span-2">
                {new Date(item.date).toLocaleDateString()}
              </span>
              <span
                className="col-span-2 text-ellipsis overflow-hidden text-nowrap"
                title={item.desc}
              >
                {item.desc}
              </span>
              <div className="col-span-1 flex items-center justify-end">
                <span>${item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="px-10 rounded-full flex items-center justify-center text-stone-500 group-hover:bg-stone-300/10"
        onClick={() => setOpen((prevState) => !prevState)}
      >
        <IoChevronDownOutline
          className={`size-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
};
