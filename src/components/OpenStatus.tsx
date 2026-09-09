"use client";

/**
 * Indikator buka / tutup.
 *
 * Dihitung dari WAKTU NYATA perangkat pengunjung, dikonversi ke zona waktu
 * klinik — bukan dari akumulasi frame. Tab yang ditinggal berjam-jam lalu
 * dibuka lagi akan langsung menunjukkan status yang benar.
 *
 * Kalau jam operasional di config belum diisi, komponen ini TIDAK menampilkan
 * apa pun. Lebih baik tidak ada indikator daripada indikator yang salah.
 *
 * Status tidak pernah dibedakan lewat warna saja — selalu ada label teksnya.
 */

import { useEffect, useState } from "react";
import { describeOpenState, getOpenState, type OpenState } from "@/lib/hours";

declare global {
  interface Window {
    /**
     * Titik suntik waktu palsu untuk verifikasi, mis. dari konsol browser:
     *   window.__KALIMUTU_NOW__ = "2026-09-08T03:00:00Z";
     *   window.dispatchEvent(new Event("kalimutu:time"));
     * Hanya dibaca di browser, tidak memengaruhi apa pun di server.
     */
    __KALIMUTU_NOW__?: string;
  }
}

function readNow(): Date {
  if (typeof window !== "undefined" && window.__KALIMUTU_NOW__) {
    const d = new Date(window.__KALIMUTU_NOW__);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

export function useOpenState(): OpenState | null {
  // null = belum dihitung di browser. Dibiarkan null saat render server supaya
  // tidak ada ketidakcocokan hidrasi.
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const tick = () => setState(getOpenState(readNow()));
    tick();

    // Dihitung ulang berkala DAN setiap kali tab kembali terlihat, supaya
    // statusnya tetap benar walau tab lama ditinggalkan.
    const id = window.setInterval(tick, 30_000);
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("focus", tick);
    window.addEventListener("kalimutu:time", tick);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("focus", tick);
      window.removeEventListener("kalimutu:time", tick);
    };
  }, []);

  return state;
}

export function OpenStatus({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const state = useOpenState();

  // Belum dihitung, atau jam operasional belum diisi -> tidak menampilkan apa pun.
  if (!state || state.status === "unknown") return null;

  const text = describeOpenState(state);
  if (!text) return null;

  const isOpen = state.status === "open";

  return (
    <p
      data-open={isOpen ? "true" : "false"}
      data-testid="open-status"
      className={
        "inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-3.5 py-2 text-[0.8125rem] font-semibold " +
        (isOpen
          ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent-ink)]"
          : tone === "dark"
            ? "border-[var(--color-line-strong)] bg-[var(--color-sunken)] text-[var(--color-ink)]"
            : "border-[var(--color-line-strong)] bg-[var(--color-surface)] text-[var(--color-ink)]") +
        " " +
        className
      }
    >
      {/* Titik hanya penegas. Maknanya dibawa oleh teks, bukan warnanya. */}
      <span
        aria-hidden="true"
        className={
          "size-2 shrink-0 rounded-full " +
          (isOpen ? "bg-[var(--color-accent)]" : "bg-[var(--color-line-strong)]")
        }
      />
      {text}
    </p>
  );
}
