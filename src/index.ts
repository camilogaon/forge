import { readdirSync } from "node:fs";

const appName: string = "Forge";
const command: string | undefined = process.argv[2];
const targetPath: string | undefined = process.argv[3];

if (command === undefined || command === "help") {
  showHelp();
} else if (command === "inspect") {
  if (targetPath === undefined) {
    console.error("Usage: forge inspect <directory>");
    process.exitCode = 1;
  } else {
    inspectDirectory(targetPath);
  }
} else {
  console.error("Unknown command: " + command);
  process.exitCode = 1;
}

function showHelp(): void {
  console.log(appName + " - local repository inspector");
  console.log("");
  console.log("Usage: forge <command>");
  console.log("");
  console.log("Commands:");
  console.log("  help                 Show how to use Forge");
  console.log("  inspect <directory>  List the entries in a directory");
}

function inspectDirectory(directoryPath: string): void {
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