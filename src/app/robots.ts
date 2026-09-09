import type { MetadataRoute } from "next";
import { site } from "@/data/clinic";

/**
 * robots.txt
 *
 * /admin dan /api dikecualikan dari perayapan. /admin juga sudah diberi
 * noindex lewat metadata halamannya, jadi ada dua lapis.
 */
export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
