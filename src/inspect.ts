import { readdirSync } from "node:fs";

export function inspectDirectory(directoryPath: string): void {
  try {
    const entries: string[] = readdirSync(directoryPath);
    const visibleEntries: string[] = entries.filter((entry: string) => {
      return entry !== "node_modules" && entry !== ".git";
    });

    visibleEntries.sort();

    console.log("Directory: " + directoryPath);

    for (const entry of visibleEntries) {
      console.log(entry);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cannot read directory: " + message);
    process.exitCode = 1;
  }
}