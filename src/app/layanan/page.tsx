import type { Metadata } from "next";

import { activeServices, animals, confirmedFacilities, team } from "@/data/clinic";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { EmergencyBlock } from "@/components/Emergency";
import { TLink } from "@/components/Transition";
import { WhatsAppLink } from "@/components/WhatsAppLink";

export const metadata: Metadata = {
  title: "Layanan Klinik Hewan di Denpasar",
  description:
    "Daftar layanan Klinik Hewan Kalimutu di Denpasar Barat: pemeriksaan umum, vaksinasi, sterilisasi, bedah, dan grooming untuk anjing dan kucing.",
  alternates: { canonical: "/layanan" },
};

/**
 * Layanan dikelompokkan supaya gampang dicari.
 * Kelompok yang seluruh isinya dimatikan di config tidak dirender sama sekali.
 */
const GROUPS = [
  {
    id: "perawatan-rutin",
    title: "Perawatan rutin",
    description:
      "Layanan yang biasanya dilakukan secara berkala, atau saat pemilik ingin memeriksakan hewannya.",
    services: ["pemeriksaan-umum", "vaksinasi", "grooming"],
  },
  {
    id: "tindakan",
    title: "Tindakan",
    description:
      "Layanan yang memerlukan penilaian dokter hewan lebih dulu sebelum dijadwalkan.",
    services: ["sterilisasi", "bedah"],
  },
  {
    id: "menginap",
    title: "Menginap di klinik",
    description: "Layanan yang mengharuskan hewan tinggal di klinik.",
    services: ["rawat-inap", "penitipan"],
  },
];

