import { useDraggableContext } from "@/app/task/v2/DraggableContext";
import { Tag } from "@/app/task/v2/Tag";
import { useTaskModalContext } from "@/app/task/v2/TaskModalContext";
import { ITodo } from "@/type";
import { formatPeriod } from "@/utils/formatPeriod";
import { useCallback, DragEvent, useState, useMemo, useEffect } from "react";

export const TaskCard = ({ task }: { task: ITodo }) => {
  const { setTask } = useTaskModalContext();
  const { handleDragEnd, handleDragStart, loading } = useDraggableContext();
  const [isDragged, setIsDragged] = useState(false);

  const isDragging = useMemo(() => isDragged && loading, [isDragged, loading]);

  const onDragStart = useCallback(
    (event: DragEvent<HTMLButtonElement>) => {
      if (handleDragStart) {
        handleDragStart(event, task);
        setIsDragged(true);
      }
    },
    [handleDragStart, task],
  );

  const onDragEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  useEffect(() => {
    if (!loading) {
      setIsDragged(false);
    }
  }, [loading]);

  return (
    <button
      type="button"
      title={task.title}
      onClick={() => setTask(task)}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      draggable
      className="relative w-full shrink-0 overflow-hidden rounded p-px hover:cursor-pointer"
    >
      <div
        className={`absolute bottom-0 left-0 right-0 top-0 z-0 block ${isDragging ? "scale-[100]" : "scale-100"} rounded`}
      >
        <span
          className={`relative block h-full w-full ${isDragging ? "animate-spin bg-gradient-conic from-blue-90-500 via-green-50-500 to-red-ff-300" : "bg-gray-500"}`}
        ></span>
      </div>
      <div className="relative z-10 flex flex-col rounded bg-gray-40-500 px-2 py-3 transition-all hover:brightness-110">
        <span className="text-start text-sm">{task.title}</span>
        <span className="text-start text-xs text-gray-500">
          {formatPeriod(task.iat, task.expiry)}
        </span>
        {task.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-3 text-xs">
            {task.tags.map((tag, i) => (
              <Tag key={`${tag.name}-${i.toString()}`} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </button>
  );
};
