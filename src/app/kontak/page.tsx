import type { Metadata } from "next";

import { contact, fullAddress, hasOpeningHours } from "@/data/clinic";
import { Art } from "@/components/Art";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { OpenStatus } from "@/components/OpenStatus";
import { WeeklyHours } from "@/components/WeeklyHours";
import { EmergencyBlock } from "@/components/Emergency";
import { TLink } from "@/components/Transition";
import { WhatsAppIcon, WhatsAppLink } from "@/components/WhatsAppLink";
import { PhoneIcon } from "@/components/Header";

export const metadata: Metadata = {
  title: "Kontak Klinik Hewan Kalimutu Denpasar",
  description:
    "Hubungi Klinik Hewan Kalimutu di Denpasar Barat lewat WhatsApp atau telepon. Alamat lengkap dan tautan rute Google Maps tersedia di halaman ini.",
  alternates: { canonical: "/kontak" },
};

export default function KontakPage() {
  return (
    <section className="u-container py-12 lg:py-16">
      <Reveal>
        <SectionHeader
          as="h1"
          eyebrow="Kontak"
          title="Cara menghubungi klinik"
          description="WhatsApp adalah cara paling mudah menghubungi klinik. Untuk hal yang perlu dijawab saat itu juga, telepon langsung."
          cta={
            <>
              <WhatsAppLink
                label="WhatsApp dari halaman kontak"
                className="u-btn u-btn--primary"
              >
                <WhatsAppIcon className="size-[18px]" />
                WhatsApp {contact.whatsappDisplay}
              </WhatsAppLink>
              <a href={`tel:${contact.phone}`} className="u-btn u-btn--outline">
                <PhoneIcon className="size-[18px]" />
                Telepon {contact.phoneDisplay}
              </a>
            </>
          }
        />
      </Reveal>

      <Reveal>
        <OpenStatus className="mt-6" />
      </Reveal>

      <EmergencyBlock className="mt-8" />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <Reveal>
          <ul className="grid gap-5 sm:grid-cols-2">
            <li className="u-card p-5">
              <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
                WhatsApp
              </h2>
              <WhatsAppLink
                label="Nomor WhatsApp di kartu kontak"
                className="mt-2 block text-[1.0625rem] font-semibold text-[var(--color-accent)] underline-offset-4 hover:underline"
              >
                {contact.whatsappDisplay}
              </WhatsAppLink>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-[var(--color-ink-subtle)]">
                Untuk pertanyaan, janji temu, dan konfirmasi.
              </p>
            </li>

            <li className="u-card p-5">
              <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
                Telepon
              </h2>
              <a
                href={`tel:${contact.phone}`}
                className="mt-2 block text-[1.0625rem] font-semibold text-[var(--color-accent)] underline-offset-4 hover:underline"
              >
                {contact.phoneDisplay}
              </a>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-[var(--color-ink-subtle)]">
                Untuk hal yang perlu dijawab saat itu juga.
              </p>
            </li>

            <li className="u-card p-5 sm:col-span-2">
              <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
                Alamat
              </h2>
              <address className="mt-2 not-italic text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
                {fullAddress}
              </address>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <a
                  href={contact.mapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-btn u-btn--outline"
                >
                  Buka rute
                </a>
                <TLink href="/lokasi" className="u-btn u-btn--ghost">
                  Detail lokasi
                </TLink>
              </div>
            </li>

            <li className="u-card p-5 sm:col-span-2">
              <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
                Jam layanan
              </h2>
              {hasOpeningHours ? (
                <div className="mt-2">
                  <WeeklyHours />
                </div>
              ) : (
                <p className="mt-2 max-w-[56ch] text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
                  Jam layanan sedang kami konfirmasi ke klinik dan belum
                  ditampilkan di sini. Hubungi klinik lebih dulu untuk memastikan
                  sebelum berangkat.
                </p>
              )}

              {/*
                Tautan sosial media hanya muncul kalau sudah diisi di config dan
                dipastikan milik klinik.
              */}
              {contact.social.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-3">
                  {contact.social.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.9375rem] text-[var(--color-accent)] underline underline-offset-4"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          </ul>
        </Reveal>

        <Reveal delay={80}>
          <Art src="kontak" ratio="16x9" />
          <p className="mt-4 max-w-[46ch] text-[0.875rem] leading-relaxed text-[var(--color-ink-subtle)]">
            Bila Anda ingin menjadwalkan kunjungan, isi keterangan hewan Anda di
            halaman janji temu agar klinik dapat bersiap sebelum Anda datang.
          </p>
          <TLink href="/janji-temu" className="u-btn u-btn--primary mt-4">
            Buat janji temu
          </TLink>
        </Reveal>
      </div>
    </section>
  );
}
