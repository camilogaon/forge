import { type SearchHit } from "./search";

export function reportSearchHits(query: string, hits: SearchHit[]): string {
  if (hits.length === 0) {
    return "No evidence for: " + query;
  }

  const lines: string[] = [];
  lines.push("Evidence for: " + query);
  lines.push("");

  let currentPath: string | undefined = undefined;

  for (const hit of hits) {
    if (hit.path !== currentPath) {
      currentPath = hit.path;
      lines.push(hit.path);
    }

    lines.push("  " + hit.lineNumber + ": " + hit.text);
  }

  lines.push("");
  lines.push("Matching lines: " + String(hits.length));

  return lines.join("\n");
}