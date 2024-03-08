import { Header } from "@/components/Header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

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
      <head>
        <title>KW Notes</title>
      </head>
      <body
        className={`w-full min-h-screen text-base flex flex-col ${inter.className}`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
