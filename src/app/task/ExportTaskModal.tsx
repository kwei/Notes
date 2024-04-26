"use client";

import { useTaskCtx } from "@/app/task/CtxTask";
import { useToolCtx } from "@/app/task/ToolCtxProvider";
import { useFocusRef } from "@/hooks/useFocusRef";
import { ITodo } from "@/type";
import { TASK_STATUS, TASK_TABLE, TOAST_TYPE } from "@/utils/constants";
import { useToastStoreCtx } from "@/utils/externalStores";
import { filterPeriod } from "@/utils/filterPeriod";
import { filterTag } from "@/utils/filterTag";
import { formatPeriod } from "@/utils/formatPeriod";
import { format } from "date-fns";
import { FormEvent, useCallback, useMemo, useRef } from "react";
import { IoClipboardOutline, IoClose } from "react-icons/io5";

interface Props {
  onClose: () => void;
}

export const ExportTaskModal = (props: Props) => {
  const { onClose } = props;
  const ref = useFocusRef<HTMLFormElement>(() => {
    onClose();
  });
  const { selectedTag, selectedPeriod } = useToolCtx();
  const { list } = useTaskCtx();
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const { useStore: useToastStore } = useToastStoreCtx();
  const [, setData] = useToastStore((state) => state);

  const filteredTaskTable = useMemo(() => {
    const res: Record<TASK_STATUS, ITodo[]> = {
      [TASK_STATUS.BACKLOG]: [],
      [TASK_STATUS.IN_PROGRESS]: [],
      [TASK_STATUS.NEW_REQUEST]: [],
      [TASK_STATUS.COMPLETE]: [],
    };
    Object.keys(TASK_TABLE).forEach((label) => {
      filterPeriod(
        selectedPeriod,
        filterTag(selectedTag, list[label as TASK_STATUS]),
      ).forEach((task) => {
        res[label as TASK_STATUS].push(task);
      });
    });
    return res;
  }, [list, selectedPeriod, selectedTag]);

  const formatReportString = useCallback(() => {
    let res = "";
    Object.entries(filteredTaskTable).forEach(([key, list]) => {
      if (list.length !== 0) {
        res += `## ${key}:\n`;
        list.forEach((task) => {
          res += `1. ${task.title} (${formatPeriod(task.iat, task.expiry)})\n`;
        });
        res += "\n";
      }
    });
    return res;
  }, [filteredTaskTable]);

  const handleOnSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const file = new Blob([formatReportString()], { type: "text/plain" });
      if (downloadRef.current) {
        window.URL = window.URL || window.webkitURL;
        downloadRef.current.setAttribute(
          "href",
          window.URL.createObjectURL(file),
        );
        downloadRef.current.click();
      }
      setData({
        type: TOAST_TYPE.success,
        show: true,
        msg: "成功下載",
      });
      onClose();
    },
    [formatReportString, onClose, setData],
  );

  const handleOnCopy = useCallback(() => {
    navigator.clipboard.writeText(formatReportString()).then(() => {
      setData({
        type: TOAST_TYPE.success,
        show: true,
        msg: "已複製到剪貼簿",
      });
    });
  }, [formatReportString, setData]);

  return (
    <div className="fixed z-40 left-0 right-0 top-0 bottom-0 bg-black/50 md:items-center flex justify-center items-end">
      <form
        ref={ref}
        onSubmit={handleOnSubmit}
        className="relative flex flex-col bg-[#403F44] p-5 max-w-[800px] md:py-8 md:px-10 rounded-t-2xl md:rounded-2xl w-full md:w-2/3 md:max-h-5/6"
      >
        <button
          type="button"
          className="size-6 absolute top-4 right-4"
          onClick={onClose}
        >
          <IoClose className="w-full h-full text-black/50 hover:text-black transition-all" />
        </button>
        <span className="w-full text-center mb-10 text-2xl pr-4">
          Save Your Filtered Report
        </span>

        <div className="flex items-center flex-wrap gap-2 mb-4">
          {selectedTag.split("; ").map((tag) => (
            <span
              key={tag}
              className="rounded-lg px-2 py-1 bg-gray-500 text-black"
            >
              {tag || "無標籤"}
            </span>
          ))}
        </div>

        <fieldset
          className="relative px-2 pb-2 mb-4 border border-solid border-gray-d0-500 rounded-xl"
          disabled
        >
          <legend className="px-2 ml-4">{formatTime(selectedPeriod)}</legend>
          <textarea
            name="text"
            rows={12}
            className="w-full bg-transparent resize-none px-2 pr-10 py-1 scrollbar"
            defaultValue={formatReportString()}
          />
          <IoClipboardOutline
            title="copy"
            onClick={handleOnCopy}
            className="absolute size-4 top-0 right-6 cursor-pointer transition-opacity hover:text-white"
          />
        </fieldset>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-500 hover:text-red-ff-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-5F-500 rounded-md transition-colors hover:bg-blue-00-500 hover:text-white"
          >
            Download File
          </button>
        </div>
      </form>
      <a
        ref={downloadRef}
        className="invisible w-0 h-0"
        download="代辦清單.txt"
      ></a>
    </div>
  );
};

function formatTime(period: string) {
  const [iat, exp] = period.split(",");
  let res = "";
  if (iat && iat !== "") res += `自 ${format(new Date(iat), "yyyy/MM/dd")} `;
  else res += "截";
  if (exp && exp !== "") res += `至 ${format(new Date(exp), "yyyy/MM/dd")}`;
  else res += "至今天";
  return res;
}
