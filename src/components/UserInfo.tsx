"use client";

import { Loading } from "@/components/Loading";
import { IMongoQueryRes, IUser } from "@/type";
import { useUserStoreCtx } from "@/utils/externalStores";
import { getUserData } from "@/utils/getUserData";
import { setUserData } from "@/utils/setUserData";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export const UserInfo = ({ user }: { user: IUser | null }) => {
  const [loading, setLoading] = useState(false);
  const { useStore: useUserStore } = useUserStoreCtx();
  const [, setUser] = useUserStore((state) => state);

  function handleSignIn() {
    setLoading(true);
    signIn("line").finally();
  }

  function handleSignOut() {
    signOut().finally();
  }

  useEffect(() => {
    if (user) {
      setUser(user);
      setLoading(false);
      getUserData(user).then((res1: IMongoQueryRes) => {
        if (!res1.status) {
          setUserData(user).finally();
        }
      });
    }
  }, [setUser, user]);

  if (loading && !user) return <Loading />;

  return (
    <div className="w-full flex items-center justify-end p-4">
      {user && (
        <div className="relative group flex items-center gap-3">
          <Image
            className="size-8 rounded-full m-0"
            src={user.image}
            alt="user image"
            title={user.name}
            width={32}
            height={32}
          />
          <span>Hi, {user.name}</span>
          <button
            className="absolute right-full top-0 mr-2 invisible group-hover:visible transition-all hover:bg-gray-d0-500 hover:text-black whitespace-nowrap rounded-full border border-solid border-gray-d0-500 px-3 py-1"
            onClick={handleSignOut}
          >
            Log Out
          </button>
        </div>
      )}
      {!user && <LoginPopup handleSignIn={handleSignIn} />}
    </div>
  );
};

const LoginPopup = ({ handleSignIn }: { handleSignIn: () => void }) => {
  return (
    <div className="fixed left-0 right-0 top-0 bottom-0 flex items-center justify-center">
      <div className="flex flex-col md:w-[400px] w-5/6 rounded-2xl p-6 bg-gray-800 border-b border-solid border-green-50-500">
        <span className="w-full text-center text-2xl font-bold">
          Please Login First
        </span>
        <span className="text-sm w-full text-center p-6">
          We use LINE Login powered by next-auth provider. Your information is
          collected only for identification.
        </span>
        <div className="w-full flex items-center justify-center px-6">
          <button
            onClick={handleSignIn}
            className="rounded-md border border-solid border-green-600 text-green-600 w-full p-2 hover:bg-green-600 hover:text-white transition-colors"
          >
            Login with LINE
          </button>
        </div>
      </div>
    </div>
  );
};
