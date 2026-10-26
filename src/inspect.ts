import { readdirSync, type Dirent } from "node:fs";

export function inspectDirectory(directoryPath: string): void {
  try {
    const entries: Dirent[] = readdirSync(directoryPath, {
      withFileTypes: true,
    });
    const visibleEntries: Dirent[] = entries.filter((entry: Dirent) => {
      return entry.name !== "node_modules" && entry.name !== ".git";
    });

    visibleEntries.sort((first: Dirent, second: Dirent) => {
      return first.name.localeCompare(second.name);
    });

    console.log("Directory: " + directoryPath);

    for (const entry of visibleEntries) {
      const label: string = getEntryLabel(entry);
      console.log(label + "  " + entry.name);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cannot read directory: " + message);
    process.exitCode = 1;
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