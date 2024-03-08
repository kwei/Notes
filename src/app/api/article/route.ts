import { markdownConverter } from "@/utils/markdownConverter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const queryList = req.url.split("?")[1].split("&");
  const id = getQueryString(queryList, "id");
  return NextResponse.json((await markdownConverter(id)) as string);
}

function getQueryString(queryList: string[], t: string) {
  const result = queryList.filter(
    (queryString) => queryString.split("=")[0] === t,
  )[0];
  if (result) return result.split("=")[1];
  else return null;
}
