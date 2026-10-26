import { walkDirectory, type WalkEntry } from "./walk";

const ignoredDirectoryNames: string[] = ["node_modules", ".git"];

export function inspectDirectory(
  directoryPath: string,
  maxDepth: number,
): void {
  try {
    console.log("Directory: " + directoryPath);
    const entries: WalkEntry[] = walkDirectory(
      directoryPath,
      maxDepth,
      ignoredDirectoryNames,
    );

    for (const entry of entries) {
      const indent: string = "  ".repeat(entry.depth - 1);
      console.log(indent + entry.kind + "  " + entry.name);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cannot read directory: " + message);
    process.exitCode = 1;
  }
}