import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { contact, emergency } from "@/data/clinic";
import { EmergencyBlock } from "@/components/Emergency";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { TLink } from "@/components/Transition";

/**
 * Halaman darurat.
 *
 * HANYA ada kalau `emergency.enabled` di config bernilai true. Kalau flag mati,
 * rute ini mengembalikan 404 — bukan halaman kosong, bukan halaman yang masih
 * bisa dibuka lewat URL langsung. Ini penting: mengarahkan orang ke halaman
 * darurat pada klinik yang tidak melayani darurat bisa membuat mereka datang
 * ke klinik yang tutup.
 */

export const metadata: Metadata = emergency.enabled
  ? {
      title: "Kondisi Mendesak",
      description:
        "Cara menghubungi Klinik Hewan Kalimutu untuk kondisi yang tidak bisa menunggu.",
      alternates: { canonical: "/darurat" },
    }
  : { title: "Halaman tidak ditemukan", robots: { index: false, follow: false } };

export default function DaruratPage() {
  if (!emergency.enabled) notFound();

  return (
    <section className="u-container py-12 lg:py-16">
      <Reveal>
        <SectionHeader
          as="h1"
          eyebrow="Kondisi mendesak"
          title="Hubungi klinik secara langsung"
          description="Untuk kondisi yang tidak bisa menunggu, jangan mengisi formulir. Hubungi klinik lewat telepon atau WhatsApp."
          cta={
            <a href={`tel:${emergency.phone ?? contact.phone}`} className="u-btn u-btn--urgent">
              Telepon sekarang
            </a>
          }
        />
      </Reveal>

      <EmergencyBlock className="mt-10" />

      <Reveal>
        <p className="mt-8 max-w-[60ch] text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
          Untuk kunjungan yang dapat dijadwalkan, gunakan{" "}
          <TLink
            href="/janji-temu"
            className="text-[var(--color-accent)] underline underline-offset-4"
          >
            halaman janji temu
          </TLink>
          .
        </p>
      </Reveal>
    </section>
  );
}
