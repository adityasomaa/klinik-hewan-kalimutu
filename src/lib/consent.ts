/**
 * Persetujuan cookie — dan ini benar-benar menggerakkan sesuatu.
 *
 * Situs ini tidak memakai analytics dan tidak memuat script pihak ketiga,
 * jadi tidak ada gunanya berpura-pura ada belasan kategori. Yang ada dua:
 *
 *   essential   Selalu aktif. Data janji temu demo yang membuat alur booking
 *               bisa dijalankan sampai selesai. Tanpa ini fiturnya tidak jalan.
 *
 *   preferensi  Opsional, dan EFEKNYA NYATA: kalau ditolak, situs tidak
 *               menyimpan draf isian form janji temu. Isian yang belum
 *               dikirim akan hilang saat halaman ditutup. Kalau diizinkan,
 *               draf disimpan supaya orang tidak perlu mengetik ulang.
 *
 * Tidak ada data yang dikirim ke mana pun dari lapisan ini.
 */

export type Consent = {
  essential: true;
  preferences: boolean;
  decidedAt: string;
};

const KEY = "kalimutu.consent.v1";
export const CONSENT_EVENT = "kalimutu:consent";

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Consent>;
    if (typeof parsed?.preferences !== "boolean") return null;
    return {
      essential: true,
      preferences: parsed.preferences,
      decidedAt: parsed.decidedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function writeConsent(preferences: boolean): void {
  if (typeof window === "undefined") return;
  const value: Consent = {
    essential: true,
    preferences,
    decidedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* mode privat — persetujuan hanya berlaku untuk sesi ini */
  }
  // Kalau preferensi dicabut, draf yang sudah tersimpan langsung dibuang.
  if (!preferences) clearPreferenceData();
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT));
}

export function clearConsent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* abaikan */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT));
}

/** Apakah boleh menyimpan data preferensi (draf form). */
export function mayStorePreferences(): boolean {
  return readConsent()?.preferences === true;
}

const DRAFT_KEY = "kalimutu.draft.v1";

export function clearPreferenceData(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* abaikan */
  }
}

/** Simpan draf form — hanya kalau pengunjung mengizinkan preferensi. */
export function saveDraft(data: unknown): void {
  if (typeof window === "undefined") return;
  if (!mayStorePreferences()) return;
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    /* abaikan */
  }
}

export function readDraft<T>(): T | null {
  if (typeof window === "undefined") return null;
  if (!mayStorePreferences()) return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
