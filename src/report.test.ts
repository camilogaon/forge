import { equal } from "node:assert/strict";
import { test } from "node:test";
import { reportSearchHits, selectEvidenceHits } from "./report";
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

test("shows at most five lines and counts the rest", () => {
  const hits: SearchHit[] = [
    { path: "src/app.ts", lineNumber: 1, text: "one" },
    { path: "src/app.ts", lineNumber: 2, text: "two" },
    { path: "src/app.ts", lineNumber: 3, text: "three" },
    { path: "src/app.ts", lineNumber: 4, text: "four" },
    { path: "src/app.ts", lineNumber: 5, text: "five" },
    { path: "src/app.ts", lineNumber: 6, text: "six" },
  ];

  const report: string = reportSearchHits("count", hits);

  equal(report.includes("  5: five"), true);
  equal(report.includes("  6: six"), false);
  equal(report.includes("Matching lines: 6"), true);
  equal(report.includes("Omitted lines: 1"), true);
});

test("keeps source files and drops docs and tests", () => {
  const hits: SearchHit[] = [
    { path: "README.md", lineNumber: 1, text: "docs" },
    { path: "src/read.ts", lineNumber: 4, text: "code" },
    { path: "src/read.test.ts", lineNumber: 2, text: "test" },
  ];

  const selected: SearchHit[] = selectEvidenceHits(hits);

  equal(selected.length, 1);
  equal(selected[0].path, "src/read.ts");
});