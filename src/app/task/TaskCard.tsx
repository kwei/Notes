"use client";

import { useTaskCtx } from "@/app/task/CtxTask";
import { TagBlock } from "@/app/task/TagBlock";
import { useDraggableTask } from "@/app/task/DraggableTask";
import { sortTags } from "@/hooks/useAllTags";
import { IMongoQueryRes, IMsgLog, ITodo } from "@/type";
import { BASE_URL, URL_REGEX } from "@/utils/constants";
import { deleteTodo } from "@/utils/deleteTodo";
import { useTaskModalStoreCtx } from "@/utils/externalStores";
import { formatPeriod } from "@/utils/formatPeriod";
import { updateTodo } from "@/utils/updateTodo";
import { format } from "date-fns";
import Image from "next/image";
import {
  useCallback,
  useState,
  MouseEvent,
  DragEvent,
  useRef,
  useEffect,
} from "react";
import { IoCalendarOutline, IoClose } from "react-icons/io5";
import { MdCheckCircle, MdOutlineCheckCircleOutline } from "react-icons/md";

interface Props {
  task: ITodo;
  isComplete: boolean;
}

const TODAY = new Date().getTime() - 24 * 60 * 60 * 1000;

export const TaskCard = (props: Props) => {
  const { task, isComplete } = props;
  const { setDragged } = useDraggableTask();
  const { reFetch } = useTaskCtx();
  const { useStore: useTaskModalStore } = useTaskModalStoreCtx();
  const [, setTaskModal] = useTaskModalStore((state) => state);
  const ghostImageRef = useRef<HTMLDivElement>();
  const neonCursorRef = useRef<HTMLDivElement>(null);
  const [isDragged, setIsDragged] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCloseContent = useCallback(() => {
    if (!loading) setTaskModal({ open: false });
  }, [loading, setTaskModal]);

  const handleOpenContent = useCallback(() => {
    if (!loading) {
      setTaskModal({
        action: "update",
        task,
        onClose: handleCloseContent,
        handleLoading: setLoading,
      });
      setTaskModal({ open: true });
    }
  }, [handleCloseContent, loading, setTaskModal, task]);

  const handleOnDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (loading) return false;
      const element = event.target as HTMLDivElement;
      const ghostElement = element.cloneNode(true) as HTMLDivElement;
      ghostImageRef.current = ghostElement;
      ghostElement.classList.add("!fixed", "-left-full");
      ghostElement.style.width = element.getBoundingClientRect().width + "px";
      ghostElement.style.height = element.getBoundingClientRect().height + "px";
      document.body.appendChild(ghostElement);
      event.dataTransfer.setDragImage(
        ghostElement,
        event.clientX - element.getBoundingClientRect().left,
        event.clientY - element.getBoundingClientRect().top,
      );
      setDragged(task);
      setIsDragged(true);
    },
    [loading, setDragged, task],
  );

  function handleOnDragEnd() {
    if (ghostImageRef.current) {
      ghostImageRef.current.remove();
    }
    setIsDragged(false);
  }

  const handleOnDeleteTask = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (window.confirm(`確定要刪除任務【${task.title}】嗎?`)) {
        setLoading(true);
        deleteTodo(task)
          .then((res: IMongoQueryRes) => {
            console.log(res.status, JSON.parse(res.message));
          })
          .finally(() => {
            reFetch().finally(() => {
              setLoading(false);
            });
          });
      }
    },
    [reFetch, task],
  );

  const handleOnChangeTaskStatus = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setLoading(true);
      updateTodo(task, { ...task, complete: !task.complete })
        .then((res: IMongoQueryRes) => {
          console.log(res.status, JSON.parse(res.message));
        })
        .finally(() => {
          reFetch().finally(() => {
            setLoading(false);
          });
        });
    },
    [reFetch, task],
  );

  function handleOnMouseHover(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;
    const parent = neonCursorRef.current?.parentElement;
    if (parent && neonCursorRef.current) {
      const rect = parent.getBoundingClientRect();
      const offsetTop = y - rect.top;
      const offsetBottom = rect.bottom - y;
      const offsetLeft = x - rect.left;
      const offsetRight = rect.right - x;
      if (
        offsetTop < offsetBottom &&
        offsetTop < offsetLeft &&
        offsetTop < offsetRight
      ) {
        neonCursorRef.current.style.top = "-48px";
        neonCursorRef.current.style.left = `${x - rect.x - 16}px`;
      } else if (
        offsetBottom < offsetTop &&
        offsetBottom < offsetLeft &&
        offsetBottom < offsetRight
      ) {
        neonCursorRef.current.style.top = `${rect.height - 16}px`;
        neonCursorRef.current.style.left = `${x - rect.x - 16}px`;
      } else if (
        offsetLeft < offsetTop &&
        offsetLeft < offsetBottom &&
        offsetLeft < offsetRight
      ) {
        neonCursorRef.current.style.top = `${y - rect.y - 16}px`;
        neonCursorRef.current.style.left = "-48px";
      } else if (
        offsetRight < offsetTop &&
        offsetRight < offsetBottom &&
        offsetRight < offsetLeft
      ) {
        neonCursorRef.current.style.top = `${y - rect.y - 16}px`;
        neonCursorRef.current.style.left = `${rect.width - 16}px`;
      }
    }
  }

  const handleOnMouseLeave = useCallback(() => {
    if (!isComplete && neonCursorRef.current) {
      neonCursorRef.current.classList.add("opacity-0");
      neonCursorRef.current.classList.remove("opacity-100");
    }
  }, [isComplete]);

  const handleOnMouseEnter = useCallback(() => {
    if (!isComplete && neonCursorRef.current) {
      neonCursorRef.current.classList.add("opacity-100");
      neonCursorRef.current.classList.remove("opacity-0");
    }
  }, [isComplete]);

  return (
    <div
      draggable={true}
      onDragStart={handleOnDragStart}
      onDragEnd={handleOnDragEnd}
      onMouseMove={handleOnMouseHover}
      onMouseLeave={handleOnMouseLeave}
      onMouseEnter={handleOnMouseEnter}
      className={`relative rounded-2xl border group border-solid transition-colors overflow-hidden ${isDragged ? "border-gray-d0-500/10" : `border-gray-d0-500/50`}`}
    >
      <div className="relative flex items-center justify-center p-px">
        <div
          className={`absolute w-screen h-screen from-blue-90-500 via-green-50-500 to-red-ff-300 ${loading ? "animate-spin bg-gradient-conic" : "bg-gray-800"}`}
        ></div>
        <div className="absolute top-0 bottom-0 left-0 right-0 rounded-2xl blur-3xl bg-gray-800">
          <div
            ref={neonCursorRef}
            className="absolute opacity-0 rounded-full size-16 shadow-neon-cyan bg-blue-7d-500"
          ></div>
        </div>
        <div className="flex flex-col md:p-4 p-3 w-full z-20 rounded-2xl">
          <button
            disabled={loading}
            onClick={handleOpenContent}
            className={`font-semibold text-left pl-5 transition-colors ${isComplete ? "text-gray-8b-500" : "hover:text-green-50-500"}`}
          >
            {task.title}
          </button>
          <div className="flex items-center gap-1 py-1">
            <IoCalendarOutline
              className={`size-4 ${!isComplete && new Date(task.expiry ?? new Date()).getTime() < TODAY ? "text-red-ff-500" : "text-gray-500"}`}
            />
            <span className="text-xs text-gray-d0-500/50 text-start break-words">
              {formatPeriod(task.iat, task.expiry)}
            </span>
          </div>
          <div className="flex flex-col w-full">
            {task.msgLog?.map((log) => (
              <LogBlock key={JSON.stringify(log)} log={log} />
            ))}
          </div>
          <div
            className={`flex items-center flex-wrap mt-2 gap-2 ${isComplete ? "opacity-50" : "opacity-100"}`}
          >
            {sortTags(task.tags).map((tag) => (
              <TagBlock key={tag.name} tag={tag} />
            ))}
          </div>
        </div>
      </div>
      <button
        disabled={loading}
        title="Delete Task"
        onClick={handleOnDeleteTask}
        className="absolute flex items-center justify-center z-20 top-1 right-1 hover:bg-red-ff-500 size-6 rounded-full bg-red-ff-500/50 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto"
      >
        <IoClose className="size-4" />
      </button>
      <button
        disabled={loading}
        title="Complete Task"
        onClick={handleOnChangeTaskStatus}
        className="absolute flex items-center justify-center z-20 top-4 left-2 size-6 rounded-full group/task-complete"
      >
        {task.complete ? (
          <MdCheckCircle
            className={`size-5 group-hover/task-complete:text-green-500 transition-all ${isComplete ? "text-green-600/50" : "text-green-600"}`}
          />
        ) : (
          <MdOutlineCheckCircleOutline className="size-5 text-gray-8b-500 group-hover/task-complete:text-gray-d0-500 transition-all" />
        )}
      </button>
    </div>
  );
};

