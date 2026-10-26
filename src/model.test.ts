import { equal } from "node:assert/strict";
import { test } from "node:test";
import { answerFromEvidence } from "./answer";
import { quotedEvidenceModel, type EvidenceModel } from "./model";
import { type SearchHit } from "./search";

test("quoted model repeats the evidence answer", () => {
  const hits: SearchHit[] = [
    { path: "src/read.ts", lineNumber: 4, text: "readSourceFile" },
  ];

  equal(
    quotedEvidenceModel.answer("readSourceFile", hits),
    answerFromEvidence("readSourceFile", hits),
  );
});

test("another object can satisfy the same contract", () => {
  const countingModel: EvidenceModel = {
    name: "counting",
    answer(query: string, hits: SearchHit[]): string {
      return query + " " + String(hits.length);
    },
  };

  equal(countingModel.name, "counting");
  equal(countingModel.answer("readSourceFile", []), "readSourceFile 0");
});