import { equal } from "node:assert/strict";
import { test } from "node:test";
import { commands, findCommand } from "./commands";


test("describes the Forge commands", () => {
  equal(commands.length, 5);
  equal(commands[0].name, "help");
  equal(commands[1].name, "inspect");
  equal(commands[2].name, "read");
  equal(commands[3].name, "search");
  equal(commands[4].name, "ask");
});

test("finds a command by its name", () => {
  equal(findCommand("inspect")?.name, "inspect");
});

test("returns undefined for an unknown command", () => {
  equal(findCommand("build"), undefined);
});

test("stores a function for each command", () => {
  for (const command of commands) {
    equal(typeof command.run, "function");
  }
});