import { readFileSync, statSync, type Stats } from "node:fs";

const maxBytes: number = 100_000;

export function readSourceFile(filePath: string): void {
  try {
    const fileInfo: Stats = statSync(filePath);

    if (!fileInfo.isFile()) {
      console.error("Not a file: " + filePath);
      process.exitCode = 1;
      return;
    }

    if (fileInfo.size > maxBytes) {
      console.error("File is larger than " + maxBytes + " bytes: " + filePath);
      process.exitCode = 1;
      return;
    }

    const content: string = readFileSync(filePath, "utf8");
    console.log(content);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cannot read file: " + message);
    process.exitCode = 1;
  }
}