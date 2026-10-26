import { equal } from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { walkDirectory, type WalkEntry } from "./walk";

test("skips ignored directories and still reads allowed files", () => {
  const root: string = createSampleTree();

  try {
    const entries: WalkEntry[] = walkDirectory(root, 2, ["dist"]);
    const names: string[] = namesIn(entries);

    equal(names.includes("package.json"), true);
    equal(names.includes("src"), true);
    equal(names.includes("app.ts"), true);
    equal(names.includes("dist"), false);
    equal(names.includes("app.js"), false);
    equal(kindOf(entries, "src"), "dir");
    equal(kindOf(entries, "package.json"), "file");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("does not enter subdirectories when the depth is 1", () => {
  const root: string = createSampleTree();

  try {
    const entries: WalkEntry[] = walkDirectory(root, 1, []);
    const names: string[] = namesIn(entries);

    equal(names.includes("src"), true);
    equal(names.includes("app.ts"), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

function createSampleTree(): string {
  const root: string = mkdtempSync(join(tmpdir(), "forge-"));

  mkdirSync(join(root, "src"));
  writeFileSync(join(root, "src", "app.ts"), "export const value = 1;\n");
  mkdirSync(join(root, "dist"));
  writeFileSync(join(root, "dist", "app.js"), "compiled\n");
  writeFileSync(join(root, "package.json"), "{}\n");

  return root;
}

function namesIn(entries: WalkEntry[]): string[] {
  const names: string[] = [];

  for (const entry of entries) {
    names.push(entry.name);
  }

  return names;
}

function kindOf(entries: WalkEntry[], name: string): string | undefined {
  for (const entry of entries) {
    if (entry.name === name) {
      return entry.kind;
    }
  }

  return undefined;
}