/**
 * Skema dan validasi janji temu.
 *
 * Dipakai DI DUA SISI: komponen form di browser dan route handler di server.
 * Satu sumber aturan supaya validasi client dan server tidak pernah berbeda.
 * Validasi di client hanya untuk kenyamanan; server tetap memvalidasi ulang
 * semuanya dan tidak mempercayai apa pun yang dikirim browser.
 */

import { allAnimals, booking, services, symptoms } from "@/data/clinic";
import { isSelectableDate, slotsForDate } from "@/lib/slots";

export type AppointmentInput = {
  ownerName: string;
  ownerPhone: string;
  animalType: string;
  petName: string;
  petAge: string;
  serviceId: string;
  symptomIds: string[];
  complaint: string;
  date: string;
  time: string;
  /** Halaman asal, ikut dikirim ke WhatsApp. */
  sourcePath: string;
  /** Umpan bot. Harus kosong. */
  website?: string;
};

export type FieldErrors = Partial<Record<keyof AppointmentInput, string>>;

const NAME_RE = /^[\p{L}\p{M}\s.'-]{2,60}$/u;
/** Nomor Indonesia: 08xx, +628xx, atau 628xx. */
const PHONE_RE = /^(?:\+?62|0)8[1-9][0-9]{6,11}$/;

function clean(v: unknown): string {
  return typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "";
}

/** Ubah nomor apa pun ke bentuk 62xxxxxxxxx. */
export function normalisePhone(raw: string): string {
  const digits = clean(raw).replace(/[^\d+]/g, "");
  if (digits.startsWith("+62")) return digits.slice(1);
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  return digits;
}

/**
 * Validasi lengkap. `taken` dan `blocked` diisi pemanggil supaya fungsi ini
 * tetap murni dan bisa dipakai di server maupun browser.
 */
export function validateAppointment(
  raw: Partial<AppointmentInput>,
  opts: { taken?: string[]; blocked?: string[]; now?: Date } = {}
): { ok: true; value: AppointmentInput } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const now = opts.now ?? new Date();

  // Umpan bot: kalau terisi, tolak tanpa menjelaskan alasannya.
  if (clean(raw.website)) {
    return { ok: false, errors: { ownerName: "Pengiriman ditolak." } };
  }

  const ownerName = clean(raw.ownerName);
  if (!ownerName) errors.ownerName = "Nama pemilik wajib diisi.";
  else if (!NAME_RE.test(ownerName))
    errors.ownerName = "Nama hanya boleh berisi huruf, spasi, titik, dan tanda hubung.";

  const ownerPhoneRaw = clean(raw.ownerPhone);
  if (!ownerPhoneRaw) errors.ownerPhone = "Nomor WhatsApp wajib diisi.";
  else if (!PHONE_RE.test(ownerPhoneRaw.replace(/[\s-]/g, "")))
    errors.ownerPhone = "Masukkan nomor WhatsApp Indonesia yang valid, contoh 0812xxxxxxx.";

  const animalType = clean(raw.animalType);
  const animal = allAnimals.find((a) => a.id === animalType);
  if (!animalType) errors.animalType = "Pilih jenis hewan.";
  else if (!animal) errors.animalType = "Jenis hewan tidak dikenali.";

  const petName = clean(raw.petName);
  if (!petName) errors.petName = "Nama hewan wajib diisi.";
  else if (petName.length > 40) errors.petName = "Nama hewan terlalu panjang.";

  const petAge = clean(raw.petAge);
  if (!petAge) errors.petAge = "Perkiraan umur wajib diisi.";
  else if (petAge.length > 30) errors.petAge = "Perkiraan umur terlalu panjang.";

  const serviceId = clean(raw.serviceId);
  const service = services.find((s) => s.id === serviceId && s.enabled);
  if (!serviceId) errors.serviceId = "Pilih jenis layanan.";
  else if (!service) errors.serviceId = "Layanan tidak tersedia.";
  else if (animal && !service.animals.includes(animal.id))
    errors.serviceId = "Layanan ini tidak berlaku untuk jenis hewan yang dipilih.";

  const symptomIds = Array.isArray(raw.symptomIds)
    ? raw.symptomIds.filter((id) => symptoms.some((s) => s.id === id))
    : [];

  const complaint = clean(raw.complaint);
  if (complaint.length > 600) errors.complaint = "Keterangan maksimal 600 karakter.";

  const date = clean(raw.date);
  if (!date) errors.date = "Pilih tanggal.";
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.date = "Format tanggal tidak valid.";
  else if (!isSelectableDate(date, now))
    errors.date = "Tanggal tidak tersedia. Pilih tanggal lain.";

  const time = clean(raw.time);
  if (!time) errors.time = "Pilih waktu.";
  else if (!errors.date) {
    const slot = slotsForDate(date, opts.taken ?? [], opts.blocked ?? [], now).find(
      (s) => s.time === time
    );
    if (!slot) errors.time = "Waktu tidak dikenali.";
    else if (slot.state !== "available")
      errors.time =
        slot.state === "past"
          ? "Waktu itu sudah lewat. Pilih waktu lain."
          : "Waktu itu sudah terisi. Pilih waktu lain.";
  }

  let sourcePath = clean(raw.sourcePath) || "/";
  // Hanya menerima path internal — jangan pernah meneruskan URL luar.
  if (!sourcePath.startsWith("/") || sourcePath.startsWith("//")) sourcePath = "/";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      ownerName,
      ownerPhone: normalisePhone(ownerPhoneRaw),
      animalType,
      petName,
      petAge,
      serviceId,
      symptomIds,
      complaint,
      date,
      time,
      sourcePath,
    },
  };
}

export const bookingLimits = {
  minLeadMinutes: booking.minLeadMinutes,
  maxAdvanceDays: booking.maxAdvanceDays,
  slotMinutes: booking.slotMinutes,
};
