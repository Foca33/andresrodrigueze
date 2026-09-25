"use client";

import { createContext, useContext } from "react";
import type { SiteAssets } from "@/lib/assets-types";
import type { SiteCopy } from "@/content";

interface Ctx {
  copy: SiteCopy;
  assets: SiteAssets;
}

const SiteContext = createContext<Ctx | null>(null);

export function SiteProvider({ copy, assets, children }: Ctx & { children: React.ReactNode }) {
  return <SiteContext.Provider value={{ copy, assets }}>{children}</SiteContext.Provider>;
}

function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("SiteProvider missing");
  return ctx;
}

export const useCopy = () => useSite().copy;
export const useAssets = () => useSite().assets;
