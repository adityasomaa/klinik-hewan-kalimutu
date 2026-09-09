/**
 * Pembentukan slot waktu janji temu.
 *
 * Slot dihitung dari jam operasional di config. Kalau jam operasional belum
 * diisi, dipakai `booking.fallbackSlotWindow` supaya form tetap bisa dipakai —
 * dan form menyebutkan dengan jelas bahwa jamnya akan dikonfirmasi ulang klinik.
 * Jendela cadangan ini TIDAK PERNAH ditampilkan sebagai klaim jam buka.
 *
 * Slot yang sudah lewat dihitung dari waktu nyata di zona waktu klinik,
 * termasuk jam yang sudah lewat pada hari ini.
 */

import { booking, openingHours, weekdayOrder } from "@/data/clinic";
import { clinicNow, hoursAreConfigured, toMinutes, fromMinutes } from "@/lib/hours";

export type SlotState = "available" | "past" | "booked" | "blocked";

export type Slot = {
  /** "HH:MM" dalam waktu klinik. */
  time: string;
  state: SlotState;
  /** Label teks yang menyertai status — jangan mengandalkan warna saja. */
  label: string;
};

/** "YYYY-MM-DD" -> indeks hari (0 = Minggu), stabil lintas zona waktu. */
export function dayIndexOf(isoDate: string): number {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function todayIso(now: Date = new Date()): string {
  return clinicNow(now).isoDate;
}

export function addDaysIso(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

/** Rentang jam yang dipakai untuk membentuk slot pada tanggal tertentu. */
export function windowForDate(isoDate: string): { open: string; close: string } | null {
  if (!hoursAreConfigured()) return booking.fallbackSlotWindow;
  const key = weekdayOrder[dayIndexOf(isoDate)];
  return openingHours[key];
}

/** Apakah tanggal ini boleh dipilih sama sekali. */
export function isSelectableDate(isoDate: string, now: Date = new Date()): boolean {
  const today = todayIso(now);
  if (isoDate < today) return false;
  if (isoDate > addDaysIso(today, booking.maxAdvanceDays)) return false;
  return windowForDate(isoDate) !== null;
}

/**
 * Bentuk seluruh slot untuk satu tanggal, lengkap dengan statusnya.
 *
 * @param takenTimes   Slot yang sudah dipesan.
 * @param blockedTimes Slot yang diblokir manual dari halaman admin.
 */
export function slotsForDate(
  isoDate: string,
  takenTimes: string[] = [],
  blockedTimes: string[] = [],
  now: Date = new Date()
): Slot[] {
  const win = windowForDate(isoDate);
  if (!win) return [];

  const start = toMinutes(win.open);
  const end = toMinutes(win.close);
  const step = booking.slotMinutes;

  const { isoDate: nowIso, minutes: nowMinutes } = clinicNow(now);
  const earliest = nowMinutes + booking.minLeadMinutes;

  const out: Slot[] = [];
  for (let m = start; m + step <= end; m += step) {
    const time = fromMinutes(m);

    let state: SlotState = "available";
    if (isoDate < nowIso) state = "past";
    else if (isoDate === nowIso && m < earliest) state = "past";
    else if (blockedTimes.includes(time)) state = "blocked";
    else if (takenTimes.includes(time)) state = "booked";

    const label =
      state === "available"
        ? "Tersedia"
        : state === "past"
          ? "Sudah lewat"
          : state === "booked"
            ? "Penuh"
            : "Tidak tersedia";

    out.push({ time, state, label });
  }
  return out;
}

/** Tanggal paling awal yang boleh dipilih, dengan menghormati jarak minimal. */
export function earliestSelectableDate(now: Date = new Date()): string {
  let iso = todayIso(now);
  for (let i = 0; i <= booking.maxAdvanceDays; i++) {
    const candidate = addDaysIso(iso, i);
    if (!isSelectableDate(candidate, now)) continue;
    const hasFree = slotsForDate(candidate, [], [], now).some(
      (s) => s.state === "available"
    );
    if (hasFree) return candidate;
  }
  return iso;
}

const DAY_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTH = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/** "2026-09-08" -> "Selasa, 8 September 2026" */
export function formatIsoDateLong(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const full = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  return `${full[dayIndexOf(isoDate)]}, ${d} ${MONTH[m - 1]} ${y}`;
}

/** "2026-09-08" -> "Sel, 8 Sep" */
export function formatIsoDateShort(isoDate: string): string {
  const [, m, d] = isoDate.split("-").map(Number);
  return `${DAY_SHORT[dayIndexOf(isoDate)]}, ${d} ${MONTH[m - 1].slice(0, 3)}`;
}

export { MONTH, DAY_SHORT };
