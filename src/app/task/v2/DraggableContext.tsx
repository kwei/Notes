"use client";

import { useDrag } from "@/hooks/useDrag";
import { ITodo } from "@/type";
import { createContext, ReactNode, DragEvent, useContext } from "react";

export const DraggableContext = ({ children }: { children: ReactNode }) => {
  const props = useDrag<HTMLElement, ITodo>();
  return <Ctx.Provider value={props}>{children}</Ctx.Provider>;
};

const Ctx = createContext<{
  draggedItem: ITodo | null;
  handleDragStart: (_event: DragEvent<HTMLElement>, data: ITodo) => void;
  handleDragEnd: () => void;
  handleDragOver: (_event: DragEvent<HTMLElement>) => void;
  handleDrop: (
    _event: DragEvent<HTMLElement>,
    _cb: (data: ITodo) => void,
  ) => void;
}>({
  draggedItem: null,
  handleDragStart: (_event: DragEvent<HTMLElement>, _data: ITodo) => {},
  handleDragEnd: () => {},
  handleDragOver: (_event: DragEvent<HTMLElement>) => {},
  handleDrop: (
    _event: DragEvent<HTMLElement>,
    _cb: (data: ITodo) => void,
  ) => {},
});

export const useDraggableContext = () => useContext(Ctx);
