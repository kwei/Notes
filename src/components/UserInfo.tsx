"use client";

import { Loading } from "@/components/Loading";
import { IMongoQueryRes, IUser } from "@/type";
import { BASE_URL } from "@/utils/constants";
import { useUserStoreCtx } from "@/utils/externalStores";
import { getUserData } from "@/utils/getUserData";
import { setUserData } from "@/utils/setUserData";
import { signIn, signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

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
    <div className="flex w-full items-center justify-end p-4">
      {user && (
        <div className="group relative flex items-center gap-3">
          <span>{user.name}</span>
          <button
            className="invisible absolute right-full top-0 mr-2 whitespace-nowrap rounded-full border border-solid border-gray-d0-500 px-3 py-1 transition-all hover:bg-gray-d0-500 hover:text-black group-hover:visible"
            onClick={handleSignOut}
          >
            Log Out
          </button>
        </div>
      )}
      {!user && <LoginPopup setLoading={setLoading} />}
    </div>
  );
};

const LoginPopup = ({
  setLoading,
}: {
  setLoading: (status: boolean) => void;
}) => {
  const handleSignInLine = useCallback(() => {
    setLoading(true);
    signIn("line").finally();
  }, [setLoading]);

  const handleSignInEmail = useCallback(() => {
    setLoading(true);
    signIn("credentials", {
      email: "test@gmail.com",
      name: "Test Account",
      callbackUrl: `${BASE_URL}/spending`,
    }).then(res => {
      console.log(res);
    });
  }, [setLoading]);

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center">
      <div className="flex w-5/6 flex-col rounded-2xl border-b border-solid border-green-50-500 bg-gray-800 p-6 md:w-[400px]">
        <span className="w-full text-center text-2xl font-bold">
          Please Login First
        </span>
        <span className="w-full p-6 text-center text-sm">
          We use LINE Login powered by next-auth provider. Your information is
          collected only for identification.
        </span>
        <div className="flex w-full flex-col items-center justify-center gap-4 px-6">
          <button
            onClick={handleSignInLine}
            className="w-full rounded-md border border-solid border-green-600 p-2 text-green-600 transition-colors hover:bg-green-600 hover:text-white"
          >
            Login with LINE
          </button>
          <button
            onClick={handleSignInEmail}
            className="w-full rounded-md border border-solid border-gray-d0-500 p-2 text-gray-d0-500 transition-colors hover:bg-gray-d0-500/50 hover:text-white"
          >
            Login with Test Account
          </button>
        </div>
      </div>
    </div>
  );
};
