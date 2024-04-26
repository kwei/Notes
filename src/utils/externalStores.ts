"use client";

import { IToast, IUser } from "@/type";
import { TOAST_TYPE } from "@/utils/constants";
import { createExternalStoreProvider } from "@/utils/createExternalStoreProvider";

export const { Provider: UserProvider, useStoreCtx: useUserStoreCtx } =
  createExternalStoreProvider<IUser>({
    name: "",
    email: "",
    image: "",
  });

export const { Provider: ToastProvider, useStoreCtx: useToastStoreCtx } =
  createExternalStoreProvider<IToast>({
    type: TOAST_TYPE.info,
    show: false,
    msg: "Some message...",
  });
