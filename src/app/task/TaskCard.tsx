"use client";

import { useTaskCtx } from "@/app/task/CtxTask";
import { TagBlock } from "@/app/task/TagBlock";
import { useDraggableTask } from "@/app/task/DraggableTask";
import { TaskModal } from "@/app/task/TaskModal";
import { IMongoQueryRes, ITodo } from "@/type";
import { deleteTodo } from "@/utils/deleteTodo";
import { formatPeriod } from "@/utils/formatPeriod";
import { useCallback, useState, MouseEvent } from "react";
import { IoClose, IoTimeOutline } from "react-icons/io5";

interface Props {
  task: ITodo;
}

const TODAY = new Date().getTime();

export const TaskCard = (props: Props) => {
  const { task } = props;
  const { setDragged } = useDraggableTask();
  const { reFetch } = useTaskCtx();
  const [openContent, setOpenContent] = useState(false);
  const [isDragged, setIsDragged] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleOpenContent() {
    setOpenContent(true);
  }

  function handleCloseContent() {
    setOpenContent(false);
  }

  function handleSetLoading(status: boolean) {
    setLoading(status);
  }

  const handleOnDragStart = useCallback(
    (/*event: DragEvent<HTMLDivElement>*/) => {
      // const element = document.getElementById(`task-card-${task.id}`);
      // if (element) {
      //   html2canvas(element).then((canvas) => {
      //     const img = createElement('img')
      //     event.dataTransfer.setDragImage(canvas.toDataURL('image/png'), 0, 0);
      //   });
      // }
      setDragged(task);
      setIsDragged(true);
    },
    [setDragged, task],
  );

  function handleOnDragEnd() {
    setIsDragged(false);
  }

  function handleOnDeleteTask(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setLoading(true);
    deleteTodo(task)
      .then((res: IMongoQueryRes) => {
        console.log(res.status, JSON.parse(res.message));
      })
      .finally(() => {
        setLoading(false);
        reFetch().finally();
      });
  }

  return (
    <>
      <div
        id={`task-card-${task.id}`}
        draggable={true}
        onDragStart={handleOnDragStart}
        onDragEnd={handleOnDragEnd}
        className={`relative rounded-2xl border group border-solid transition-colors overflow-hidden ${isDragged ? "border-gray-d0-500/10" : "border-gray-d0-500/50 hover:border-gray-d0-500"}`}
      >
        <div className="relative flex items-center justify-center p-px">
          <div
            className={`absolute size-[300px] from-blue-90-500 via-green-50-500 to-red-ff-300 ${loading ? "animate-spin bg-gradient-conic" : "bg-gray-800"}`}
          ></div>
          <button
            disabled={loading}
            onClick={handleOpenContent}
            className="flex flex-col md:p-4 p-3 w-full z-20 bg-gray-800 rounded-2xl"
          >
            <span className="font-semibold">{task.title}</span>
            <div className="flex items-center gap-1 py-1">
              <IoTimeOutline
                className={`size-4 ${new Date(task.expiry ?? new Date()).getTime() < TODAY ? "text-red-ff-500" : "text-gray-500"}`}
              />
              <span className="text-xs text-gray-d0-500/50 text-start break-words">
                {formatPeriod(task.iat, task.expiry)}
              </span>
            </div>
            <div className="flex items-center flex-wrap mt-2 gap-2">
              {task.tags.map((tag) => (
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
          <IoClose />
        </button>
      </div>
      <TaskModal
        action="update"
        open={openContent}
        task={task}
        onClose={handleCloseContent}
        handleLoading={handleSetLoading}
      />
    </>
  );
};
