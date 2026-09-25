import { placeholderUrl } from "./site";

export type FormatId = "kindle" | "paperback" | "hardcover";
export type RetailerId = "amazon" | "buscalibre" | "kobo" | "apple";

export interface Retailer {
  id: RetailerId;
  name: string;
}

export const retailers: Record<RetailerId, Retailer> = {
  amazon: { id: "amazon", name: "Amazon" },
  buscalibre: { id: "buscalibre", name: "Buscalibre" },
  kobo: { id: "kobo", name: "Kobo" },
  apple: { id: "apple", name: "Apple Books" },
};

export interface RetailerLink {
  retailer: RetailerId;
  /** Replace the placeholderUrl(...) call with the real product URL. */
  url: string;
  /** Flip to true when the URL is real. Disabled retailers never render. */
  enabled: boolean;
  /** Optional CTA override, e.g. "LEER EN KINDLE". */
  cta?: string;
}

export interface Edition {
  id: FormatId;
  label: string;
  descriptor: string;
  /** [KINDLE_PRICE] / [PAPERBACK_PRICE] / [HARDCOVER_PRICE] — null renders "Precio por confirmar". */
  price: string | null;
  /** [ISBN] */
  isbn: string | null;
  links: RetailerLink[];
}

/**
 * EDITIONS — status: NOT PUBLISHED YET (KDP pending).
 * Every url below is a TEMPORARY PLACEHOLDER → https://example.com/?placeholder=TOKEN
 * To go live: replace each placeholderUrl("...") with the real URL and set enabled: true
 * on the retailers you want visible. No component changes required.
 */
export const editions: Edition[] = [
  {
    id: "kindle",
    label: "Kindle",
    descriptor: "Edición digital",
    price: null, // [KINDLE_PRICE]
    isbn: null, // [ISBN]
    links: [
      { retailer: "amazon", url: placeholderUrl("AMAZON_URL_KINDLE"), enabled: true, cta: "LEER EN KINDLE" },
      { retailer: "kobo", url: placeholderUrl("KOBO_URL"), enabled: false },
      { retailer: "apple", url: placeholderUrl("APPLE_BOOKS_URL"), enabled: false },
    ],
  },
  {
    id: "paperback",
    label: "Paperback",
    descriptor: "Tapa blanda",
    price: null, // [PAPERBACK_PRICE]
    isbn: null,
    links: [
      { retailer: "amazon", url: placeholderUrl("AMAZON_URL_PAPERBACK"), enabled: true },
      { retailer: "buscalibre", url: placeholderUrl("BUSCALIBRE_URL_PAPERBACK"), enabled: true },
    ],
  },
  {
    id: "hardcover",
    label: "Hardcover",
    descriptor: "Tapa dura",
    price: null, // [HARDCOVER_PRICE]
    isbn: null,
    links: [
      { retailer: "amazon", url: placeholderUrl("AMAZON_URL_HARDCOVER"), enabled: true },
      { retailer: "buscalibre", url: placeholderUrl("BUSCALIBRE_URL_HARDCOVER"), enabled: true },
    ],
  },
];

export const enabledLinks = (e: Edition) => e.links.filter((l) => l.enabled);
export const defaultEdition: FormatId = "paperback";

/** Where the primary "COMPRAR HELA" CTAs jump to. */
export const primaryPurchaseAnchor = "#ediciones";
