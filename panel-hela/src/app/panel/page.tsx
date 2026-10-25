import type { Metadata } from "next";
import { PanelClient } from "./PanelClient";

/** Panel privado de métricas. No se indexa y exige contraseña. */
export const metadata: Metadata = {
  title: "Panel · HELA",
  robots: { index: false, follow: false },
};

export default function PanelPage() {
  return <PanelClient />;
}
