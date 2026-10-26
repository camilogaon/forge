#!/usr/bin/env node

import { findCommand } from "./commands";

const commandName: string | undefined = process.argv[2];
const args: string[] = process.argv.slice(3);

let requestedName: string = "help";

if (commandName !== undefined) {
  requestedName = commandName;
}

const command = findCommand(requestedName);

if (command === undefined) {
  console.error("Unknown command: " + commandName);
  process.exitCode = 1;
} else {
  command.run(args);
}