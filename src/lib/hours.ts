/**
 * Perhitungan status buka/tutup.
 *
 * Dua aturan yang dipegang file ini:
 *
 *  1. Status SELALU dihitung dari waktu nyata (Date.now) di zona waktu klinik,
 *     bukan dari akumulasi frame atau penghitung interval. Kalau tab ditinggal
 *     berjam-jam lalu dibuka lagi, hasilnya tetap benar begitu dihitung ulang.
 *
 *  2. Kalau jam operasional di config belum diisi sama sekali, fungsi ini
 *     mengembalikan status "unknown" dan komponen indikator menyembunyikan
 *     dirinya sepenuhnya. Tidak pernah menebak.
 */

import {
  openingHours,
  timeZone,
  weekdayLabel,
  weekdayOrder,
  type DayHours,
  type Weekday,
} from "@/data/clinic";

export type OpenState =
  | { status: "unknown" }
  | { status: "open"; closesAt: string }
  | { status: "closed"; nextOpenDay: Weekday; nextOpenAt: string; isToday: boolean };

/** Menit sejak tengah malam dari string "HH:MM". */
export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function fromMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Format tampilan Indonesia: "09.00". */
export function formatTime(hhmm: string): string {
  return hhmm.replace(":", ".");
}

/**
 * Ambil hari dan menit-dalam-hari di zona waktu klinik dari sebuah Date.
 * Memakai Intl supaya benar meski perangkat pengunjung di zona waktu lain.
 */
export function clinicNow(now: Date = new Date()): {
  dayIndex: number;
  minutes: number;
  isoDate: string;
} {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = Object.fromEntries(
    fmt.formatToParts(now).map((p) => [p.type, p.value])
  ) as Record<string, string>;

  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  const hour = parts.hour === "24" ? 0 : Number(parts.hour);

  return {
    dayIndex: dayMap[parts.weekday] ?? 0,
    minutes: hour * 60 + Number(parts.minute),
    isoDate: `${parts.year}-${parts.month}-${parts.day}`,
  };
}

/** Apakah ada minimal satu hari yang jam bukanya sudah diisi. */
export function hoursAreConfigured(
  hours: Record<Weekday, DayHours> = openingHours
): boolean {
  return Object.values(hours).some((h) => h !== null);
}

/**
 * Hitung status buka/tutup.
 *
 * @param now  Waktu acuan. Bisa disuntik untuk pengujian — inilah cara
 *             memverifikasi ketiga kondisi tanpa mengubah jam sistem.
 */
export function getOpenState(
  now: Date = new Date(),
  hours: Record<Weekday, DayHours> = openingHours
): OpenState {
  if (!hoursAreConfigured(hours)) return { status: "unknown" };

  const { dayIndex, minutes } = clinicNow(now);
  const todayKey = weekdayOrder[dayIndex];
  const today = hours[todayKey];

  if (today) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    if (minutes >= open && minutes < close) {
      return { status: "open", closesAt: today.close };
    }
    // Masih sebelum jam buka hari ini.
    if (minutes < open) {
      return {
        status: "closed",
        nextOpenDay: todayKey,
        nextOpenAt: today.open,
        isToday: true,
      };
    }
  }

  // Cari hari buka berikutnya, maksimal tujuh hari ke depan.
  for (let step = 1; step <= 7; step++) {
    const key = weekdayOrder[(dayIndex + step) % 7];
    const h = hours[key];
    if (h) {
      return {
        status: "closed",
        nextOpenDay: key,
        nextOpenAt: h.open,
        isToday: false,
      };
    }
  }

  return { status: "unknown" };
}

/**
 * Kalimat lengkap untuk indikator. Selalu menyertakan label teks, tidak pernah
 * mengandalkan warna saja untuk membedakan buka dan tutup.
 */
export function describeOpenState(state: OpenState): string | null {
  if (state.status === "unknown") return null;
  if (state.status === "open") {
    return `Buka sekarang · tutup pukul ${formatTime(state.closesAt)}`;
  }
  if (state.isToday) {
    return `Tutup · buka lagi hari ini pukul ${formatTime(state.nextOpenAt)}`;
  }
  return `Tutup · buka lagi ${weekdayLabel[state.nextOpenDay]} pukul ${formatTime(
    state.nextOpenAt
  )}`;
}

/** Daftar jam per hari untuk halaman lokasi dan kontak. */
export function weeklyHours(): { day: Weekday; label: string; value: string | null }[] {
  return weekdayOrder.map((day) => ({
    day,
    label: weekdayLabel[day],
    value: openingHours[day]
      ? `${formatTime(openingHours[day]!.open)} – ${formatTime(openingHours[day]!.close)}`
      : null,
  }));
}
