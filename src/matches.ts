export type LineMatch = {
  lineNumber: number;
  text: string;
};

export function findMatchingLines(content: string, query: string): LineMatch[] {
  const lines: string[] = content.split("\n");
  const matches: LineMatch[] = [];

  for (let index: number = 0; index < lines.length; index += 1) {
    const line: string = lines[index].replace("\r", "");

    if (line.includes(query)) {
      matches.push({
        lineNumber: index + 1,
        text: line,
      });
    }
  }

  return matches;
}