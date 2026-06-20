// Generic full-row search: matches the query against every value of the row
// (plus any extra values such as locally-edited overrides not yet in the row).
export function rowMatches(
  row: Record<string, unknown>,
  query: string,
  extra: unknown[] = [],
): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  for (const v of [...Object.values(row), ...extra]) {
    if (v != null && String(v).toLowerCase().includes(q)) return true;
  }
  return false;
}
