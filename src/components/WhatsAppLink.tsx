"use client";

/**
 * Satu komponen untuk SEMUA tombol WhatsApp di situs.
 *
 * Otomatis menyisipkan URL halaman asal dan label tombol ke dalam pesan,
 * jadi klinik selalu tahu pengunjung menekan tombol yang mana dan dari halaman
 * mana. Jangan membuat tautan wa.me manual di tempat lain.
 */

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { contact } from "@/data/clinic";
import { generalMessage, whatsappHref } from "@/lib/whatsapp";

type Props = {
  /** Label tombol. Ikut dikirim ke dalam pesan WhatsApp. */
  label: string;
  /** Isi tombol. Kalau kosong, dipakai `label`. */
  children?: ReactNode;
  /** Kalimat pembuka khusus, kalau perlu berbeda dari default. */
  intro?: string;
  /** Pesan sudah jadi. Kalau diisi, `intro` diabaikan. */
  message?: string;
  className?: string;
  /** Nomor lain, mis. nomor darurat khusus. Default nomor utama klinik. */
  phone?: string;
};

export function WhatsAppLink({
  label,
  children,
  intro,
  message,
  className,
  phone = contact.whatsapp,
}: Props) {
  const pathname = usePathname() || "/";
  const text = message ?? generalMessage(label, pathname, intro);

  return (
    <a
      href={whatsappHref(text, phone)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-wa-label={label}
    >
      {children ?? label}
    </a>
  );
}

/** Ikon WhatsApp. Dekoratif — teks tombol yang menjelaskan maksudnya. */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.19-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.17 1.72 2.62 4.16 3.68.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}
