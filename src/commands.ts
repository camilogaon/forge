import { readDepth } from "./depth";
import { showHelp } from "./help";
import { inspectDirectory } from "./inspect";
import { readSourceFile } from "./read";
import { collectSearchHits, searchDirectory } from "./search";
import { quotedEvidenceModel } from "./model";
import { buildAskReport } from "./ask";

export type ForgeCommand = {
  name: string;
  usage: string;
  description: string;
  run: (args: string[]) => void;
};

export const commands: ForgeCommand[] = [
  {
    name: "help",
    usage: "help",
    description: "Show how to use Forge",
    run: runHelp,
  },
  {
    name: "inspect",
    usage: "inspect <directory> [depth]",
    description: "List entries up to a depth from 1 to 5",
    run: runInspect,
  },
  {
    name: "read",
    usage: "read <file>",
    description: "Show the text inside a file",
    run: runRead,
  },
  {
    name: "search",
    usage: "search <directory> <text> [depth]",
    description: "Find text up to a depth of 5",
    run: runSearch,
  },
  {
    name: "ask",
    usage: "ask <directory> <text> [depth]",
    description: "Report evidence for a text search",
    run: runAsk,
  },
];

export function findCommand(name: string): ForgeCommand | undefined {
  for (const command of commands) {
    if (command.name === name) {
      return command;
    }
  }

  return undefined;
}

function runHelp(_args: string[]): void {
  showHelp();
}

function runInspect(args: string[]): void {
  const directoryPath: string | undefined = args[0];
  const rawDepth: string | undefined = args[1];

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

function runRead(args: string[]): void {
  const filePath: string | undefined = args[0];

  if (filePath === undefined) {
    console.error("Usage: forge read <file>");
    process.exitCode = 1;
    return;
  }

  readSourceFile(filePath);
}

function runSearch(args: string[]): void {
  const directoryPath: string | undefined = args[0];
  const query: string | undefined = args[1];
  const rawDepth: string | undefined = args[2];

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

function runAsk(args: string[]): void {
  const directoryPath: string | undefined = args[0];
  const query: string | undefined = args[1];
  const rawDepth: string | undefined = args[2];

  if (directoryPath === undefined || query === undefined) {
    console.error("Usage: forge ask <directory> <text> [depth]");
    process.exitCode = 1;
    return;
  }

  const maxDepth: number | undefined = readDepth(rawDepth, 5);
  if (maxDepth === undefined) {
    console.error("Depth must be a whole number from 1 to 5.");
    process.exitCode = 1;
    return;
  }

  try {
    const hits = collectSearchHits(directoryPath, query, maxDepth);
    console.log(buildAskReport(query, hits, quotedEvidenceModel));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cannot search directory: " + message);
    process.exitCode = 1;
  }
}