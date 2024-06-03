"use client";

import {
  IMetaConfig,
  IRecord,
  IRecordModal,
  ITaskModal,
  IToast,
  ITodo,
  IUser,
} from "@/type";
import { RecordModalType, TASK_STATUS, TOAST_TYPE } from "@/utils/constants";
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

export const {
  Provider: TaskModalProvider,
  useStoreCtx: useTaskModalStoreCtx,
} = createExternalStoreProvider<ITaskModal>({
  task: {
    detail: "Take some notes.",
    userEmail: "",
    title: "New Task",
    status: {
      name: TASK_STATUS.NEW_REQUEST,
    },
    tags: [],
  } as ITodo,
  open: false,
  action: "add",
  onClose: () => {},
  handleLoading: () => {},
});

export const { Provider: MetaProvider, useStoreCtx: useMetaStoreCtx } =
  createExternalStoreProvider<IMetaConfig>({
    filteredTag: "",
    filteredPeriod: "",
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
