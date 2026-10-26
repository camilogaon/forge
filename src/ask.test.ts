import { equal } from "node:assert/strict";
import { test } from "node:test";
import { buildAskReport } from "./ask";
import { type EvidenceModel } from "./model";
import { type SearchHit } from "./search";

test("asks the model only about source files", () => {
  const recordingModel: EvidenceModel = {
    name: "recording",
    answer(_query: string, hits: SearchHit[]): string {
      return hits[0].path;
    },
  };
  const hits: SearchHit[] = [
    { path: "README.md", lineNumber: 1, text: "docs" },
    { path: "src/read.ts", lineNumber: 4, text: "code" },
  ];

  const report: string = buildAskReport("code", hits, recordingModel);

  equal(report.endsWith("src/read.ts"), true);
  equal(report.includes("README.md"), false);
});

test("uses the answer returned by the given model", () => {
  const countingModel: EvidenceModel = {
    name: "counting",
    answer(_query: string, hits: SearchHit[]): string {
      return "hits " + String(hits.length);
    },
  };
  const hits: SearchHit[] = [
    { path: "src/read.ts", lineNumber: 4, text: "code" },
  ];

  const report: string = buildAskReport("code", hits, countingModel);

  equal(report.endsWith("hits 1"), true);
});