"use client";

import { TagBlock } from "@/app/task/TagBlock";
import { useDraggableTask } from "@/app/task/DraggableTask";
import { useFocusRef } from "@/hooks/useFocusRef";
import { ITodo } from "@/type";
import { formatPeriod } from "@/utils/formatPeriod";
import { useCallback, useState } from "react";
import { IoClose } from "react-icons/io5";

interface Props {
  task: ITodo;
}

export const TaskCard = (props: Props) => {
  const { task } = props;
  const { setDragged } = useDraggableTask();
  const [openContent, setOpenContent] = useState(false);
  const [isDragged, setIsDragged] = useState(false);

  function handleOpenContent() {
    setOpenContent(true);
  }

  function handleCloseContent() {
    setOpenContent(false);
  }

  const handleOnDragStart = useCallback(() => {
    setDragged(task);
    setIsDragged(true);
  }, [setDragged, task]);

  function handleOnDragEnd() {
    setIsDragged(false);
  }

  function handleOnDeleteTask() {
    console.log("Delete Task");
  }

  return (
    <>
      <button
        draggable={true}
        onDragStart={handleOnDragStart}
        onDragEnd={handleOnDragEnd}
        onClick={handleOpenContent}
        className={`relative flex flex-col rounded-2xl md:p-4 p-2 border group border-solid transition-colors ${isDragged ? "border-gray-d0-500/10" : "border-gray-d0-500/50 hover:border-gray-d0-500"}`}
      >
        <span className="font-semibold">{task.title}</span>
        <div className="text-xs text-gray-d0-500/50">
          {formatPeriod(task.iat, task.expiry)}
        </div>
        <div className="flex items-center flex-wrap mt-2 gap-2">
          {task.tags.map((tag) => (
            <TagBlock key={tag.name} tag={tag} />
          ))}
        </div>
        <div
          title="Delete Task"
          onClick={handleOnDeleteTask}
          className="absolute flex items-center justify-center z-20 -top-2 -right-2 hover:bg-red-ff-500 size-6 rounded-full bg-red-ff-500/50 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto"
        >
          <IoClose />
        </div>
      </button>
      {openContent && <ContentModal task={task} onClose={handleCloseContent} />}
    </>
  );
};

const ContentModal = ({
  task,
  onClose,
}: {
  task: ITodo;
  onClose: () => void;
}) => {
  const ref = useFocusRef<HTMLDivElement>(() => {
    onClose();
  });

  return (
    <div className="fixed z-30 left-0 right-0 top-0 bottom-0 bg-black/50 flex items-center justify-center">
      <div
        ref={ref}
        className="relative flex flex-col bg-[#403F44] p-8 rounded-2xl w-full md:w-2/3 md:max-h-5/6"
      >
        <button className="size-6 absolute top-4 right-4" onClick={onClose}>
          <IoClose className="w-full h-full text-black/50 hover:text-black transition-all" />
        </button>
      </div>
    </div>
  );
};
