import { showHelp } from "./help";
import { inspectDirectory } from "./inspect";
import { readSourceFile } from "./read";
import { searchDirectory } from "./search";

const command: string | undefined = process.argv[2];
const firstArgument: string | undefined = process.argv[3];
const secondArgument: string | undefined = process.argv[4];
const thirdArgument: string | undefined = process.argv[5];

if (command === undefined || command === "help") {
  showHelp();
} else if (command === "inspect") {
  inspectCommand(firstArgument, secondArgument);
} else if (command === "read") {
  readCommand(firstArgument);
} else if (command === "search") {
  searchCommand(firstArgument, secondArgument, thirdArgument);
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

  const maxDepth: number | undefined = readDepth(rawDepth, 1);
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

function searchCommand(
  directoryPath: string | undefined,
  query: string | undefined,
  rawDepth: string | undefined,
): void {
  if (directoryPath === undefined || query === undefined) {
    console.error("Usage: forge search <directory> <text> [depth]");
    process.exitCode = 1;
    return;
  }

  const maxDepth: number | undefined = readDepth(rawDepth, 5);
  if (maxDepth === undefined) {
    console.error("Depth must be a whole number from 1 to 5.");
    process.exitCode = 1;
    return;
  }

  searchDirectory(directoryPath, query, maxDepth);
}

function readDepth(
  rawDepth: string | undefined,
  defaultDepth: number,
): number | undefined {
  if (rawDepth === undefined) {
    return defaultDepth;
  }

  const depth: number = Number(rawDepth);

  if (!Number.isInteger(depth) || depth < 1 || depth > 5) {
    return undefined;
  }

  return depth;
}