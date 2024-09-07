"use client";

import { DragEvent, useState } from "react";

export const useDrag = <T, D>() => {
  const [draggedItem, setDraggedItem] = useState<D | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDragStart = (event: DragEvent<T>, data: D) => {
    setDraggedItem(data);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: DragEvent<T>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event: DragEvent<T>, cb: (data: D) => Promise<void>) => {
    event.preventDefault();
    if (draggedItem) {
      setLoading(true);
      cb(draggedItem).then(() => {
        setLoading(false);
      });
    }
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return {
    loading,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
};
