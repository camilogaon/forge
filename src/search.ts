import { readdirSync, readFileSync, statSync, type Dirent, type Stats } from "node:fs";
import { join } from "node:path";
import { maxFileBytes } from "./limits";
import { findMatchingLines, type LineMatch } from "./matches";

const ignoredDirectoryNames: string[] = ["node_modules", ".git", "dist"];

export function searchDirectory(
  directoryPath: string,
  query: string,
  maxDepth: number,
): void {
  try {
    const files: string[] = [];
    collectFiles(directoryPath, 1, maxDepth, files);

    let matchCount: number = 0;

    for (const filePath of files) {
      matchCount += printMatches(filePath, query);
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

function collectFiles(
  directoryPath: string,
  depth: number,
  maxDepth: number,
  files: string[],
): void {
  const entries: Dirent[] = readdirSync(directoryPath, {
    withFileTypes: true,
  });
  const visibleEntries: Dirent[] = entries.filter((entry: Dirent) => {
    return !ignoredDirectoryNames.includes(entry.name);
  });

  visibleEntries.sort((first: Dirent, second: Dirent) => {
    return first.name.localeCompare(second.name);
  });

  for (const entry of visibleEntries) {
    const childPath: string = join(directoryPath, entry.name);

    if (entry.isDirectory() && depth < maxDepth) {
      collectFiles(childPath, depth + 1, maxDepth, files);
    } else if (entry.isFile()) {
      files.push(childPath);
    }
  }
}

function printMatches(filePath: string, query: string): number {
  const fileInfo: Stats = statSync(filePath);

  if (fileInfo.size > maxFileBytes) {
    console.error("Skipped a file larger than " + maxFileBytes + " bytes: " + filePath);
    return 0;
  }

  const content: string = readFileSync(filePath, "utf8");
  const matches: LineMatch[] = findMatchingLines(content, query);

  for (const match of matches) {
    console.log(filePath + ":" + match.lineNumber + ": " + match.text);
  }

  return matches.length;
}