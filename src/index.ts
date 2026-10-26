#!/usr/bin/env node

import { findCommand, type ForgeCommand } from "./commands";
import { readDepth } from "./depth";
import { showHelp } from "./help";
import { inspectDirectory } from "./inspect";
import { readSourceFile } from "./read";
import { searchDirectory } from "./search";

const commandName: string | undefined = process.argv[2];
const firstArgument: string | undefined = process.argv[3];
const secondArgument: string | undefined = process.argv[4];
const thirdArgument: string | undefined = process.argv[5];

if (commandName === undefined || commandName === "help") {
  showHelp();
} else {
  runCommand(commandName, firstArgument, secondArgument, thirdArgument);
}

function runCommand(
  commandName: string,
  firstArgument: string | undefined,
  secondArgument: string | undefined,
  thirdArgument: string | undefined,
): void {
  const command: ForgeCommand | undefined = findCommand(commandName);

  if (command === undefined) {
    console.error("Unknown command: " + commandName);
    process.exitCode = 1;
    return;
  }

  if (command.name === "inspect") {
    inspectCommand(firstArgument, secondArgument);
    return;
  }

  if (command.name === "read") {
    readCommand(firstArgument);
    return;
  }

  if (command.name === "search") {
    searchCommand(firstArgument, secondArgument, thirdArgument);
    return;
  }

  console.error("Command is not implemented: " + command.name);
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