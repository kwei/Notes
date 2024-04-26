"use client";

import { useTaskCtx } from "@/app/task/CtxTask";
import { ExportTaskModal } from "@/app/task/ExportTaskModal";
import { useToolCtx } from "@/app/task/ToolCtxProvider";
import { Dropdown } from "@/components/Dropdown";
import { ITodo } from "@/type";
import { TASK_STATUS, TASK_TABLE } from "@/utils/constants";
import { filterPeriod } from "@/utils/filterPeriod";
import { filterTag } from "@/utils/filterTag";
import { formatDateString } from "@/utils/formatDateString";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IoMdDownload } from "react-icons/io";

interface Props {
  className?: string;
}

export const ToolBox = ({ className = "" }: Props) => {
  return (
    <div
      className={`w-full flex items-center justify-end gap-5 bg-gray-800 p-3 md:pr-5 md:rounded-t-3xl flex-wrap ${className}`}
    >
      <TagFilter />
      <TimeFilter />
      <SaveBtn />
    </div>
  );
};

const TagFilter = () => {
  const { list } = useTaskCtx();
  const { setSelectedTag } = useToolCtx();
  const [tag, setTag] = useState<string>();

  const allTags = useMemo(() => {
    const res = new Set<string>([]);
    Object.values(list).forEach((tasks) =>
      tasks.forEach((task) => {
        task.tags.forEach((tag) => {
          res.add(tag.name);
        });
      }),
    );
    return Array.from(res);
  }, [list]);

  const handleOnChange = useCallback((option: string) => {
    if (option !== "") {
      setTag((prevState) => {
        const newState = prevState ?? "";
        const set = new Set(newState.split("; ").filter((d) => d !== ""));
        if (set.has(option)) {
          set.delete(option);
        } else {
          set.add(option);
        }
        if (set.size === 0) return undefined;
        return Array.from(set).join("; ");
      });
    } else {
      setTag(undefined);
    }
  }, []);

  useEffect(() => {
    setSelectedTag(tag ?? "");
  }, [setSelectedTag, tag]);

  return (
    <Dropdown
      onChange={handleOnChange}
      placeHolder="Filter Tag"
      value={tag}
      className="border border-solid border-gray-d0-500 rounded-lg p-1 w-[150px]"
    >
      <Dropdown.Option label="Reset" value="" />
      {allTags.map((tag) => (
        <Dropdown.Option key={tag} label={tag} value={tag} />
      ))}
    </Dropdown>
  );
};

const TimeFilter = () => {
  const { setSelectedPeriod } = useToolCtx();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const resetRef = useRef<HTMLInputElement>(null);
  const weekRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const [checkOther, setCheckOther] = useState(false);

  const handleCheckReset = useCallback(() => {
    setStartTime("");
    setEndTime("");
    setSelectedPeriod("");
    setCheckOther(false);
  }, [setSelectedPeriod]);

  const handleCheckWeek = useCallback(() => {
    setCheckOther(false);
    const today = new Date();
    const week = today.getDay();
    const startDay = formatDateString(
      new Date(new Date().setDate(today.getDate() - (week - 1))),
    );
    const endDay = formatDateString(
      new Date(new Date().setDate(today.getDate() + (7 - week))),
    );
    setStartTime(startDay);
    setEndTime(endDay);
  }, []);

  const handleCheckMonth = useCallback(() => {
    setCheckOther(false);
    const today = new Date();
    const startDay = formatDateString(
      new Date(today.getFullYear(), today.getMonth(), 1),
    );
    const endDay = formatDateString(
      new Date(today.getFullYear(), today.getMonth() + 1, 0),
    );
    setStartTime(startDay);
    setEndTime(endDay);
  }, []);

  const handleCheckOther = useCallback(() => {
    setStartTime("");
    setEndTime("");
    setSelectedPeriod("");
    setCheckOther(true);
  }, [setSelectedPeriod]);

  useEffect(() => {
    if (startTime !== "" || endTime !== "") {
      setSelectedPeriod(`${startTime},${endTime}`);
    } else {
      setSelectedPeriod("");
    }
  }, [endTime, setSelectedPeriod, startTime]);

  return (
    <fieldset className="flex items-center gap-3 flex-wrap justify-end">
      <span className="flex items-center gap-1">
        <input
          type="radio"
          id="default"
          name="time-filter"
          className="cursor-pointer"
          ref={resetRef}
          defaultChecked={true}
          onChange={handleCheckReset}
        />
        <label htmlFor="default" className="cursor-pointer">
          預設
        </label>
      </span>

      <span className="flex items-center gap-1">
        <input
          type="radio"
          id="week"
          name="time-filter"
          className="cursor-pointer"
          ref={weekRef}
          defaultChecked={false}
          onChange={handleCheckWeek}
        />
        <label htmlFor="week" className="cursor-pointer">
          本周
        </label>
      </span>

      <span className="flex items-center gap-1">
        <input
          type="radio"
          id="month"
          name="time-filter"
          className="cursor-pointer"
          ref={monthRef}
          defaultChecked={false}
          onChange={handleCheckMonth}
        />
        <label htmlFor="month" className="cursor-pointer">
          本月
        </label>
      </span>

      <span className="flex items-center gap-1">
        <input
          type="radio"
          id="other"
          name="time-filter"
          className="cursor-pointer"
          defaultChecked={false}
          onChange={handleCheckOther}
        />
        <label htmlFor="other" className="cursor-pointer pr-2">
          其它
        </label>
        <div
          className={`flex items-center gap-2 overflow-hidden transition-all origin-left ${checkOther ? "w-[304px]" : "w-0"}`}
        >
          <input
            type="date"
            value={
              startTime !== "" ? formatDateString(new Date(startTime)) : ""
            }
            className="bg-transparent border-b border-solid border-gray-d0-500 w-[140px]"
            onChange={(e) => setStartTime(e.target.value)}
          />
          <span className="w-2 text-center">-</span>
          <input
            type="date"
            value={endTime !== "" ? formatDateString(new Date(endTime)) : ""}
            className="bg-transparent border-b border-solid border-gray-d0-500 w-[140px]"
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </span>
    </fieldset>
  );
};

const SaveBtn = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <button
        title="Save"
        className="transition-colors hover:text-blue-5F-500"
        onClick={handleOpen}
      >
        <IoMdDownload className="size-5" />
      </button>
      {open && <ExportTaskModal onClose={handleClose} />}
    </>
  );
};
