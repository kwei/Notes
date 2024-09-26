"use client";

import { useRecordContext } from "@/app/group/[groupId]/RecordContext";
import { IUser } from "@/type";
import { GROUP_CATEGORIES } from "@/utils/constants";
import { useUserStoreCtx } from "@/utils/externalStores";
import { setGroupSpend } from "@/utils/setGroupSpend";
import Image from "next/image";
import { FormEvent, useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const InputRecord = ({
  members,
  groupId,
}: {
  members: IUser[];
  groupId: string;
}) => {
  const { getAllSpending } = useRecordContext();
  const { useStore: useUserStore } = useUserStoreCtx();
  const [user] = useUserStore((state) => state);
  const [sharedList, setSharedList] = useState<IUser[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleOnSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (selectedCategory === "") return;
      const formData = new FormData(event.target as HTMLFormElement);
      const price = Number(formData.get("price") as string);
      if (price === 0) return;
      const desc = formData.get("desc") as string;
      const date = new Date().toISOString().split("T")[0];
      setGroupSpend({
        id: uuidv4(),
        groupId: groupId,
        price,
        date,
        sharedWith: sharedList,
        desc,
        category: selectedCategory,
        payer: user,
      }).then((res) => {
        (event.target as HTMLFormElement).reset();
        if (res.status) {
          getAllSpending();
        }
      });
    },
    [selectedCategory, groupId, sharedList, user, getAllSpending],
  );

  const handleAddMember = (member: IUser) => {
    setSharedList((prevState) => {
      const newState = [...prevState];
      const index = newState.findIndex(
        (_member) => _member.email === member.email,
      );
      if (index == -1) {
        newState.push(member);
      } else {
        newState.splice(index, 1);
      }
      console.log(newState);
      return newState;
    });
  };

  return (
    <form className="flex w-full flex-col gap-2 p-2" onSubmit={handleOnSubmit}>
      <div className="flex w-full items-center gap-2 divide-x divide-gray-500 rounded border border-solid border-gray-500 px-2">
        <label className="font-semibold">Cost</label>
        <input
          type="number"
          name="price"
          className="flex-1 bg-transparent px-2 py-1 focus:outline-0"
        />
      </div>
      <div className="flex w-full flex-wrap justify-between gap-1">
        {GROUP_CATEGORIES.concat([]).map((_category) => (
          <button
            key={_category}
            type="button"
            onClick={() => setSelectedCategory(_category)}
            className={` flex items-center justify-center rounded-sm px-4 py-2 transition-colors ${selectedCategory === _category ? "bg-stone-300" : "bg-stone-400 hover:bg-stone-300"}`}
          >
            <span className="font-semibold text-gray-800">{_category}</span>
          </button>
        ))}
      </div>
      <div className="flex w-full flex-wrap gap-2 py-2">
        {members.map((member) => (
          <MemberBlock
            key={member.email}
            member={member}
            onSelect={handleAddMember}
          />
        ))}
      </div>
      <fieldset className="flex w-full flex-col rounded border border-solid border-gray-500 px-2 pb-1">
        <legend className="px-2 font-semibold">Description</legend>
        <textarea
          name="desc"
          className="flex-1 resize-none bg-transparent focus:outline-0"
        />
      </fieldset>
      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 py-2 transition-colors hover:bg-blue-500"
      >
        Confirm
      </button>
    </form>
  );
};

const MemberBlock = ({
  member,
  onSelect,
}: {
  member: IUser;
  onSelect: (member: IUser) => void;
}) => {
  const [isSelected, setSelected] = useState(false);

  const handleOnClick = useCallback(() => {
    onSelect(member);
    setSelected((prevState) => !prevState);
  }, [member, onSelect]);

  return (
    <button
      type="button"
      onClick={handleOnClick}
      className={`flex border border-solid ${isSelected ? "border-green-500" : "border-gray-500/50"} items-center gap-2 rounded bg-gray-500/50 p-1 pr-2 transition-colors hover:bg-gray-500/70`}
    >
      <Image
        title={member.name}
        className="m-0 size-5 rounded-full"
        width={20}
        height={20}
        src={member.image}
        alt="user image"
      />
      <span className="text-xs">{member.name}</span>
    </button>
  );
};
