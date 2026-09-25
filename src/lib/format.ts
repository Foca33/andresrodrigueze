/** Deterministic (server === client) compact number formatting, Spanish decimal comma. */
export function formatCompact(n: number): string {
  const trim = (x: number) => String(Math.round(x * 10) / 10).replace(".", ",");
  if (n >= 1_000_000) return `${trim(n / 1_000_000)}M`;
  if (n >= 1_000) return `${trim(n / 1_000)}K`;
  return String(n);
}

export function formatInt(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
