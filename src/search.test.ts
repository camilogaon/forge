import { equal } from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { collectSearchHits, type SearchHit } from "./search";

test("returns the path and line of a match", () => {
  const root: string = createSearchTree();

  try {
    const hits: SearchHit[] = collectSearchHits(root, "readSourceFile", 2);

    equal(hits.length, 1);
    equal(hits[0].lineNumber, 2);
    equal(hits[0].text, "readSourceFile");
    equal(hits[0].path.endsWith("app.ts"), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("does not search generated files in dist", () => {
  const root: string = createSearchTree();

  try {
    const hits: SearchHit[] = collectSearchHits(root, "compiled", 2);

    equal(hits.length, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

function createSearchTree(): string {
  const root: string = mkdtempSync(join(tmpdir(), "forge-search-"));

  mkdirSync(join(root, "src"));
  writeFileSync(join(root, "src", "app.ts"), "alpha\nreadSourceFile\n");
  mkdirSync(join(root, "dist"));
  writeFileSync(join(root, "dist", "app.js"), "compiled\n");

  return root;
}