import { maxReportedHits } from "./limits";
import { type SearchHit } from "./search";

export function answerFromEvidence(query: string, hits: SearchHit[]): string {
  const visibleHits: SearchHit[] = hits.slice(0, maxReportedHits);
  const paths: string[] = [];

  for (const hit of visibleHits) {
    if (!paths.includes(hit.path)) {
      paths.push(hit.path);
    }
  }

  if (paths.length === 0) {
    return "No evidence for: " + query;
  }

  return "The text \"" + query + "\" appears in " + paths.join(", ") + ".";
}