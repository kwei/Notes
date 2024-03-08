import { Header } from "@/components/Header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
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
        <link
          href="https://cdnjs/prismjs@v1.x/themes/prism.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`w-full min-h-screen text-base flex flex-col ${inter.className}`}
      >
        <Header />
        {children}
        <Script
          type="text/javascript"
          src="https://cdnjs/prismjs@v1.x/components/prism-core.min.js"
          async
        />
        <Script
          type="text/javascript"
          src="https://cdnjs/prismjs@v1.x/plugins/autoloader/prism-autoloader.min.js"
          async
        />
      </body>
    </html>
  );
}
