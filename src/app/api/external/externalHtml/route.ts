import { getQueryString } from "@/utils/getQueryString";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("req url: ", req.url);
  const queryList = req.url.split("?")[1]?.split("&") ?? [];
  const link = getQueryString(queryList, "link");
  try {
    if (link) {
      console.log("external url: ", link);
      const res = await fetch(link);
      return NextResponse.json(await res.text());
    }
  } catch (e) {
    console.log("fetch external url failed: ", e);
    return NextResponse.json("");
  }
  return NextResponse.json("");
}
