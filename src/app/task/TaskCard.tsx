"use client";

import { TagBlock } from "@/app/task/TagBlock";
import { useDraggableTask } from "@/app/task/DraggableTask";
import { useFocusRef } from "@/hooks/useFocusRef";
import { Task } from "@/type";
import { formatPeriod } from "@/utils/formatPeriod";
import parse from "html-react-parser";
import Prism from "prismjs";
import { DragEvent, useCallback, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { RiNotionFill } from "react-icons/ri";

interface Props {
  task: Task;
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

  return (
    <>
      <button
        draggable={true}
        onDragStart={handleOnDragStart}
        onDragEnd={handleOnDragEnd}
        onClick={handleOpenContent}
        className={`relative flex flex-col rounded-2xl md:p-4 p-2 border border-solid transition-colors ${isDragged ? "border-gray-d0-500/10" : "border-gray-d0-500/50 hover:border-gray-d0-500"}`}
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
      </button>
      {openContent && (
        <ContentModal id={task.id} onClose={handleCloseContent} />
      )}
    </>
  );
};

const ContentModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const ref = useFocusRef<HTMLDivElement>(() => {
    onClose();
  });
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/notion/task?id=${id}`)
      .then((res) => res.json())
      .then((res: string) => {
        setContent(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (content) Prism.highlightAll();
  }, [content]);

  return (
    <div className="fixed z-30 left-0 right-0 top-0 bottom-0 bg-black/50 flex items-center justify-center">
      <div
        ref={ref}
        className="relative flex flex-col bg-[#403F44] p-8 rounded-2xl w-full md:w-2/3 md:max-h-5/6"
      >
        <button className="size-6 absolute top-4 right-4" onClick={onClose}>
          <IoClose className="w-full h-full text-black/50 hover:text-black transition-all" />
        </button>
        {loading && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="animate-spin size-6 rounded-full border-2 border-t-0 border-l-0 border-solid border-gray-400"></span>
          </div>
        )}
        <div className="flex flex-col overflow-y-auto scrollbar py-4">
          {content && parse(content)}
        </div>
        <div className="absolute bottom-4 right-8 text-sm w-full justify-end flex items-center gap-2">
          <RiNotionFill className="size-6" />
          <a
            href={`https://www.notion.so/${process.env.NEXT_PUBLIC_NOTION_TASK_TABLE_ID}?p=${id}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span className="underline">Source</span>
          </a>
        </div>
      </div>
    </div>
  );
};
