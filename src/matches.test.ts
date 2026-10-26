import { equal } from "node:assert/strict";
import { test } from "node:test";
import { findMatchingLines, type LineMatch } from "./matches";

test("returns the line number and text of a match", () => {
  const matches: LineMatch[] = findMatchingLines("alpha\nbeta\n", "beta");

  equal(matches.length, 1);
  equal(matches[0].lineNumber, 2);
  equal(matches[0].text, "beta");
});

test("does not match a different case", () => {
  const matches: LineMatch[] = findMatchingLines("Forge", "forge");

  equal(matches.length, 0);
});

test("removes the carriage return from a Windows line", () => {
  const matches: LineMatch[] = findMatchingLines("forge\r\n", "forge");

  equal(matches.length, 1);
  equal(matches[0].text, "forge");
});