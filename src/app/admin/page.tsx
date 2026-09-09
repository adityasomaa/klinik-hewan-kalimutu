import type { Metadata } from "next";
import { AdminBoard } from "@/components/AdminBoard";

/**
 * Halaman admin — DEMO.
 *
 * Dikecualikan dari sitemap dan diberi noindex. Tidak muncul di navigasi.
 *
 * Ini belum sistem admin sungguhan: datanya ada di peramban perangkat ini saja
 * dan tidak ada autentikasi. Sebelum dipakai betulan, halaman ini harus
 * disambungkan ke basis data dan dilindungi login di sisi server.
 */
export const metadata: Metadata = {
  title: "Admin (demo)",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: "/admin" },
};

export default function AdminPage() {
  return <AdminBoard />;
}
