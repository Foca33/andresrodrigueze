"use client";

import { useEffect, useState } from "react";

/** Reports whether the element with `id` intersects the viewport. One shared observer per call. */
export function useSectionInView(id: string, rootMargin = "0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [id, rootMargin]);
  return inView;
}
