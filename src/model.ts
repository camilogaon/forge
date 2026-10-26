import { answerFromEvidence } from "./answer";
import { type SearchHit } from "./search";

export type EvidenceModel = {
  name: string;
  answer(query: string, hits: SearchHit[]): string;
};

export const quotedEvidenceModel: EvidenceModel = {
  name: "quoted-evidence",
  answer(query: string, hits: SearchHit[]): string {
    return answerFromEvidence(query, hits);
  },
};