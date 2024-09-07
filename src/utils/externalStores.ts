"use client";

import {
  IRecordModal,
  IUser,
} from "@/type";
import { RecordModalType } from "@/utils/constants";
import { createExternalStoreProvider } from "@/utils/createExternalStoreProvider";

export const { Provider: UserProvider, useStoreCtx: useUserStoreCtx } =
  createExternalStoreProvider<IUser>({
    name: "",
    email: "",
    image: "",
  });

export const { Provider: RecordModalProvider, useStoreCtx: useRecordModalCtx } =
  createExternalStoreProvider<IRecordModal>({
    step: RecordModalType.Step_1,
    open: false,
    loading: false,
    addCategory: () => {},
    addRecord: () => {},
    onClose: () => {},
  });
