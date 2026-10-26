import { equal } from "node:assert/strict";
import { test } from "node:test";
import { answerFromEvidence } from "./answer";
import { type SearchHit } from "./search";

test("names only the files present in the evidence", () => {
  const hits: SearchHit[] = [
    { path: "src/read.ts", lineNumber: 4, text: "readSourceFile" },
    { path: "src/commands.ts", lineNumber: 91, text: "readSourceFile" },
  ];

  const answer: string = answerFromEvidence("readSourceFile", hits);

  equal(
    answer,
    "The text \"readSourceFile\" appears in src/read.ts, src/commands.ts.",
  );
});

test("does not mention a file beyond the five-line limit", () => {
  const hits: SearchHit[] = [
    { path: "src/shown.ts", lineNumber: 1, text: "one" },
    { path: "src/shown.ts", lineNumber: 2, text: "two" },
    { path: "src/shown.ts", lineNumber: 3, text: "three" },
    { path: "src/shown.ts", lineNumber: 4, text: "four" },
    { path: "src/shown.ts", lineNumber: 5, text: "five" },
    { path: "src/hidden.ts", lineNumber: 6, text: "six" },
  ];

  const answer: string = answerFromEvidence("count", hits);

  equal(answer.includes("src/shown.ts"), true);
  equal(answer.includes("src/hidden.ts"), false);
});

test("does not invent an answer without evidence", () => {
  equal(answerFromEvidence("missing", []), "No evidence for: missing");
});