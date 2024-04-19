"use client";

import { useTaskCtx } from "@/app/task/CtxTask";
import { useTollCtx } from "@/app/task/ToolCtxProvider";
import { Dropdown } from "@/components/Dropdown";
import { formatDateString } from "@/utils/formatDateString";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IoMdDownload } from "react-icons/io";

interface Props {
  className?: string;
}

export const ToolBox = ({ className = "" }: Props) => {
  return (
    <div
      className={`w-full flex items-center justify-end gap-5 bg-gray-800 p-3 pr-5 md:rounded-t-3xl flex-wrap ${className}`}
    >
      <TagFilter />
      <TimeFilter />
      <SaveBtn />
    </div>
  );
};

const TagFilter = () => {
  const { list } = useTaskCtx();
  const { setSelectedTag } = useTollCtx();
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
      className="border border-solid border-gray-d0-500 rounded-lg py-1 w-[150px]"
    >
      <Dropdown.Option label="Reset" value="" />
      {allTags.map((tag) => (
        <Dropdown.Option key={tag} label={tag} value={tag} />
      ))}
    </Dropdown>
  );
};

const TimeFilter = () => {
  const { setSelectedPeriod } = useTollCtx();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [checkWeek, setCheckWeek] = useState(false);
  const [checkMonth, setCheckMonth] = useState(false);

  useEffect(() => {
    if (checkWeek) {
      setCheckMonth(false);
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
    }
  }, [checkWeek]);

  useEffect(() => {
    if (checkMonth) {
      setCheckWeek(false);
      const today = new Date();
      const startDay = formatDateString(
        new Date(today.getFullYear(), today.getMonth(), 1),
      );
      const endDay = formatDateString(
        new Date(today.getFullYear(), today.getMonth() + 1, 0),
      );
      setStartTime(startDay);
      setEndTime(endDay);
    }
  }, [checkMonth]);

  useEffect(() => {
    if (!checkWeek && !checkMonth) {
      setStartTime("");
      setEndTime("");
      setSelectedPeriod("");
    }
  }, [checkMonth, checkWeek, setSelectedPeriod]);

  useEffect(() => {
    if (startTime !== "" || endTime !== "") {
      setSelectedPeriod(`${startTime},${endTime}`);
    } else {
      setSelectedPeriod("");
    }
  }, [endTime, setSelectedPeriod, startTime]);

  return (
    <div className="flex items-center gap-3 flex-wrap justify-end max-md:hidden">
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startTime !== "" ? formatDateString(new Date(startTime)) : ""}
          className="bg-transparent border-b border-solid border-gray-d0-500 w-[140px]"
          onChange={(e) => setStartTime(e.target.value)}
        />
        -
        <input
          type="date"
          value={endTime !== "" ? formatDateString(new Date(endTime)) : ""}
          className="bg-transparent border-b border-solid border-gray-d0-500 w-[140px]"
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
      <span className="flex items-center gap-1">
        <input
          type="checkbox"
          id="week"
          checked={checkWeek}
          className="cursor-pointer"
          onChange={(e) => setCheckWeek(e.target.checked)}
        />
        <label htmlFor="week" className="cursor-pointer">
          This Week
        </label>
      </span>
      <span className="flex items-center gap-1">
        <input
          type="checkbox"
          id="month"
          checked={checkMonth}
          className="cursor-pointer"
          onChange={(e) => setCheckMonth(e.target.checked)}
        />
        <label htmlFor="month" className="cursor-pointer">
          This Month
        </label>
      </span>
    </div>
  );
};

const SaveBtn = () => {
  const save = useCallback(() => {}, []);
  return (
    <button
      title="Save"
      className="transition-colors hover:text-blue-5F-500 max-md:hidden"
      onClick={save}
    >
      <IoMdDownload className="size-5" />
    </button>
  );
};
