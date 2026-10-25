import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return siteConfig.indexable
    ? { rules: { userAgent: "*", allow: "/", disallow: ["/panel", "/api/"] }, sitemap: `${siteConfig.url}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
