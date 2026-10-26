import { equal } from "node:assert/strict";
import { test } from "node:test";
import { commands, findCommand } from "./commands";


test("describes the four Forge commands", () => {
  equal(commands.length, 4);
  equal(commands[0].name, "help");
  equal(commands[1].name, "inspect");
  equal(commands[2].name, "read");
  equal(commands[3].name, "search");
});

test("finds a command by its name", () => {
  equal(findCommand("inspect")?.name, "inspect");
});

test("returns undefined for an unknown command", () => {
  equal(findCommand("build"), undefined);
});

test("stores a function for each command", () => {
  equal(typeof commands[0].run, "function");
  equal(typeof commands[1].run, "function");
  equal(typeof commands[2].run, "function");
  equal(typeof commands[3].run, "function");
});