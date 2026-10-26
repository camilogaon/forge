import { maxReportedHits } from "./limits";
import { type SearchHit } from "./search";

export function reportSearchHits(query: string, hits: SearchHit[]): string {
  if (hits.length === 0) {
    return "No evidence for: " + query;
  }

  const visibleHits: SearchHit[] = hits.slice(0, maxReportedHits);
  const omitted: number = hits.length - visibleHits.length;
  const lines: string[] = [];
  let currentPath: string | undefined = undefined;

  lines.push("Evidence for: " + query);
  lines.push("");

  for (const hit of visibleHits) {
    if (hit.path !== currentPath) {
      currentPath = hit.path;
      lines.push(hit.path);
    }

    lines.push("  " + hit.lineNumber + ": " + hit.text);
  }

  lines.push("");
  lines.push("Matching lines: " + String(hits.length));

  if (omitted > 0) {
    lines.push("Omitted lines: " + String(omitted));
  }

  return lines.join("\n");
}

const ignoredEvidenceSuffixes: string[] = [".md", ".test.ts"];

export function selectEvidenceHits(hits: SearchHit[]): SearchHit[] {
  const selected: SearchHit[] = [];

  for (const hit of hits) {
    if (!hasIgnoredSuffix(hit.path)) {
      selected.push(hit);
    }
  }

  return selected;
}

function hasIgnoredSuffix(filePath: string): boolean {
  for (const suffix of ignoredEvidenceSuffixes) {
    if (filePath.endsWith(suffix)) {
      return true;
    }
  }

  return false;
}