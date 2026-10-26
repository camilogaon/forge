import { readFileSync, statSync, type Stats } from "node:fs";
import { maxFileBytes } from "./limits";
import { findMatchingLines, type LineMatch } from "./matches";
import { walkDirectory, type WalkEntry } from "./walk";

const ignoredDirectoryNames: string[] = ["node_modules", ".git", "dist"];

export type SearchHit = {
  path: string;
  lineNumber: number;
  text: string;
};

export function searchDirectory(
  directoryPath: string,
  query: string,
  maxDepth: number,
): void {
  try {
    const hits: SearchHit[] = collectSearchHits(directoryPath, query, maxDepth);
    printSearchHits(hits);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cannot search directory: " + message);
    process.exitCode = 1;
  }
}

export function collectSearchHits(
  directoryPath: string,
  query: string,
  maxDepth: number,
): SearchHit[] {
  const entries: WalkEntry[] = walkDirectory(
    directoryPath,
    maxDepth,
    ignoredDirectoryNames,
  );
  const files: WalkEntry[] = entries.filter((entry: WalkEntry) => {
    return entry.kind === "file";
  });
  const hits: SearchHit[] = [];

  for (const file of files) {
    const fileHits: SearchHit[] = hitsInFile(file.path, query);

    for (const hit of fileHits) {
      hits.push(hit);
    }
  }

  return hits;
}

function hitsInFile(filePath: string, query: string): SearchHit[] {
  const fileInfo: Stats = statSync(filePath);

  if (fileInfo.size > maxFileBytes) {
    console.error(
      "Skipped a file larger than " + maxFileBytes + " bytes: " + filePath,
    );
    return [];
  }

  const content: string = readFileSync(filePath, "utf8");
  const matches: LineMatch[] = findMatchingLines(content, query);
  const hits: SearchHit[] = [];

  for (const match of matches) {
    hits.push({
      path: filePath,
      lineNumber: match.lineNumber,
      text: match.text,
    });
  }

  return hits;
}

function printSearchHits(hits: SearchHit[]): void {
  if (hits.length === 0) {
    console.log("No matches.");
    return;
  }

  for (const hit of hits) {
    console.log(hit.path + ":" + hit.lineNumber + ": " + hit.text);
  }
}