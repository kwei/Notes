"use client";

import { Loading } from "@/components/Loading";
import { IMongoQueryRes, IUser } from "@/type";
import { askNotificationPermission } from "@/utils/askNotificationPermission";
import { BASE_URL } from "@/utils/constants";
import { useUserStoreCtx } from "@/utils/externalStores";
import { getUserData } from "@/utils/getUserData";
import { register } from "@/utils/registerSW";
import { setUserData } from "@/utils/setUserData";
import { signIn, signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export const UserInfo = ({ user }: { user: IUser | null }) => {
  const [loading, setLoading] = useState(false);
  const { useStore: useUserStore } = useUserStoreCtx();
  const [, setUser] = useUserStore((state) => state);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [hasSub, setHasSub] = useState(false);
  const [loadingSub, setLoadingSub] = useState(true);

  function handleSignOut() {
    signOut({
      callbackUrl: `${BASE_URL}/`,
    }).finally();
  }

  const handleOnSubscription = useCallback(async () => {
    setLoadingSub(true);
    if (hasSub) {
      fetch("/api/mongo/spending/sub", {
        method: "POST",
        body: JSON.stringify({
          method: "delete",
          data: { userAgent: window.navigator.userAgent },
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          setHasSub(!res.status);
          setLoadingSub(false);
        });
    } else {
      const notificationRes = await askNotificationPermission();
      console.log("Request Notification: ", notificationRes);
      await fetch("/api/mongo/spending/sub", {
        method: "POST",
        body: JSON.stringify({
          method: "set",
          data: { subscription, userAgent: window.navigator.userAgent },
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          setHasSub(res.status);
          setLoadingSub(false);
          new Notification("成功訂閱", {
            body: "我們將會定時提醒您要記得記帳!",
          });
        });
    }
  }, [hasSub, subscription]);

  useEffect(() => {
    setLoadingSub(true);
    register().then((res) => {
      console.log("Register Service Worker: ", res);
      setSubscription(res.data);
      fetch("/api/mongo/spending/sub", {
        method: "POST",
        body: JSON.stringify({
          method: "get",
          data: {
            subscription: res.data,
            userAgent: window.navigator.userAgent,
          },
        }),
      })
        .then((checkSubRes) => checkSubRes.json())
        .then((checkSubRes) => {
          setHasSub(checkSubRes.status);
          setLoadingSub(false);
        });
    });
  }, []);

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
    <div className="relative flex w-full items-center justify-between p-4">
      {user && (
        <>
          <button
            className={`border border-solid border-gray-d0-500 px-2 py-1 font-bold transition-all ${hasSub ? "hover:border-red-ff-300 hover:text-red-ff-300" : "hover:border-green-50-500 hover:text-green-50-500"}`}
            onClick={loadingSub ? undefined : handleOnSubscription}
          >
            {loadingSub ? "確認中..." : hasSub ? "取消通知" : "開啟通知"}
          </button>
          <div className="group relative flex items-center gap-3 py-1">
            <span>{user.name}</span>
            <button
              className="invisible absolute right-full top-0 mr-2 whitespace-nowrap rounded-full border border-solid border-gray-d0-500 px-3 py-1 transition-all hover:bg-gray-d0-500 hover:text-black group-hover:visible"
              onClick={handleSignOut}
            >
              登出
            </button>
          </div>
        </>
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSignInLine = useCallback(() => {
    setLoading(true);
    signIn("line").then();
  }, [setLoading]);

  const handleSignInEmail = useCallback(() => {
    setLoading(true);
    signIn("credentials", {
      email: email || "test@gmail.com",
      name: name || "Test Account",
      callbackUrl: `${BASE_URL}/spending`,
    }).then();
  }, [email, name, setLoading]);

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center">
      <div className="flex w-5/6 flex-col rounded-2xl bg-gray-800 p-6 shadow-lg shadow-white/50 md:w-[400px]">
        <span className="w-full text-center text-2xl font-bold">請先登入</span>
        <span className="w-full p-6 text-left text-sm">
          我們透過 next-auth provider 來實現 LINE
          登入機制，你的個人資訊僅會用作登入驗證。
          詳細來說，我們主要會透過您的電子信箱作為判斷依據，一切資料將與您的電子信箱做綁定。
          <br />
          <br />
          We use LINE Login powered by next-auth provider. Your information is
          collected only for identification. More details, we only take your
          email for binding data.
        </span>
        <div className="flex w-full flex-col items-center justify-center px-6">
          <button
            onClick={handleSignInLine}
            className="w-full rounded-md border border-solid border-green-600 p-2 text-green-600 transition-colors hover:bg-green-600 hover:text-white"
          >
            透過 LINE 登入
          </button>
        </div>
        <div className="mx-6 my-3 bg-gray-500 pt-px"></div>
        <div className="flex w-full flex-col gap-4 px-6">
          <span className="w-full text-center text-xl font-semibold">
            快速登入資訊
          </span>
          <fieldset className="rounded-md border border-solid border-gray-500 px-2 pb-2">
            <legend className="px-1">名字</legend>
            <input
              type="text"
              className="w-full bg-transparent focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </fieldset>
          <fieldset className="rounded-md border border-solid border-gray-500 px-2 pb-2">
            <legend className="px-1">信箱</legend>
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
            快速登入
          </button>
        </div>
      </div>
    </div>
  );
};