const LogBlock = ({ log }: { log: IMsgLog }) => {
  const [previewData, setPreviewData] = useState<
    Set<{
      title: string;
      desc: string;
      image: string;
    }>
  >(new Set([]));

  const parseLink = useCallback(async () => {
    for (const text of log.text.split(" ")) {
      const matchRes = text.match(URL_REGEX);
      if (matchRes) {
        const url = matchRes[0];
        const response = await fetch(
          `${BASE_URL}/api/external/externalHtml?link=${url}`,
        );
        const data = await response.json();
        if (data === "") {
          break;
        }
        const doc = new DOMParser().parseFromString(data, "text/html");
        const title = doc.querySelector("title")?.textContent || "";
        const desc =
          doc
            .querySelector('meta[name="description"]')
            ?.getAttribute("content") || "";
        const image =
          doc
            .querySelector('meta[property="og:image"]')
            ?.getAttribute("content") || "";
        const externalData = {
          title,
          desc,
          image,
        };
        setPreviewData((prevState) => {
          const dataList = Array.from(prevState);
          const newState = new Set(dataList);
          if (dataList.some((d) => d.title === externalData.title)) {
            return prevState;
          } else {
            newState.add(externalData);
            return newState;
          }
        });
      }
    }
  }, [log.text]);

  useEffect(() => {
    parseLink().then();
  }, [parseLink]);

  return (
    <div className="relative w-full flex items-center group/log">
      <div className="absolute left-0 top-0 bottom-0 flex items-center">
        <span className="ml-2 h-full pl-px bg-gray-8b-500/50"></span>
      </div>
      <div className="absolute left-0 top-1 bottom-0 flex items-start">
        <span
          className="size-[9px] ml-[4px] bg-gray-8b-500 rounded-full group-hover/log:bg-gray-be-500 transition-colors"
          title={format(new Date(log.datetime), "yyyy/MM/dd hh:mm:ss")}
        ></span>
      </div>
      <span
        className="relative flex flex-col w-full text-xs text-left pl-5 text-gray-8b-500 py-px group-hover/log:text-gray-be-500 transition-colors"
        title={log.text}
      >
        <span className="w-full text-nowrap overflow-x-hidden text-ellipsis">
          {log.text}
        </span>
        <div className="flex flex-col gap-1 mt-1">
          {Array.from(previewData).map((data) => (
            <div
              key={data.title}
              className="flex flex-row rounded-md bg-gray-700 p-1"
            >
              {data.image !== "" && (
                <div className="w-8 flex shrink-0">
                  <Image
                    src={data.image}
                    alt={data.title}
                    className="m-0 mr-1 w-full object-contain overflow-hidden"
                    width={128}
                    height={128}
                    unoptimized
                    priority
                  />
                </div>
              )}
              <div className="flex flex-col gap-px">
                <span className="text-xs font-semibold">{data.title}</span>
                <span className="text-xs">{data.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </span>
    </div>
  );
};
