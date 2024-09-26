"use client";

import { Loading } from "@/components/Loading";
import { IMongoQueryRes, IUser } from "@/type";
import { BASE_URL } from "@/utils/constants";
import { useUserStoreCtx } from "@/utils/externalStores";
import { getUserData } from "@/utils/getUserData";
import { setUserData } from "@/utils/setUserData";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa6";
import { IoPersonCircleOutline } from "react-icons/io5";

export const UserInfo = ({ user }: { user: IUser | null }) => {
  const [loading, setLoading] = useState(false);
  const { useStore: useUserStore } = useUserStoreCtx();
  const [, setUser] = useUserStore((state) => state);

  function handleSignOut() {
    signOut({
      callbackUrl: `${BASE_URL}/`,
    }).finally();
  }

  useEffect(() => {
    if (user) {
      setLoading(false);
      getUserData({ email: user.email }).then((res1: IMongoQueryRes) => {
        if (!res1.status) {
          setUserData(user).finally();
        } else {
          setUser(JSON.parse(res1.message) as IUser);
        }
      });
    }
  }, [setUser, user]);

  if (loading && !user) return <Loading />;

  return (
    <div
      className={`relative flex w-full ${!user && "flex-1"} items-start justify-end p-4`}
    >
      {user ? (
        <div className="group relative flex items-center gap-3 py-1">
          <div className="flex items-center gap-2">
            {user.image && user.image !== "" ? (
              <Image
                className="m-0 size-6 rounded-full"
                width={24}
                height={24}
                src={user.image}
                alt="user image"
              />
            ) : (
              <IoPersonCircleOutline className="size-6" />
            )}
            <span>{user.name}</span>
          </div>
          <div className="invisible absolute right-full top-0 flex flex-row-reverse items-center gap-2 px-2 group-hover:visible">
            <button
              className="whitespace-nowrap rounded-full border border-solid border-gray-d0-500 px-3 py-1 transition-all hover:bg-gray-d0-500 hover:text-black"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <LoginPopup setLoading={setLoading} />
      )}
    </div>
  );
};

const LoginPopup = ({
  setLoading,
}: {
  setLoading: (status: boolean) => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSignIn = useCallback(() => {
    setLoading(true);
    signIn("google").then();
  }, [setLoading]);

  const handleSignInEmail = useCallback(() => {
    setLoading(true);
    signIn("credentials", {
      email: email || "test",
      name: name || "test",
      callbackUrl: `${BASE_URL}/spending`,
    }).then();
  }, [email, name, setLoading]);

  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <div className="flex w-5/6 flex-col items-center pt-6 md:w-[400px] md:p-6">
        <span className="w-full text-center text-2xl font-bold">
          Login First
        </span>
        <div className="flex w-full flex-col items-center justify-center p-6">
          <button
            onClick={handleSignIn}
            className="flex w-fit items-center rounded-md border border-solid border-blue-600 bg-blue-600 px-4 py-3 text-white transition-all hover:brightness-110"
          >
            <FaGoogle className="mr-4 size-6" />
            Sign in with Google
          </button>
        </div>
        <div className="mx-6 my-3 w-full bg-gray-500 pt-px"></div>
        <div className="flex w-full flex-col gap-4 p-6">
          <fieldset className="rounded-md border border-solid border-gray-500 px-2 pb-2">
            <legend className="px-1">Name</legend>
            <input
              type="text"
              className="w-full bg-transparent focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </fieldset>
          <fieldset className="rounded-md border border-solid border-gray-500 px-2 pb-2">
            <legend className="px-1">Email</legend>
            <input
              type="email"
              className="w-full bg-transparent focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </fieldset>

          <button
            onClick={handleSignInEmail}
            className="w-full rounded-md border border-solid border-gray-d0-500 p-2 text-gray-d0-500 transition-colors hover:bg-gray-d0-500/50 hover:text-white"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};
