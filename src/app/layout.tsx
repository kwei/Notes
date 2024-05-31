import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { UserInfo } from "@/components/UserInfo";
import { IUser } from "@/type";
import { UserProvider } from "@/utils/externalStores";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { ReactNode, Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  description:
    "I'm KW (Kai-Wei Yeh, 葉鎧瑋). I will summarize and share my knowledge points and life experiences here.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getServerSession();
  const userInfo: IUser | null = session?.user
    ? {
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? "",
      }
    : null;

  return (
    <html lang="en">
      <head>
        <title>KW Page</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`relative w-full h-full min-h-screen text-base flex flex-col ${inter.className}`}
      >
        <Suspense>
          <Header />
          <UserProvider>
            <UserInfo user={userInfo} />
            {userInfo && children}
          </UserProvider>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
