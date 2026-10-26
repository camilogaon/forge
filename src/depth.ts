export function readDepth(
  rawDepth: string | undefined,
  defaultDepth: number,
): number | undefined {
  if (rawDepth === undefined) {
    return defaultDepth;
  }

  const depth: number = Number(rawDepth);

  if (!Number.isInteger(depth) || depth < 1 || depth > 5) {
    return undefined;
  }

  return depth;
}