"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useCopy } from "@/components/Providers";
import { useSectionInView } from "@/components/motion/useSectionInView";
import { sections } from "@/config/site";
import { openOrder } from "@/lib/order";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Barra fija de pedido del impreso (Colombia). Visible en toda la navegación desde que se
 * empieza a bajar; solo se esconde cuando la sección Ediciones ya muestra el mismo botón.
 */
export function PrintOrderBar() {
  const c = useCopy().order.bar;
  const { scrollY } = useScroll();
  const [past, setPast] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 160;
    setPast((p) => (p === next ? p : next));
  });
  const inEditions = useSectionInView(sections.editions);
  const visible = past && !inEditions;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => openOrder("bar")}
          className="cta mono fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-4 bg-bone px-5 py-3.5 text-left font-medium text-ink shadow-[0_10px_40px_rgba(0,0,0,0.6)] md:inset-x-auto md:bottom-5 md:right-5 md:w-[31rem]"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="min-w-0">
            <span className="block">{c.label}</span>
            <span className="block !text-[0.68rem] opacity-70">
              {c.price} · {c.only}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-3">
            {c.cta}
            <Arrow />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
