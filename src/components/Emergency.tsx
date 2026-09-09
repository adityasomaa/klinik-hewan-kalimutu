/**
 * Jalur darurat.
 *
 * SELURUH blok ini dikendalikan satu flag: `emergency.enabled` di
 * src/data/clinic.ts. Waktu flag itu mati, komponen mengembalikan null dan
 * tidak menyisakan apa pun — tidak ada judul menggantung, tidak ada pembatas,
 * tidak ada ruang kosong. Rute /darurat juga mengembalikan 404.
 *
 * Blok ini sengaja memotong antrean: orang yang hewannya sedang gawat tidak
 * boleh diminta mengisi formulir delapan kolom.
 */

import { contact, emergency } from "@/data/clinic";
import { WhatsAppIcon, WhatsAppLink } from "@/components/WhatsAppLink";

const phone = emergency.phone ?? contact.phone;
const phoneDisplay = emergency.phoneDisplay ?? contact.phoneDisplay;

export function EmergencyBlock({ className = "" }: { className?: string }) {
  if (!emergency.enabled) return null;

  return (
    <aside
      aria-labelledby="darurat-judul"
      className={
        "rounded-[var(--radius-card)] border-2 border-[var(--color-urgent)] bg-[var(--color-urgent-soft)] p-5 sm:p-6 " +
        className
      }
    >
      <h2
        id="darurat-judul"
        className="u-h3 text-[var(--color-urgent)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {emergency.headline}
      </h2>

      <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[var(--color-ink)]">
        {emergency.description}
      </p>

      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
        <a href={`tel:${phone}`} className="u-btn u-btn--urgent flex-1 sm:flex-initial">
          Telepon {phoneDisplay}
        </a>

        <WhatsAppLink
          label="Darurat lewat WhatsApp"
          intro="Halo, saya perlu bantuan untuk kondisi hewan yang mendesak."
          className="u-btn u-btn--ghost flex-1 border-[var(--color-urgent)] text-[var(--color-urgent)] sm:flex-initial"
        >
          <WhatsAppIcon className="size-[18px]" />
          WhatsApp
        </WhatsAppLink>
      </div>
    </aside>
  );
}

/** Versi ringkas satu baris untuk dipasang di atas form janji temu. */
export function EmergencyBar({ className = "" }: { className?: string }) {
  if (!emergency.enabled) return null;

  return (
    <div
      className={
        "flex flex-col gap-3 rounded-[var(--radius-card)] border-2 border-[var(--color-urgent)] bg-[var(--color-urgent-soft)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 " +
        className
      }
    >
      <p className="max-w-[46ch] text-[0.9375rem] font-medium leading-relaxed text-[var(--color-ink)]">
        <strong className="text-[var(--color-urgent)]">{emergency.headline}.</strong>{" "}
        {emergency.description}
      </p>

      <div className="flex shrink-0 gap-2.5">
        <a href={`tel:${phone}`} className="u-btn u-btn--urgent flex-1 sm:flex-initial">
          Telepon
        </a>
        <WhatsAppLink
          label="Darurat dari halaman janji temu"
          intro="Halo, saya perlu bantuan untuk kondisi hewan yang mendesak."
          className="u-btn u-btn--ghost flex-1 border-[var(--color-urgent)] text-[var(--color-urgent)] sm:flex-initial"
        >
          WhatsApp
        </WhatsAppLink>
      </div>
    </div>
  );
}
