import { equal } from "node:assert/strict";
import { test } from "node:test";
import { reportSearchHits } from "./report";
import { type SearchHit } from "./search";

test("groups matches under their file", () => {
  const hits: SearchHit[] = [
    { path: "src/app.ts", lineNumber: 2, text: "forge starts" },
    { path: "src/app.ts", lineNumber: 4, text: "forge runs" },
    { path: "README.md", lineNumber: 1, text: "forge docs" },
  ];

  const report: string = reportSearchHits("forge", hits);
  const expected: string = [
    "Evidence for: forge",
    "",
    "src/app.ts",
    "  2: forge starts",
    "  4: forge runs",
    "README.md",
    "  1: forge docs",
    "",
    "Matching lines: 3",
  ].join("\n");

  equal(report, expected);
});

test("reports that there is no evidence", () => {
  equal(reportSearchHits("missing", []), "No evidence for: missing");
});