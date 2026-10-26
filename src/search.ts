import { readFileSync, statSync, type Stats } from "node:fs";
import { maxFileBytes } from "./limits";
import { findMatchingLines, type LineMatch } from "./matches";
import { walkDirectory, type WalkEntry } from "./walk";

const ignoredDirectoryNames: string[] = ["node_modules", ".git", "dist"];

export function searchDirectory(
  directoryPath: string,
  query: string,
  maxDepth: number,
): void {
  try {
    const entries: WalkEntry[] = walkDirectory(
      directoryPath,
      maxDepth,
      ignoredDirectoryNames,
    );
    const files: WalkEntry[] = entries.filter((entry: WalkEntry) => {
      return entry.kind === "file";
    });

    let matchCount: number = 0;

    for (const file of files) {
      matchCount += printMatches(file.path, query);
    }

    if (matchCount === 0) {
      console.log("No matches.");
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cannot search directory: " + message);
    process.exitCode = 1;
  }
}

function printMatches(filePath: string, query: string): number {
  const fileInfo: Stats = statSync(filePath);

  if (fileInfo.size > maxFileBytes) {
    console.error(
      "Skipped a file larger than " + maxFileBytes + " bytes: " + filePath,
    );
    return 0;
  }

  const content: string = readFileSync(filePath, "utf8");
  const matches: LineMatch[] = findMatchingLines(content, query);

  for (const match of matches) {
    console.log(filePath + ":" + match.lineNumber + ": " + match.text);
  }

  return matches.length;
}