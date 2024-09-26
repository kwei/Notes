"use client";

import { useGroupInfo } from "@/app/group/GroupInfoContext";
import { useFocusRef } from "@/hooks/useFocusRef";
import { BASE_URL } from "@/utils/constants";
import { useUserStoreCtx } from "@/utils/externalStores";
import { generateId } from "@/utils/generateId";
import { useRouter } from "next/navigation";
import {
  createContext,
  FormEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaCircleCheck, FaCopy } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

export const GroupInfoModalContext = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Ctx.Provider value={{ open: handleOpen }}>
      {children}
      <GroupInfoModal isOpen={open} onClose={handleClose} />
    </Ctx.Provider>
  );
};

const Ctx = createContext({
  open: () => {},
});
export const useGroupInfoModal = () => useContext(Ctx);

const GroupInfoModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const ref = useFocusRef<HTMLDivElement>(() => {
    onClose();
  });
  const copyTimerRef = useRef<NodeJS.Timeout>();
  const router = useRouter();
  const { useStore: useUserStore } = useUserStoreCtx();
  const [user] = useUserStore((state) => state);
  const { newGroup } = useGroupInfo();
  const [copied, setCopied] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleCopyGroupLink = useCallback(() => {
    navigator.clipboard.writeText(`${BASE_URL}/group/${groupId}`).then(() => {
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => {
        setCopied(false);
        clearTimeout(copyTimerRef.current);
      }, 1500);
    });
  }, [groupId]);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);
      const groupName = formData.get("group-name") as string;
      const groupLink = formData.get("group-link") as string;
      if (groupName.trim() === "") return;
      setGenerating(true);
      newGroup({
        groupId: groupId,
        members: [user],
        name: groupName,
        owner: user,
      }).then((res) => {
        setGenerating(false);
        if (res.status) {
          onClose();
          router.push(groupLink);
        }
      });
    },
    [groupId, newGroup, onClose, router, user],
  );

  useEffect(() => {
    setGroupId(generateId());
  }, []);

  return (
    <div
      className={`${isOpen ? "visible" : "invisible"} fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/50`}
    >
      <div
        ref={ref}
        className={`${isOpen ? "scale-100" : "scale-0"} relative flex h-auto w-full flex-col rounded-xl bg-gray-40-300 p-4 transition-transform md:w-[400px] md:p-6`}
      >
        <form className="flex w-full flex-col" onSubmit={handleSubmit}>
          <div className="w-full pb-4 pr-4 md:pr-6">
            <input
              type="text"
              id="group-name"
              name="group-name"
              className="w-full bg-transparent text-xl focus:outline-0"
              placeholder="New Group"
            />
          </div>
          <button
            type="button"
            onClick={handleCopyGroupLink}
            className="group flex w-full items-center gap-1 rounded-md border border-solid border-gray-500 py-1 pl-2"
          >
            <input
              type="url"
              id="group-link"
              name="group-link"
              className="flex-1 cursor-pointer bg-transparent text-sm focus:outline-0"
              value={`${BASE_URL}/group/${groupId}`}
              readOnly
            />
            <span className="flex aspect-square w-5 items-center justify-center">
              {copied ? (
                <FaCircleCheck className="size-4 text-green-600" />
              ) : (
                <FaCopy className="size-4 text-gray-500 transition-all group-hover:brightness-110" />
              )}
            </span>
          </button>
          <div className="flex w-full items-center justify-end pt-4">
            <button
              type="submit"
              disabled={generating}
              className="rounded-md border border-solid border-blue-600 bg-blue-600 p-1 px-2 transition-all hover:brightness-110"
            >
              {generating ? (
                <AiOutlineLoading3Quarters className="size-5 animate-spin text-gray-200" />
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </form>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 size-6 text-gray-500 transition-colors hover:text-black/70"
        >
          <IoClose className="size-6" />
        </button>
      </div>
    </div>
  );
};
