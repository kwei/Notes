"use client";

import { useTaskCtx } from "@/app/task/CtxTask";
import { TagBlock } from "@/app/task/TagBlock";
import { useDraggableTask } from "@/app/task/DraggableTask";
import { sortTags } from "@/hooks/useAllTags";
import { IMongoQueryRes, IMsgLog, ITodo } from "@/type";
import { deleteTodo } from "@/utils/deleteTodo";
import { useTaskModalStoreCtx } from "@/utils/externalStores";
import { formatPeriod } from "@/utils/formatPeriod";
import { updateTodo } from "@/utils/updateTodo";
import { format } from "date-fns";
import { useCallback, useState, MouseEvent, DragEvent, useRef } from "react";
import { IoCalendarOutline, IoClose } from "react-icons/io5";
import { MdCheckCircle, MdOutlineCheckCircleOutline } from "react-icons/md";

interface Props {
  task: ITodo;
}

const TODAY = new Date().getTime() - 24 * 60 * 60 * 1000;

export const TaskCard = (props: Props) => {
  const { task } = props;
  const { setDragged } = useDraggableTask();
  const { reFetch } = useTaskCtx();
  const { useStore: useTaskModalStore } = useTaskModalStoreCtx();
  const [, setTaskModal] = useTaskModalStore((state) => state);
  const ghostImageRef = useRef<HTMLDivElement>();
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

  return (
    <div
      draggable={true}
      onDragStart={handleOnDragStart}
      onDragEnd={handleOnDragEnd}
      className={`relative rounded-2xl border group border-solid transition-colors overflow-hidden ${isDragged ? "border-gray-d0-500/10" : "border-gray-d0-500/50 hover:border-gray-d0-500"}`}
    >
      <div className="relative flex items-center justify-center p-px">
        <div
          className={`absolute w-screen h-screen from-blue-90-500 via-green-50-500 to-red-ff-300 ${loading ? "animate-spin bg-gradient-conic" : "bg-gray-800"}`}
        ></div>
        <button
          disabled={loading}
          onClick={handleOpenContent}
          className="flex flex-col md:p-4 p-3 w-full z-20 bg-gray-800 rounded-2xl"
        >
          <span className="font-semibold text-left pl-5">{task.title}</span>
          <div className="flex items-center gap-1 py-1">
            <IoCalendarOutline
              className={`size-4 ${new Date(task.expiry ?? new Date()).getTime() < TODAY ? "text-red-ff-500" : "text-gray-500"}`}
            />
            <span className="text-xs text-gray-d0-500/50 text-start break-words">
              {formatPeriod(task.iat, task.expiry)}
            </span>
          </div>
          <div className="flex flex-col">
            {task.msgLog?.map((log) => (
              <LogBlock key={JSON.stringify(log)} log={log} />
            ))}
          </div>
          <div className="flex items-center flex-wrap mt-2 gap-2">
            {sortTags(task.tags).map((tag) => (
              <TagBlock key={tag.name} tag={tag} />
            ))}
          </div>
        </button>
      </div>
      <button
        disabled={loading}
        title="Delete Task"
        onClick={handleOnDeleteTask}
        className="absolute flex items-center justify-center z-20 top-2 right-2 hover:bg-red-ff-500 size-6 rounded-full bg-red-ff-500/50 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto"
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
          <MdCheckCircle className="size-5 text-green-600 group-hover/task-complete:text-green-500 transition-all" />
        ) : (
          <MdOutlineCheckCircleOutline className="size-5 text-gray-8b-500 group-hover/task-complete:text-gray-d0-500 transition-all" />
        )}
      </button>
    </div>
  );
};

const LogBlock = ({ log }: { log: IMsgLog }) => {
  return (
    <div className="relative flex items-center group/log">
      <div className="absolute left-0 top-0 bottom-0 flex items-center">
        <span className="ml-2 h-full px-px bg-gray-8b-500"></span>
      </div>
      <div className="absolute left-0 top-0 bottom-0 flex items-center">
        <span
          className="size-[9px] ml-[4px] bg-gray-8b-500 rounded-full group-hover/log:bg-gray-be-500 transition-colors"
          title={format(new Date(log.datetime), "yyyy/MM/dd hh:mm:ss")}
        ></span>
      </div>
      <span className="text-xs text-left pl-5 text-gray-8b-500 py-px group-hover/log:text-gray-be-500 transition-colors">
        {log.text}
      </span>
    </div>
  );
};
