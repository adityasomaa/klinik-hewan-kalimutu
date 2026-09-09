import type { Metadata } from "next";

import { clinic, contact, fullAddress, hasOpeningHours } from "@/data/clinic";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { OpenStatus } from "@/components/OpenStatus";
import { WeeklyHours } from "@/components/WeeklyHours";
import { EmergencyBlock } from "@/components/Emergency";
import { WhatsAppIcon, WhatsAppLink } from "@/components/WhatsAppLink";
import { PhoneIcon } from "@/components/Header";

export const metadata: Metadata = {
  title: "Lokasi Klinik Hewan Kalimutu di Denpasar Barat",
  description:
    "Alamat dan rute ke Klinik Hewan Kalimutu, Jl. Gn. Kalimutu XIX No.36, Pemecutan Klod, Denpasar Barat. Buka rute langsung di Google Maps.",
  alternates: { canonical: "/lokasi" },
};

const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(
  "Klinik Hewan Kalimutu, Jl. Gn. Kalimutu XIX No.36, Pemecutan Klod, Denpasar"
)}&output=embed`;

export default function LokasiPage() {
  return (
    <section className="u-container py-12 lg:py-16">
      <Reveal>
        <SectionHeader
          as="h1"
          eyebrow="Lokasi"
          title="Alamat dan rute ke klinik"
          description="Klinik berada di Jalan Gunung Kalimutu XIX, kawasan Pemecutan Klod, Denpasar Barat. Bila Anda sedang membawa hewan, tekan tombol rute — tidak perlu membaca alamatnya."
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

      {/* Peta. Dibungkus rasio 16:9 supaya ruangnya tertahan sebelum iframe
          termuat dan layout tidak melompat. */}
      <Reveal>
        <div className="u-media-16x9 mt-10 border border-[var(--color-line)]">
          <iframe
            src={MAP_EMBED}
            title={`Peta lokasi ${clinic.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="size-full border-0"
          />
        </div>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <Reveal>
          <div className="u-card h-full p-6">
            <h2 className="u-h3 text-[var(--color-ink)]">Alamat</h2>
            <address className="mt-3 not-italic text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
              {fullAddress}
            </address>
            <p className="mt-4 text-[0.875rem] leading-relaxed text-[var(--color-ink-subtle)]">
              Plus code Google Maps: {contact.address.plusCode}
            </p>
            <a
              href={contact.mapsPlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-[0.9375rem] font-semibold text-[var(--color-accent)] underline underline-offset-4"
            >
              Lihat di Google Maps
            </a>
          </div>
        </Reveal>

        <Reveal delay={70}>
          <div className="u-card h-full p-6">
            <h2 className="u-h3 text-[var(--color-ink)]">Patokan jalan</h2>
            {/*
              Patokan ditulis hanya dari data yang memang terverifikasi di
              listing Google Maps: nama jalan, nomor, kelurahan, kecamatan, dan
              plus code. Tidak ada patokan bangunan atau belokan yang dikarang.
            */}
            <ul className="mt-3 flex list-disc flex-col gap-2.5 pl-5 text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
              <li>
                Berada di <strong>Jalan Gunung Kalimutu XIX</strong>, sebuah gang
                yang bercabang dari kawasan Jalan Gunung Kalimutu.
              </li>
              <li>
                Nomor bangunan <strong>36</strong>, kelurahan Pemecutan Klod,
                Kecamatan Denpasar Barat.
              </li>
              <li>
                Bila navigasi Anda sulit menemukan nomornya, masukkan plus code{" "}
                <strong>86H2+73</strong> di Google Maps.
              </li>
              <li>
                Bila masih ragu saat sudah dekat, hubungi klinik agar diarahkan.
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="u-card h-full p-6">
            <h2 className="u-h3 text-[var(--color-ink)]">Jam layanan</h2>
            {hasOpeningHours ? (
              <div className="mt-3">
                <WeeklyHours />
              </div>
            ) : (
              /*
                Jam operasional belum dikonfirmasi klinik, jadi tidak ada satu
                pun angka jam yang ditampilkan di sini. Menampilkan jam yang
                salah bisa membuat orang datang saat klinik tutup.
              */
              <div className="mt-3">
                <p className="text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
                  Jam layanan sedang kami konfirmasi langsung ke klinik dan belum
                  ditampilkan di sini. Untuk memastikan klinik sedang buka,
                  hubungi lebih dulu sebelum berangkat.
                </p>
                <div className="mt-4 flex flex-col gap-2.5">
                  <WhatsAppLink
                    label="Tanya jam buka"
                    intro="Halo, saya ingin menanyakan jam buka Klinik Hewan Kalimutu hari ini."
                    className="u-btn u-btn--primary"
                  >
                    <WhatsAppIcon className="size-[17px]" />
                    Tanyakan jam buka
                  </WhatsAppLink>
                  <a href={`tel:${contact.phone}`} className="u-btn u-btn--ghost">
                    <PhoneIcon className="size-[17px]" />
                    Telepon klinik
                  </a>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}
