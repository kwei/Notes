const showdown = require("showdown");
import { promises as fs } from "fs";

export async function markdownConverter(fileName) {
  const file = await fs.readFile(
    `${process.cwd()}/src/articles/${fileName}.md`,
    "utf8",
  );
  const converter = new showdown.Converter();
  return converter.makeHtml(file);
}
