import { readdirSync, type Dirent } from "node:fs";
import { join } from "node:path";

export type EntryKind = "file" | "dir" | "other";

export type WalkEntry = {
  path: string;
  name: string;
  depth: number;
  kind: EntryKind;
};

export function walkDirectory(
  directoryPath: string,
  maxDepth: number,
  ignoredDirectoryNames: string[],
): WalkEntry[] {
  const found: WalkEntry[] = [];
  collectEntries(directoryPath, 1, maxDepth, ignoredDirectoryNames, found);
  return found;
}

function collectEntries(
  directoryPath: string,
  depth: number,
  maxDepth: number,
  ignoredDirectoryNames: string[],
  found: WalkEntry[],
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
    const kind: EntryKind = getEntryKind(entry);

    found.push({
      path: childPath,
      name: entry.name,
      depth: depth,
      kind: kind,
    });

    if (kind === "dir" && depth < maxDepth) {
      collectEntries(
        childPath,
        depth + 1,
        maxDepth,
        ignoredDirectoryNames,
        found,
      );
    }
  }
}

function getEntryKind(entry: Dirent): EntryKind {
  if (entry.isDirectory()) {
    return "dir";
  }

  if (entry.isFile()) {
    return "file";
  }

  return "other";
}