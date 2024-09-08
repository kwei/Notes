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
        <title>Life Helper</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`relative h-dvh w-full ${inter.className}`}>
        <Suspense>
          <div className="flex h-full w-full flex-col">
            <Header />
            <UserProvider>
              <UserInfo user={userInfo} />
              {userInfo && children}
            </UserProvider>
            <Footer />
          </div>
        </Suspense>
      </body>
    </html>
  );
}
