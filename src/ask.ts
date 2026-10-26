import { type EvidenceModel } from "./model";
import { reportSearchHits, selectEvidenceHits } from "./report";
import { type SearchHit } from "./search";

export function buildAskReport(
  query: string,
  hits: SearchHit[],
  model: EvidenceModel,
): string {
  const evidence: SearchHit[] = selectEvidenceHits(hits);

  if (evidence.length === 0) {
    return "No evidence in source files for: " + query;
  }

  return reportSearchHits(query, evidence) + "\n\n" + model.answer(query, evidence);
}