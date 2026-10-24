import { placeholderUrl } from "./site";

export type FormatId = "kindle" | "paperback";
export type RetailerId = "amazon" | "kobo" | "apple";

export interface Retailer {
  id: RetailerId;
  name: string;
}

export const retailers: Record<RetailerId, Retailer> = {
  amazon: { id: "amazon", name: "Amazon" },
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
  /** true → no tienda externa: el botón abre el formulario de pedido (venta directa, solo Colombia). */
  order?: boolean;
  links: RetailerLink[];
}

/** Venta directa de la edición impresa. Cambia el precio aquí y en content/es.ts (order.priceLine). */
export const printOrder = {
  priceCop: 70000,
  priceLabel: "$70.000",
} as const;

/**
 * EDITIONS
 *  - Impreso: venta directa en Colombia (formulario + pago por Bold). Ver components/OrderDialog.tsx.
 *  - Kindle: enlace real de Amazon. Kobo / Apple Books quedan ocultos hasta tener URL.
 */
export const editions: Edition[] = [
  {
    id: "paperback",
    label: "Impreso",
    descriptor: "Solo Colombia",
    price: "$70.000 · envío incluido",
    isbn: null,
    order: true,
    links: [],
  },
  {
    id: "kindle",
    label: "Kindle",
    descriptor: "Edición digital",
    price: null,
    isbn: null,
    links: [
      { retailer: "amazon", url: "https://a.co/d/0cluVThd", enabled: true, cta: "LEER EN KINDLE" },
      { retailer: "kobo", url: placeholderUrl("KOBO_URL"), enabled: false },
      { retailer: "apple", url: placeholderUrl("APPLE_BOOKS_URL"), enabled: false },
    ],
  },
];

export const enabledLinks = (e: Edition) => e.links.filter((l) => l.enabled);
export const defaultEdition: FormatId = "paperback";

/** Where the primary "COMPRAR HELA" CTAs jump to. */
export const primaryPurchaseAnchor = "#ediciones";