export default function LayananPage() {
  const groups = GROUPS.map((g) => ({
    ...g,
    items: activeServices.filter((s) => g.services.includes(s.id)),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <section className="u-container pt-12 lg:pt-16">
        <Reveal>
          <SectionHeader
            as="h1"
            eyebrow="Layanan"
            title="Layanan klinik hewan di Denpasar Barat"
            description="Berikut layanan yang tersedia di Klinik Hewan Kalimutu untuk anjing dan kucing. Setiap layanan dijelaskan singkat: apa yang dikerjakan dan kapan orang biasanya membutuhkannya. Untuk pertanyaan mengenai kondisi hewan Anda, hubungi klinik lebih dulu."
            cta={
              <>
                <TLink href="/janji-temu" className="u-btn u-btn--primary">
                  Buat janji temu
                </TLink>
                <WhatsAppLink
                  label="Tanya layanan dari halaman layanan"
                  className="u-btn u-btn--outline"
                >
                  Tanya lewat WhatsApp
                </WhatsAppLink>
              </>
            }
          />
        </Reveal>

        <EmergencyBlock className="mt-10" />
      </section>

      {groups.map((group, gi) => (
        <section
          key={group.id}
          aria-labelledby={`grup-${group.id}`}
          className="u-container py-12 lg:py-16"
        >
          <Reveal>
            <SectionHeader
              id={`grup-${group.id}`}
              eyebrow={`Kelompok ${gi + 1}`}
              title={group.title}
              description={group.description}
              cta={
                <TLink href="/janji-temu" className="u-btn u-btn--outline">
                  Pilih waktu kunjungan
                </TLink>
              }
            />
          </Reveal>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((service, i) => (
              <Reveal as="li" key={service.id} delay={i * 60}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </ul>
        </section>
      ))}

      {/* ---------------------------------------------------------------------
          Jenis hewan. Anjing dan kucing dipastikan; jenis lain belum, jadi
          ditampilkan sebagai pertanyaan, bukan klaim.
          ------------------------------------------------------------------ */}
      <section
        aria-labelledby="hewan-judul"
        className="border-y border-[var(--color-line)] bg-[var(--color-surface)]"
      >
        <div className="u-container py-14 lg:py-16">
          <Reveal>
            <SectionHeader
              id="hewan-judul"
              eyebrow="Jenis hewan"
              title="Hewan yang dilayani"
              description="Klinik melayani anjing dan kucing. Untuk jenis hewan lain, tanyakan lebih dulu agar Anda tidak datang tanpa kepastian."
              cta={
                <WhatsAppLink
                  label="Tanya jenis hewan dari halaman layanan"
                  intro="Halo, saya ingin menanyakan apakah Klinik Hewan Kalimutu menangani jenis hewan saya."
                  className="u-btn u-btn--primary"
                >
                  Tanyakan jenis hewan Anda
                </WhatsAppLink>
              }
            />
          </Reveal>

          <ul className="mt-8 flex flex-wrap gap-2.5">
            {animals.confirmed.map((a) => (
              <li
                key={a.id}
                className="rounded-[var(--radius-pill)] border border-[var(--color-accent)] bg-[var(--color-accent-soft)] px-4 py-2.5 text-[0.9375rem] font-semibold text-[var(--color-accent-ink)]"
              >
                {a.label}
              </li>
            ))}
            {animals.additional.map((a) => (
              <li
                key={a.id}
                className="rounded-[var(--radius-pill)] border border-[var(--color-accent)] bg-[var(--color-accent-soft)] px-4 py-2.5 text-[0.9375rem] font-semibold text-[var(--color-accent-ink)]"
              >
                {a.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          Tim. Nama, gelar, dan nomor registrasi tidak dicantumkan sampai
          dikonfirmasi klinik. Kartu tampil sebagai peran, ditandai jelas.
          ------------------------------------------------------------------ */}
      <section aria-labelledby="tim-judul" className="u-container py-14 lg:py-16">
        <Reveal>
          <SectionHeader
            id="tim-judul"
            eyebrow="Tim"
            title="Siapa yang menangani hewan Anda"
            description="Rincian tim klinik akan dilengkapi setelah dikonfirmasi. Untuk sekarang, hubungi klinik bila Anda ingin menanyakan hal ini lebih dulu."
            cta={
              <WhatsAppLink
                label="Tanya tim klinik"
                intro="Halo, saya ingin menanyakan mengenai dokter hewan yang bertugas di klinik."
                className="u-btn u-btn--outline"
              >
                Tanyakan lewat WhatsApp
              </WhatsAppLink>
            }
          />
        </Reveal>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => (
            <Reveal as="li" key={member.id} delay={i * 60}>
              <article className="u-card h-full p-5">
                <h3 className="u-h3 text-[var(--color-ink)]">{member.role}</h3>
                {member.name ? (
                  <p className="mt-2 text-[0.9375rem] text-[var(--color-ink-muted)]">
                    {member.name}
                    {member.credentials ? `, ${member.credentials}` : ""}
                  </p>
                ) : (
                  <p className="mt-3 inline-flex rounded-[var(--radius-pill)] border border-[var(--color-line-strong)] px-3 py-1.5 text-[0.8125rem] font-medium text-[var(--color-ink-subtle)]">
                    Nama belum dicantumkan
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </ul>

        {/*
          Fasilitas hanya ditampilkan yang sudah dikonfirmasi. Selama belum ada
          satu pun yang dikonfirmasi, tidak ada blok fasilitas sama sekali —
          bukan daftar kosong, bukan daftar berisi tebakan.
        */}
        {confirmedFacilities.length > 0 ? (
          <Reveal>
            <div className="mt-10 border-t border-[var(--color-line)] pt-8">
              <h3 className="u-h3 text-[var(--color-ink)]">Fasilitas</h3>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {confirmedFacilities.map((f) => (
                  <li
                    key={f.id}
                    className="rounded-[var(--radius-pill)] border border-[var(--color-line-strong)] px-4 py-2.5 text-[0.9375rem] text-[var(--color-ink-muted)]"
                  >
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ) : null}
      </section>
    </>
  );
}
