import { Header } from "@/components/Header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { ReactNode, Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KW Notes",
  description: "For doing notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`w-full min-h-screen text-base flex flex-col ${inter.className}`}
      >
        <Header />
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
