import { equal } from "node:assert/strict";
import { test } from "node:test";
import { commands } from "./commands";

test("describes the four Forge commands", () => {
  equal(commands.length, 4);
  equal(commands[0].name, "help");
  equal(commands[1].name, "inspect");
  equal(commands[2].name, "read");
  equal(commands[3].name, "search");
});