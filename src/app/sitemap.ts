import type { MetadataRoute } from "next";
import { emergency, site } from "@/data/clinic";

/**
 * Sitemap.
 *
 * Rute /admin sengaja TIDAK dimasukkan — halaman itu juga diberi noindex di
 * metadata-nya. Rute /darurat hanya masuk kalau flag layanan darurat menyala;
 * kalau mati, rute itu memang tidak ada (404) sehingga tidak boleh didaftarkan.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const routes: { path: string; priority: number; freq: "weekly" | "monthly" | "yearly" }[] =
    [
      { path: "/", priority: 1, freq: "weekly" },
      { path: "/layanan", priority: 0.9, freq: "monthly" },
      { path: "/janji-temu", priority: 0.9, freq: "monthly" },
      { path: "/lokasi", priority: 0.8, freq: "monthly" },
      { path: "/kontak", priority: 0.8, freq: "monthly" },
      { path: "/kebijakan-privasi", priority: 0.2, freq: "yearly" },
      { path: "/ketentuan-layanan", priority: 0.2, freq: "yearly" },
    ];

  if (emergency.enabled) {
    routes.splice(1, 0, { path: "/darurat", priority: 0.95, freq: "monthly" });
  }

  return routes.map((r) => ({
    url: base + r.path,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
