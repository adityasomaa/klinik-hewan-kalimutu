import type { Metadata } from "next";

import {
  activeServices,
  animals,
  contact,
  fullAddress,
  hasOpeningHours,
} from "@/data/clinic";
import { Art } from "@/components/Art";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { OpenStatus } from "@/components/OpenStatus";
import { EmergencyBlock } from "@/components/Emergency";
import { TLink } from "@/components/Transition";
import { WhatsAppIcon, WhatsAppLink } from "@/components/WhatsAppLink";
import { PhoneIcon } from "@/components/Header";
import { WeeklyHours } from "@/components/WeeklyHours";

export const metadata: Metadata = {
  title: "Klinik Hewan di Denpasar untuk Anjing dan Kucing",
  description:
    "Klinik Hewan Kalimutu di Denpasar Barat melayani pemeriksaan umum, vaksinasi, sterilisasi, bedah, dan grooming untuk anjing dan kucing. Lihat lokasi, hubungi klinik, atau buat janji temu.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* =====================================================================
          HERO — tepat satu layar.
          Memakai 100svh, bukan 100vh, supaya tingginya tidak ikut berubah saat
          bilah peramban di HP menyembunyikan diri sewaktu discroll.
          Isinya langsung status buka, tombol WhatsApp, telepon, dan rute.
          ================================================================== */}
      <section
        aria-labelledby="hero-judul"
        className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center py-10"
      >
        {/* Grafik hero. Statis: sengaja tidak ada zoom saat discroll. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] items-center lg:flex"
        >
          <Art src="hero" ratio="16x9" className="w-full opacity-[0.9]" priority />
        </div>

        <div className="u-container relative">
          <div className="max-w-[36rem] lg:max-w-[42rem]">
            <OpenStatus className="mb-5" />

            <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
              Denpasar Barat, Bali
            </p>

            <h1 id="hero-judul" className="u-h1 mt-3 text-[var(--color-ink)]">
              Klinik hewan di Denpasar
            </h1>

            <p className="mt-4 max-w-[46ch] text-[1.0625rem] leading-relaxed text-[var(--color-ink-muted)]">
              Pemeriksaan, vaksinasi, sterilisasi, bedah, dan grooming untuk anjing
              dan kucing. Hubungi klinik lebih dulu bila ada yang ingin Anda
              tanyakan sebelum datang.
            </p>

            {/* Kontak utama, semuanya dalam jangkauan tanpa scroll. */}
            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <WhatsAppLink
                label="WhatsApp di hero"
                className="u-btn u-btn--primary"
              >
                <WhatsAppIcon className="size-[18px]" />
                WhatsApp {contact.whatsappDisplay}
              </WhatsAppLink>

              <a href={`tel:${contact.phone}`} className="u-btn u-btn--ghost">
                <PhoneIcon className="size-[18px]" />
                Telepon
              </a>

              <a
                href={contact.mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="u-btn u-btn--outline"
              >
                <PinIcon />
                Buka rute
              </a>
            </div>

            {/* Alamat selalu terlihat di layar pertama. */}
            <address className="mt-6 not-italic">
              <p className="max-w-[42ch] text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
                {fullAddress}
              </p>
            </address>

            <div className="mt-6">
              <TLink
                href="/janji-temu"
                className="inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-[var(--color-accent)] underline underline-offset-4"
              >
                Buat janji temu
                <span aria-hidden="true">→</span>
              </TLink>
            </div>
          </div>
        </div>
      </section>

      {/* Blok darurat hanya muncul kalau flag di config dinyalakan. */}
      {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
      <div className="u-container">
        <EmergencyBlock className="mb-16" />
      </div>

      {/* =====================================================================
          KATEGORI LAYANAN
          ================================================================== */}
      <section aria-labelledby="layanan-judul" className="u-container py-16 lg:py-20">
        <Reveal>
          <SectionHeader
            id="layanan-judul"
            eyebrow="Layanan"
            title="Layanan yang tersedia di klinik"
            description="Pemeriksaan dan perawatan untuk anjing dan kucing. Setiap layanan dijelaskan singkat: apa yang dikerjakan dan kapan orang biasanya membutuhkannya."
            cta={
              <>
                <TLink href="/layanan" className="u-btn u-btn--primary">
                  Lihat semua layanan
                </TLink>
                <WhatsAppLink
                  label="Tanya layanan dari beranda"
                  className="u-btn u-btn--outline"
                >
                  Tanya lewat WhatsApp
                </WhatsAppLink>
              </>
            }
          />
        </Reveal>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activeServices.slice(0, 6).map((service, i) => (
            <Reveal as="li" key={service.id} delay={i * 60}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </ul>

        {/*
          Jenis hewan di luar anjing dan kucing belum dikonfirmasi klinik, jadi
          ditampilkan sebagai pertanyaan yang diarahkan ke WhatsApp — bukan
          sebagai daftar tebakan.
        */}
        {animals.additional.length === 0 ? (
          <Reveal>
            <div className="mt-6 flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-accent-soft)] p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[54ch] text-[0.9375rem] leading-relaxed text-[var(--color-accent-ink)]">
                Hewan Anda bukan anjing atau kucing? Tanyakan lebih dulu apakah
                klinik dapat menanganinya.
              </p>
              <WhatsAppLink
                label="Tanya jenis hewan"
                intro="Halo, saya ingin menanyakan apakah Klinik Hewan Kalimutu menangani jenis hewan saya."
                className="u-btn u-btn--primary shrink-0"
              >
                Tanyakan jenis hewan
              </WhatsAppLink>
            </div>
          </Reveal>
        ) : null}
      </section>

      {/* =====================================================================
          JANJI TEMU — blok singkat, bukan form penuh.
          ================================================================== */}
      <section
        aria-labelledby="janji-judul"
        className="border-y border-[var(--color-line)] bg-[var(--color-surface)]"
      >
        <div className="u-container grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
          <Reveal>
            <SectionHeader
              id="janji-judul"
              eyebrow="Janji temu"
              title="Pilih waktu kunjungan"
              description="Isi keterangan singkat tentang hewan Anda dan pilih waktu yang tersedia. Keterangan itu diteruskan ke klinik agar dokter dapat bersiap sebelum kunjungan."
              cta={
                <>
                  <TLink href="/janji-temu" className="u-btn u-btn--primary">
                    Buat janji temu
                  </TLink>
                  <a href={`tel:${contact.phone}`} className="u-btn u-btn--outline">
                    <PhoneIcon className="size-[18px]" />
                    Telepon klinik
                  </a>
                </>
              }
            />
          </Reveal>

          <Reveal delay={80}>
            <Art src="janji-temu" ratio="16x9" />
          </Reveal>
        </div>
      </section>

      {/* =====================================================================
          LOKASI
          ================================================================== */}
      <section aria-labelledby="lokasi-judul" className="u-container py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <Art src="lokasi" ratio="16x9" />
          </Reveal>

          <Reveal delay={80}>
            <SectionHeader
              id="lokasi-judul"
              eyebrow="Lokasi"
              title="Jalan Gunung Kalimutu XIX"
              description="Klinik berada di Jalan Gunung Kalimutu XIX No.36, kawasan Pemecutan Klod, Denpasar Barat. Tombol di bawah langsung membuka rute di Google Maps."
              cta={
                <>
                  <a
                    href={contact.mapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="u-btn u-btn--primary"
                  >
                    <PinIcon />
                    Buka rute di Google Maps
                  </a>
                  <TLink href="/lokasi" className="u-btn u-btn--outline">
                    Detail lokasi
                  </TLink>
                </>
              }
            />

            <dl className="mt-8 grid gap-5 border-t border-[var(--color-line)] pt-6 sm:grid-cols-2">
              <div>
                <dt className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
                  Alamat
                </dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
                  {fullAddress}
                </dd>
              </div>
              <div>
                <dt className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
                  Jam layanan
                </dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
                  {hasOpeningHours ? (
                    <WeeklyHours compact />
                  ) : (
                    <>
                      Jam layanan sedang kami konfirmasi ke klinik. Untuk
                      memastikan, hubungi klinik lewat WhatsApp atau telepon.
                    </>
                  )}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}
