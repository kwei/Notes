"use client";

import { createDraggableCtx } from "@/hooks/createDraggableCtx";
import { ITodo } from "@/type";
import { ReactNode, useContext } from "react";

const { Ctx, CtxProvider } = createDraggableCtx<ITodo>();

interface Props {
  children: ReactNode;
}

export function DraggableTask(props: Props) {
  return <CtxProvider>{props.children}</CtxProvider>;
}

export const useDraggableTask = () => {
  return useContext(Ctx);
};
