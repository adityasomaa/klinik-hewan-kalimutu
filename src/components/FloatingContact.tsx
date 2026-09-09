"use client";

/**
 * Tombol kontak melayang.
 *
 * Kontak harus terjangkau dari halaman mana pun tanpa scroll ke atas atau ke
 * bawah. Tombol ini yang mengerjakan itu.
 *
 * Dua hal yang dijaga di sini:
 *   1. Tombol tidak boleh menutupi elemen terakhir halaman. Karena itu setiap
 *      halaman memakai kelas .u-fab-safe yang menyisakan padding bawah.
 *   2. Tombol tidak boleh menelan klik. Pembungkusnya pointer-events-none dan
 *      hanya tombol di dalamnya yang menerima pointer.
 *
 * Disembunyikan di halaman admin: itu ruang kerja internal, bukan halaman
 * tempat orang mencari kontak klinik.
 */

import { usePathname } from "next/navigation";
import { contact } from "@/data/clinic";
import { WhatsAppIcon, WhatsAppLink } from "@/components/WhatsAppLink";
import { PhoneIcon } from "@/components/Header";

export function FloatingContact() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/admin")) return null;

  return (
    <div
      className="kal-fab pointer-events-none fixed inset-x-0 bottom-0 flex justify-end px-4 pb-4 sm:px-6 sm:pb-6"
      style={{
        zIndex: "var(--z-fab)",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="pointer-events-auto flex items-center gap-2.5">
        <a
          href={`tel:${contact.phone}`}
          className="u-btn u-btn--ghost size-14 min-h-0 rounded-full px-0 shadow-[0_6px_24px_-6px_rgba(17,30,26,0.28)] sm:hidden"
          aria-label={`Telepon klinik di ${contact.phoneDisplay}`}
        >
          <PhoneIcon className="size-[22px]" />
        </a>

        <WhatsAppLink
          label="Tombol melayang WhatsApp"
          className="u-btn u-btn--primary h-14 min-h-0 rounded-full px-5 shadow-[0_6px_24px_-6px_rgba(17,30,26,0.36)]"
        >
          <WhatsAppIcon className="size-[22px]" />
          <span className="hidden sm:inline">WhatsApp</span>
          <span className="sm:hidden">Chat</span>
        </WhatsAppLink>
      </div>
    </div>
  );
}
