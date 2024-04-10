"use client";

import { IMongoQueryRes, IUser } from "@/type";
import { getUserData } from "@/utils/getUserData";
import { setUserData } from "@/utils/setUserData";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";

export const UserInfo = ({ user }: { user: IUser | null }) => {
  function handleSignIn() {
    signIn("line").finally();
  }

  function handleSignOut() {
    signOut().finally();
  }

  useEffect(() => {
    if (user) {
      getUserData(user).then((res1: IMongoQueryRes) => {
        if (!res1.status) {
          setUserData(user).finally();
        }
      });
    }
  }, [user]);

  return (
    <div className="w-full flex items-center justify-end">
      {user && (
        <div className="relative group">
          <Image
            className="size-12 rounded-full"
            src={user.image}
            alt="user image"
            title={user.name}
            width={48}
            height={48}
          />
          <button
            className="absolute right-full top-2 mr-2 invisible group-hover:visible transition-all hover:bg-gray-d0-500 hover:text-black whitespace-nowrap rounded-full border border-solid border-gray-d0-500 px-3 py-1"
            onClick={handleSignOut}
          >
            Log Out
          </button>
        </div>
      )}
      {!user && (
        <button
          onClick={handleSignIn}
          className="rounded-md border border-solid border-gray-d0-500 px-6 py-2 hover:bg-gray-d0-500 hover:text-black transition-colors"
        >
          Login
        </button>
      )}
    </div>
  );
};
