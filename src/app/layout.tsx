import { Header } from "@/components/Header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { ReactNode, Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "This is KW.",
  description:
    "I'm KW (Kai-Wei Yeh, 葉鎧瑋). I will summarize and share my knowledge points and life experiences here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`relative w-full h-full min-h-screen text-base flex flex-col ${inter.className}`}
      >
        <Header />
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
