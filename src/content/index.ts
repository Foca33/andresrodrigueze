import { es, type SiteCopy } from "./es";

export type Locale = "es"; // add "en" when content/en.ts exists

const dictionaries: Record<Locale, SiteCopy> = { es };

export const getCopy = (locale: Locale = "es"): SiteCopy => dictionaries[locale] ?? es;
export type { SiteCopy };
