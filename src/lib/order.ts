import { track } from "@/lib/analytics";

export const ORDER_EVENT = "hela:open-order";

/** Abre el formulario de pedido de la edición impresa desde cualquier parte (barra, edición, nav). */
export function openOrder(location: string) {
  if (typeof window === "undefined") return;
  track("order_open", { location });
  window.dispatchEvent(new CustomEvent(ORDER_EVENT));
}
