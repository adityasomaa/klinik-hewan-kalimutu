"use client";

/**
 * Footer.
 *
 * Setiap halaman berakhir dengan CTA. Target CTA-nya BERTUKAR otomatis kalau
 * pengunjung sudah berada di halaman tujuannya — mengirim orang ke halaman yang
 * sedang mereka buka adalah jalan buntu.
 */

import { usePathname } from "next/navigation";
import { clinic, contact, fullAddress, site } from "@/data/clinic";
import { NAV } from "@/components/Header";
import { TLink } from "@/components/Transition";
import { WhatsAppIcon, WhatsAppLink } from "@/components/WhatsAppLink";
import { OpenStatus } from "@/components/OpenStatus";
import { PhoneIcon } from "@/components/Header";

/** Urutan prioritas CTA. Yang pertama yang bukan halaman sekarang, itu yang dipakai. */
const CTA_CHAIN = [
  {
    href: "/janji-temu",
    eyebrow: "Langkah berikutnya",
    title: "Buat janji temu",
    body: "Isi keterangan singkat tentang hewan Anda dan pilih waktu kunjungan. Klinik akan mengonfirmasi ulang lewat WhatsApp.",
    action: "Buat janji temu",
  },
  {
    href: "/layanan",
    eyebrow: "Langkah berikutnya",
    title: "Lihat layanan yang tersedia",
    body: "Daftar layanan yang tersedia di klinik, beserta penjelasan singkat tentang apa yang dikerjakan.",
    action: "Lihat layanan",
  },
  {
    href: "/lokasi",
    eyebrow: "Langkah berikutnya",
    title: "Lihat lokasi dan rute",
    body: "Alamat lengkap, patokan jalan, dan tombol yang langsung membuka rute di Google Maps.",
    action: "Lihat lokasi",
  },
];

export function Footer() {
  const pathname = usePathname() || "/";
  const cta = CTA_CHAIN.find((c) => !pathname.startsWith(c.href)) ?? CTA_CHAIN[0];
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-[var(--color-line)] bg-[var(--color-surface)]">
      {/* CTA penutup — ada di setiap halaman. */}
      <section
        aria-labelledby="footer-cta"
        className="border-b border-[var(--color-line)]"
      >
        <div className="u-container flex flex-col gap-6 py-14 lg:flex-row lg:items-end lg:justify-between lg:py-16">
          <div>
            <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
              {cta.eyebrow}
            </p>
            <h2 id="footer-cta" className="u-h2 mt-3 text-[var(--color-ink)]">
              {cta.title}
            </h2>
            <p className="mt-3 max-w-[54ch] text-[1.0625rem] leading-relaxed text-[var(--color-ink-muted)]">
              {cta.body}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
            <TLink href={cta.href} className="u-btn u-btn--primary">
              {cta.action}
            </TLink>
            <WhatsAppLink
              label="WhatsApp di footer"
              className="u-btn u-btn--outline"
            >
              <WhatsAppIcon className="size-[17px]" />
              Tanya lewat WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      </section>

      {/* Informasi */}
      <div className="u-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-[var(--font-display)] text-lg font-bold leading-tight tracking-[-0.02em] text-[var(--color-ink)]">
            Klinik Hewan
            <span className="block text-[var(--color-accent)]">Kalimutu</span>
          </p>
          <p className="mt-3 max-w-[38ch] text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
            {clinic.tagline}. Melayani pemeriksaan dan perawatan anjing dan kucing.
          </p>
          <OpenStatus className="mt-4" tone="dark" />
        </div>

        <nav aria-label="Navigasi footer">
          <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
            Halaman
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <TLink
                  href={item.href}
                  className="text-[0.9375rem] text-[var(--color-ink-muted)] underline-offset-4 hover:text-[var(--color-accent)] hover:underline"
                >
                  {item.label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
            Kontak
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-[0.9375rem] text-[var(--color-ink-muted)]">
            <li>
              <a
                href={`tel:${contact.phone}`}
                className="inline-flex items-center gap-2 underline-offset-4 hover:text-[var(--color-accent)] hover:underline"
              >
                <PhoneIcon className="size-4" />
                {contact.phoneDisplay}
              </a>
            </li>
            <li>
              <WhatsAppLink
                label="WhatsApp di daftar kontak footer"
                className="inline-flex items-center gap-2 underline-offset-4 hover:text-[var(--color-accent)] hover:underline"
              >
                <WhatsAppIcon className="size-4" />
                WhatsApp {contact.whatsappDisplay}
              </WhatsAppLink>
            </li>
            <li className="max-w-[34ch] leading-relaxed">{fullAddress}</li>
            <li>
              <a
                href={contact.mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-[var(--color-accent)]"
              >
                Buka rute di Google Maps
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
            Ketentuan
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-[0.9375rem] text-[var(--color-ink-muted)]">
            <li>
              <TLink
                href="/kebijakan-privasi"
                className="underline-offset-4 hover:text-[var(--color-accent)] hover:underline"
              >
                Kebijakan Privasi
              </TLink>
            </li>
            <li>
              <TLink
                href="/ketentuan-layanan"
                className="underline-offset-4 hover:text-[var(--color-accent)] hover:underline"
              >
                Ketentuan Layanan
              </TLink>
            </li>
          </ul>

          {/*
            Tautan sosial media hanya muncul kalau memang sudah diisi di config
            dan dipastikan milik klinik. Selama kosong, tidak ada blok sosial
            media sama sekali.
          */}
          {contact.social.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-3 text-[0.9375rem]">
              {contact.social.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-ink-muted)] underline underline-offset-4 hover:text-[var(--color-accent)]"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="border-t border-[var(--color-line)]">
        <div className="u-container flex flex-col gap-2 py-6 text-[0.8125rem] text-[var(--color-ink-subtle)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {clinic.name}
          </p>
          <p>
            {site.url.replace("https://", "")}
          </p>
        </div>
      </div>
    </footer>
  );
}
