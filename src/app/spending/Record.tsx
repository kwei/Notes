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
    <div className="w-full flex flex-col items-center bg-gray-800 rounded-lg shadow shadow-gray-900">
      <button
        className="w-full flex flex-col bg-gray-800 pr-4 py-2 rounded-lg"
        onClick={() => setOpen((prevState) => !prevState)}
      >
        <span className="w-full flex items-center justify-between">
          <span className="rounded-r-md bg-stone-400 py-1 pl-4 pr-3 text-gray-800 font-bold">
            {category}
          </span>
          <span>${total}</span>
        </span>
      </button>

      <div
        className={`w-full grid transition-all overflow-hidden ${open ? "grid-rows-1" : "grid-rows-0"}`}
      >
        <div className="row-span-1 flex flex-col py-2 px-4 divide-y divide-stone-500">
          {list.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-5 py-1 hover:bg-stone-300/30 transition-colors"
            >
              <span
                className="col-span-1"
                title={new Date(`${item.date}T${item.time}`).toLocaleString()}
              >
                {formatLocalDate(item.date)}
              </span>
              <span
                className="col-span-3 text-ellipsis overflow-hidden text-nowrap"
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
