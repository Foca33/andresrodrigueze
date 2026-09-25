import type { SiteCopy } from "./es";
import { books } from "@/config/books";

export interface FaqItem {
  q: string;
  a: string;
  link?: { href: string; label: string };
}

const hela = books[0];

/** FAQ with the {pages} / {chapters} tokens resolved from config/books.ts (one source of truth). */
export function resolveFaq(copy: SiteCopy): FaqItem[] {
  return (copy.faq.items as readonly FaqItem[]).map((i) => ({
    ...i,
    a: i.a.replace("{pages}", String(hela.pages ?? "")).replace("{chapters}", String(hela.chapters ?? "")),
  }));
}
