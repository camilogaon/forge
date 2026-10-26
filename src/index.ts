import { showHelp } from "./help";
import { inspectDirectory } from "./inspect";
import { readSourceFile } from "./read";

const command: string | undefined = process.argv[2];
const targetPath: string | undefined = process.argv[3];
const rawDepth: string | undefined = process.argv[4];

if (command === undefined || command === "help") {
  showHelp();
} else if (command === "inspect") {
  inspectCommand(targetPath, rawDepth);
} else if (command === "read") {
  readCommand(targetPath);
} else {
  console.error("Unknown command: " + command);
  process.exitCode = 1;
}

function inspectCommand(
  directoryPath: string | undefined,
  rawDepth: string | undefined,
): void {
  if (directoryPath === undefined) {
    console.error("Usage: forge inspect <directory> [depth]");
    process.exitCode = 1;
    return;
  }

  const maxDepth: number | undefined = readDepth(rawDepth);
  if (maxDepth === undefined) {
    console.error("Depth must be a whole number from 1 to 5.");
    process.exitCode = 1;
    return;
  }

  inspectDirectory(directoryPath, maxDepth);
}

function readCommand(filePath: string | undefined): void {
  if (filePath === undefined) {
    console.error("Usage: forge read <file>");
    process.exitCode = 1;
    return;
  }

  readSourceFile(filePath);
}

function readDepth(rawDepth: string | undefined): number | undefined {
  if (rawDepth === undefined) {
    return 1;
  }

  const depth: number = Number(rawDepth);

  if (!Number.isInteger(depth) || depth < 1 || depth > 5) {
    return undefined;
  }

  return depth;
}