"use client";

import { IMsgLog } from "@/type";
import { format } from "date-fns";
import { KeyboardEvent, useRef } from "react";
import { IoTrashOutline } from "react-icons/io5";

interface Props {
  msg?: IMsgLog;
  addLog?: (data: IMsgLog) => void;
  removeLog?: (data: IMsgLog) => void;
}

export const MsgLog = (props: Props) => {
  const { msg, addLog, removeLog } = props;
  const msgRef = useRef<HTMLInputElement>(null);

  const syncData = () => {
    if (!msgRef.current) return;
    const text = msgRef.current.value ?? "";
    if (text === "") return;
    let datetime = new Date().toISOString();
    if (msg) {
      datetime = msg.datetime;
    }
    const newMsg = {
      text,
      datetime,
    };
    if (addLog) {
      addLog(newMsg);
      msgRef.current.value = "";
    }
  };

  const handleOnKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      syncData();
      (event.target as HTMLInputElement).blur();
    }
  };

  const handleOnDeleteLog = () => {
    if (removeLog && msg) removeLog(msg);
  };

  return (
    <div className="relative w-full flex items-center px-2 py-px pl-6 group">
      <div className="absolute left-0 top-0 bottom-0 flex items-center">
        <span className="ml-2 h-full pl-[3px] bg-gray-be-500"></span>
      </div>
      <div className="absolute left-0 top-4 bottom-0 flex">
        <span className="size-[13px] ml-[3px] bg-gray-be-500 rounded-full group-hover:bg-gray-eb-500"></span>
      </div>
      {msg?.datetime && (
        <span className="text-xs text-gray-d0-500/50 select-none flex flex-col items-end pr-2 group-hover:text-gray-d0-500/70">
          <span>{format(new Date(msg.datetime), "yyy/MM/dd")}</span>
          <span>{format(new Date(msg.datetime), "hh:mm:ss")}</span>
        </span>
      )}
      {msg ? (
        <span className="flex-1 break-all break-words p-2 py-1 border border-solid border-transparent rounded-md group-hover:bg-gray-d0-500/50 transition-colors">
          {msg.text}
        </span>
      ) : (
        <input
          ref={msgRef}
          type="text"
          onKeyDown={handleOnKeyDown}
          placeholder="寫下新日誌，也可貼上連結..."
          className="w-full text-white p-2 py-1 bg-transparent cursor-pointer focus:cursor-text border border-solid border-transparent rounded-md focus:border-gray-d0-500 focus:outline-0 group-hover:bg-gray-d0-500/50 transition-colors"
        />
      )}

      {msg && (
        <button
          title="Delete Log"
          type="button"
          onClick={handleOnDeleteLog}
          className="flex items-center justify-center hover:text-red-ff-500 size-6 text-red-ff-500/50 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto"
        >
          <IoTrashOutline />
        </button>
      )}
    </div>
  );
};
