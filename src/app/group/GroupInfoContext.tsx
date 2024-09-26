"use client";

import { IGroup, IMongoQueryRes } from "@/type";
import { deleteGroupInfo } from "@/utils/deleteGroupInfo";
import { useUserStoreCtx } from "@/utils/externalStores";
import { generateId } from "@/utils/generateId";
import { getGroupInfo } from "@/utils/getGroupInfo";
import { setGroupInfo } from "@/utils/setGroupInfo";
import { updateGroupInfo } from "@/utils/updateGroupInfo";
import { updateUserData } from "@/utils/updateUserData";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Ctx = {
  initialing: boolean;
  groups: Record<string, IGroup>;
  getAllGroups: () => Promise<Record<string, IGroup>>;
  newGroup: (data: IGroup) => Promise<IMongoQueryRes>;
  deleteGroup: (groupId: string) => Promise<IMongoQueryRes>;
  updateGroup: (groupId: string, data: IGroup) => Promise<IMongoQueryRes>;
};

const initialState: Ctx = {
  initialing: true,
  groups: {},
  getAllGroups: async () => ({}),
  newGroup: async (_data: IGroup) => ({ status: false, message: "" }),
  deleteGroup: async (_groupId: string) => ({ status: false, message: "" }),
  updateGroup: async (_groupId: string, _data: IGroup) => ({
    status: false,
    message: "",
  }),
};

export const GroupInfoContext = ({ children }: { children: ReactNode }) => {
  const { useStore: useUserStore } = useUserStoreCtx();
  const [user, setUser] = useUserStore((state) => state);
  const [initialing, setInitialing] = useState(true);
  const [groups, setGroups] = useState<Record<string, IGroup>>({});

  const getAllGroups = useCallback(async () => {
    const groupIds = user.groups;
    const res: Record<string, IGroup> = {};
    if (groupIds && groupIds.length > 0) {
      for (const id of groupIds) {
        const { message } = await getGroupInfo(id);
        res[id] = JSON.parse(message) as IGroup;
      }
    }
    return res;
  }, [user]);

  const newGroup = useCallback(
    async (data: IGroup) => {
      const groupId = generateId();
      const originalGroups = user.groups ?? [];
      const newUserData = {
        ...user,
        groups: [...originalGroups, groupId],
      };
      await updateUserData(user, newUserData);
      setUser(newUserData);
      return setGroupInfo({
        ...data,
        groupId,
      });
    },
    [setUser, user],
  );

  const deleteGroup = useCallback(
    async (groupId: string) => {
      const originalGroups = user.groups ?? [];
      const i = originalGroups.indexOf(groupId);
      if (i === -1) {
        return {
          status: false,
          message: "Do not have the group.",
        };
      }
      const newUserData = {
        ...user,
        groups: [...originalGroups].splice(i, 1),
      };
      await updateUserData(user, newUserData);
      setUser(newUserData);
      return deleteGroupInfo(groupId);
    },
    [setUser, user],
  );

  const updateGroup = useCallback(async (groupId: string, data: IGroup) => {
    return updateGroupInfo(groupId, data);
  }, []);

  const CtxValue = useMemo(
    () => ({
      initialing,
      groups,
      getAllGroups,
      newGroup,
      deleteGroup,
      updateGroup,
    }),
    [initialing, groups, deleteGroup, getAllGroups, newGroup, updateGroup],
  );

  useEffect(() => {
    getAllGroups().then(setGroups);
  }, [getAllGroups]);

  useEffect(() => {
    if (Object.keys(groups).length > 0) {
      setInitialing(false);
    }
  }, [groups]);

  return <Ctx.Provider value={CtxValue}>{children}</Ctx.Provider>;
};

const Ctx = createContext<Ctx>(initialState);
export const useGroupInfo = () => useContext(Ctx);
