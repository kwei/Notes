import { redirect } from "next/navigation";

export default function Home() {
  redirect("/spending");
  return <div className="w-full flex-1"></div>;
}
