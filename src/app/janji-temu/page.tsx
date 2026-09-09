import type { Metadata } from "next";
import { Suspense } from "react";

import { booking, hasOpeningHours } from "@/data/clinic";
import { BookingForm } from "@/components/BookingForm";
import { EmergencyBar } from "@/components/Emergency";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { WhatsAppLink } from "@/components/WhatsAppLink";

export const metadata: Metadata = {
  title: "Buat Janji Temu Klinik Hewan Denpasar",
  description:
    "Pilih waktu kunjungan ke Klinik Hewan Kalimutu di Denpasar Barat. Isi keterangan singkat mengenai hewan Anda agar klinik dapat bersiap sebelum kunjungan.",
  alternates: { canonical: "/janji-temu" },
};

export default function JanjiTemuPage() {
  return (
    <section className="u-container py-12 lg:py-16">
      <Reveal>
        <SectionHeader
          as="h1"
          eyebrow="Janji temu"
          title="Pilih waktu kunjungan ke klinik"
          description="Isi data pemilik dan hewan, pilih layanan, lalu pilih tanggal dan waktu. Permintaan dikirim lewat WhatsApp dan berlaku setelah dikonfirmasi klinik."
          cta={
            <WhatsAppLink
              label="Konsultasi dulu sebelum booking"
              intro="Halo, saya ingin berkonsultasi lebih dulu sebelum membuat janji temu."
              className="u-btn u-btn--outline"
            >
              Konsultasi dulu lewat WhatsApp
            </WhatsAppLink>
          }
        />
      </Reveal>

      {/* Jalur darurat memotong antrean dan dirender di server, di atas batas
          Suspense, jadi tombolnya sudah bisa ditekan sebelum JavaScript selesai. */}
      <EmergencyBar className="mt-10" />

      <div className="mt-6">
        <Suspense fallback={<FormSkeleton />}>
          <BookingForm />
        </Suspense>
      </div>

      {/* Catatan jujur tentang cara kerja halaman ini. */}
      <Reveal>
        <aside className="mt-10 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-sunken)] p-5">
          <h2 className="text-[0.9375rem] font-semibold text-[var(--color-ink)]">
            Cara kerja halaman ini
          </h2>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[0.875rem] leading-relaxed text-[var(--color-ink-muted)]">
            <li>
              Permintaan dikirim ke klinik lewat WhatsApp. Belum ada sistem
              penjadwalan otomatis di sisi klinik.
            </li>
            <li>
              Slot yang Anda pesan tersimpan di peramban perangkat ini saja,
              sehingga slot yang sama tidak dapat dipilih dua kali dari perangkat
              ini. Pengunjung lain tidak melihat pemesanan Anda.
            </li>
            <li>
              Pemesanan paling cepat {booking.minLeadMinutes} menit dari sekarang,
              dan paling jauh {booking.maxAdvanceDays} hari ke depan.
            </li>
            {!hasOpeningHours ? (
              <li>
                Jam operasional klinik belum kami konfirmasi. Pilihan waktu yang
                tampil masih bersifat sementara dan akan dipastikan ulang oleh
                klinik saat konfirmasi.
              </li>
            ) : null}
          </ul>
        </aside>
      </Reveal>
    </section>
  );
}

function FormSkeleton() {
  return (
    <div
      className="u-card p-6 sm:p-8"
      role="status"
      aria-live="polite"
      aria-label="Memuat formulir janji temu"
    >
      <div className="h-5 w-40 rounded bg-[var(--color-sunken)]" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[3.25rem] rounded-[var(--radius-card)] bg-[var(--color-sunken)]" />
        ))}
      </div>
    </div>
  );
}
