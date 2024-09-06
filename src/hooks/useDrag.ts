"use client";

import { DragEvent, useRef } from "react";

export const useDrag = <T, D>() => {
  const draggedItemRef = useRef<D | null>(null);

  const handleDragStart = (event: DragEvent<T>, data: D) => {
    draggedItemRef.current = data;
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: DragEvent<T>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event: DragEvent<T>, cb: (data: D) => void) => {
    event.preventDefault();
    if (draggedItemRef.current) {
      cb(draggedItemRef.current);
    }
    draggedItemRef.current = null;
  };

  const handleDragEnd = () => {
    draggedItemRef.current = null;
  };

  return {
    draggedItemRef,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
};
