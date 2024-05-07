import { getQueryString } from "@/utils/getQueryString";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("req url: ", req.url);
  const queryList = req.url.split("?")[1]?.split("&") ?? [];
  const link = getQueryString(queryList, "link");
  if (link) {
    const res = await fetch(link);
    return NextResponse.json(await res.text());
  }
  return NextResponse.json("");
}
