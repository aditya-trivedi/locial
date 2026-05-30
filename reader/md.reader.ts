import fs from "fs/promises";

export async function readMarkdownFile(path: string) {
  const content = await fs.readFile(path, "utf-8");
  return content;
}
