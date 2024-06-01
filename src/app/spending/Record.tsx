"use client";
import { IRecord } from "@/type";
import { useMemo, useState } from "react";

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
    <div className="w-full flex flex-col py-2  px-4 bg-gray-800 rounded-md">
      <button
        className="w-full flex items-center justify-between bg-gray-800"
        onClick={() => setOpen((prevState) => !prevState)}
      >
        <span>{category}</span>
        <span>${total}</span>
      </button>
      <div
        className={`grid transition-all overflow-hidden ${open ? "grid-rows-1" : "grid-rows-0"}`}
      >
        <div className="row-span-1 flex flex-col pt-2">
          {list.map((item) => (
            <div
              key={item.id}
              className="border-t border-solid border-stone-500 grid grid-cols-5 py-1"
            >
              <span className="col-span-2">
                {new Date(item.date).toLocaleDateString()}
              </span>
              <span className="col-span-2">{item.desc}</span>
              <div className="col-span-1 flex items-center justify-end">
                <span>${item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
