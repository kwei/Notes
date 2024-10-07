"use client";

import { IGroup, IGroupRecord } from "@/type";
import { deleteGroupSpend } from "@/utils/deleteGroupSpend";
import { getGroupInfo } from "@/utils/getGroupInfo";
import { getGroupSpend } from "@/utils/getGroupSpend";
import { setGroupSpend } from "@/utils/setGroupSpend";
import { updateGroupSpend } from "@/utils/updateGroupSpend";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ContextValue = {
  loading: boolean;
  loadingRecord: boolean;
  groupInfo?: IGroup;
  spending: IGroupRecord[];
  getAllSpending: () => void;
  setNewSpending: (data: IGroupRecord) => Promise<void>;
  updateSpending: (
    filter: Partial<IGroupRecord>,
    data: IGroupRecord,
  ) => Promise<void>;
  deleteSpending: (filter: Partial<IGroupRecord>) => Promise<void>;
};

const initContext: ContextValue = {
  loading: true,
  loadingRecord: true,
  groupInfo: undefined,
  spending: [],
  getAllSpending: () => {},
  setNewSpending: async (_data: IGroupRecord) => {},
  updateSpending: async (
    _filter: Partial<IGroupRecord>,
    _data: IGroupRecord,
  ) => {},
  deleteSpending: async (_filter: Partial<IGroupRecord>) => {},
};

export const RecordContext = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const groupId = useMemo(() => pathname.split("/").pop(), [pathname]);
  const [loading, setLoading] = useState(true);
  const [loadingRecord, setLoadingRecord] = useState(true);
  const [groupInfo, setGroupInfo] = useState<IGroup>();
  const [spending, setSpending] = useState<IGroupRecord[]>([]);

  const getAllSpending = useCallback(() => {
    if (!groupInfo?.groupId) return;
    setLoadingRecord(true);
    getGroupSpend({})
      .then((res) => {
        if (res.status) return JSON.parse(res.message) as IGroupRecord[];
      })
      .then((res) => res?.filter((d) => d.groupId === groupInfo.groupId) ?? [])
      .then((res) => setSpending(res))
      .then(() => {
        setLoadingRecord(false);
      });
  }, [groupInfo?.groupId]);

  const setNewSpending = useCallback(
    async (data: IGroupRecord) => {
      if (!groupInfo?.groupId) return;
      await setGroupSpend({ ...data, id: groupInfo.groupId });
    },
    [groupInfo?.groupId],
  );

  const updateSpending = useCallback(
    async (filter: Partial<IGroupRecord>, data: IGroupRecord) => {
      if (!groupInfo?.groupId) return;
      await updateGroupSpend(filter, data);
    },
    [groupInfo?.groupId],
  );

  const deleteSpending = useCallback(async () => {
    if (!groupInfo?.groupId) return;
    await deleteGroupSpend({ id: groupInfo.groupId });
  }, [groupInfo?.groupId]);

  const ctxVal = useMemo(
    () => ({
      loading,
      loadingRecord,
      groupInfo,
      spending,
      getAllSpending,
      setNewSpending,
      updateSpending,
      deleteSpending,
    }),
    [
      deleteSpending,
      getAllSpending,
      groupInfo,
      loading,
      loadingRecord,
      setNewSpending,
      spending,
      updateSpending,
    ],
  );

  useEffect(() => {
    getAllSpending();
  }, [getAllSpending, groupInfo]);

  useEffect(() => {
    if (groupId) {
      setLoading(true);
      getGroupInfo(groupId)
        .then((res) => {
          if (res.status) {
            return JSON.parse(res.message) as IGroup;
          } else {
            router.push("/group");
          }
        })
        .then(setGroupInfo)
        .then(() => setLoading(false));
    } else {
      router.push("/group");
    }
  }, [groupId, router]);

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext<ContextValue>(initContext);
export const useRecordContext = () => useContext(Ctx);
