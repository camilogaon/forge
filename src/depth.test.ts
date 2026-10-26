import { equal } from "node:assert/strict";
import { test } from "node:test";
import { readDepth } from "./depth";

test("uses the provided default when the depth is omitted", () => {
  equal(readDepth(undefined, 1), 1);
  equal(readDepth(undefined, 5), 5);
});

test("accepts a depth from 1 to 5", () => {
  equal(readDepth("5", 1), 5);
});

test("rejects a depth outside 1 to 5", () => {
  equal(readDepth("0", 1), undefined);
  equal(readDepth("9", 1), undefined);
});

test("rejects text that is not a whole number", () => {
  equal(readDepth("two", 1), undefined);
  equal(readDepth("2.5", 1), undefined);
});