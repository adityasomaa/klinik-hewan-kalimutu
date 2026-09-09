/**
 * Pembentukan tautan WhatsApp.
 *
 * Semua tombol WhatsApp di situs memakai fungsi di sini lewat komponen
 * <WhatsAppLink>. Setiap pesan otomatis menyertakan URL halaman asal dan label
 * tombol yang ditekan, supaya klinik langsung tahu pengunjung datang dari mana.
 */

import { contact, site, allAnimals, services, symptoms } from "@/data/clinic";
import { formatIsoDateLong } from "@/lib/slots";
import { formatTime } from "@/lib/hours";
import type { AppointmentInput } from "@/lib/validation";

/** URL absolut dari sebuah path internal. */
export function absoluteUrl(path: string): string {
  const base = site.url.replace(/\/$/, "");
  if (!path || path === "/") return base + "/";
  return base + (path.startsWith("/") ? path : "/" + path);
}

export function whatsappHref(message: string, phone: string = contact.whatsapp): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Pesan umum untuk tombol WhatsApp biasa.
 *
 * @param label      Label tombol yang ditekan, mis. "Tanya lewat WhatsApp".
 * @param sourcePath Path halaman asal.
 * @param intro      Kalimat pembuka khusus, kalau ada.
 */
export function generalMessage(
  label: string,
  sourcePath: string,
  intro?: string
): string {
  const lines = [
    intro ?? "Halo, saya ingin bertanya mengenai layanan Klinik Hewan Kalimutu.",
    "",
    `Tombol: ${label}`,
    `Halaman: ${absoluteUrl(sourcePath)}`,
  ];
  return lines.join("\n");
}

/** Pesan untuk pertanyaan tentang jenis hewan yang ditangani. */
export function animalQuestionMessage(sourcePath: string): string {
  return generalMessage(
    "Tanya jenis hewan",
    sourcePath,
    "Halo, saya ingin menanyakan apakah Klinik Hewan Kalimutu menangani jenis hewan saya."
  );
}

/** Pesan untuk pertanyaan tentang satu layanan tertentu. */
export function serviceMessage(serviceName: string, sourcePath: string): string {
  return generalMessage(
    `Tanya layanan: ${serviceName}`,
    sourcePath,
    `Halo, saya ingin menanyakan layanan ${serviceName} di Klinik Hewan Kalimutu.`
  );
}

/**
 * Pesan janji temu — dirapikan per baris supaya klinik langsung paham tanpa
 * perlu bertanya ulang. Memuat seluruh isian form dan URL halaman asal.
 */
export function appointmentMessage(input: AppointmentInput): string {
  const animal = allAnimals.find((a) => a.id === input.animalType);
  const service = services.find((s) => s.id === input.serviceId);
  const chosen = symptoms
    .filter((s) => input.symptomIds.includes(s.id))
    .map((s) => s.label);

  const lines: string[] = [
    "Permintaan janji temu — Klinik Hewan Kalimutu",
    "",
    `Nama pemilik: ${input.ownerName}`,
    `Nomor WhatsApp: ${input.ownerPhone}`,
    "",
    `Jenis hewan: ${animal?.label ?? input.animalType}`,
    `Nama hewan: ${input.petName}`,
    `Perkiraan umur: ${input.petAge}`,
    "",
    `Jenis layanan: ${service?.name ?? input.serviceId}`,
    `Tanggal: ${formatIsoDateLong(input.date)}`,
    `Waktu: ${formatTime(input.time)} WITA`,
    "",
    `Gejala yang dicentang: ${chosen.length ? chosen.join(", ") : "tidak ada"}`,
    `Keterangan tambahan: ${input.complaint || "tidak ada"}`,
    "",
    `Dikirim dari: ${absoluteUrl(input.sourcePath)}`,
  ];

  return lines.join("\n");
}
