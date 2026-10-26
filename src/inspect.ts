import { readdirSync, type Dirent } from "node:fs";
import { join } from "node:path";

export function inspectDirectory(
  directoryPath: string,
  maxDepth: number,
): void {
  try {
    console.log("Directory: " + directoryPath);
    printEntries(directoryPath, 1, maxDepth);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cannot read directory: " + message);
    process.exitCode = 1;
  }
}

function printEntries(
  directoryPath: string,
  depth: number,
  maxDepth: number,
): void {
  const entries: Dirent[] = readdirSync(directoryPath, {
    withFileTypes: true,
  });
  const visibleEntries: Dirent[] = entries.filter((entry: Dirent) => {
    return entry.name !== "node_modules" && entry.name !== ".git";
  });

  visibleEntries.sort((first: Dirent, second: Dirent) => {
    return first.name.localeCompare(second.name);
  });

  for (const entry of visibleEntries) {
    const label: string = getEntryLabel(entry);
    const indent: string = "  ".repeat(depth - 1);
    console.log(indent + label + "  " + entry.name);

    if (entry.isDirectory() && depth < maxDepth) {
      const childPath: string = join(directoryPath, entry.name);
      printEntries(childPath, depth + 1, maxDepth);
    }
  }
}

function getEntryLabel(entry: Dirent): string {
  if (entry.isDirectory()) {
    return "dir";
  }

  if (entry.isFile()) {
    return "file";
  }

  return "other";
}