"use client";

/**
 * Banner persetujuan cookie.
 *
 * Dua hal yang dijaga di sini:
 *   1. Tidak pernah muncul di atas menu mobile maupun di atas tirai loader.
 *      Skala z-index memang menaruh banner di atas keduanya, jadi yang dilakukan
 *      bukan menurunkan z-index-nya, melainkan menyembunyikan banner selama ada
 *      overlay terbuka atau selama tirai transisi sedang bergerak.
 *   2. Tidak menelan klik tombol melayang. Selama banner tampil, elemen <html>
 *      diberi data-cookie-open dan tombol melayang naik ke atas banner.
 *
 * Pilihannya benar-benar berpengaruh — lihat src/lib/consent.ts.
 */

import { useEffect, useState } from "react";
import { TLink } from "@/components/Transition";
import { readConsent, writeConsent } from "@/lib/consent";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(true);

  useEffect(() => {
    // Diputuskan di browser supaya tidak ada ketidakcocokan hidrasi.
    if (!readConsent()) setShow(true);
  }, []);

  /* Sembunyikan selama menu mobile, kalender, atau modal terbuka, dan selama
     tirai loader atau transisi halaman sedang menutupi layar. */
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      setOverlayOpen(root.hasAttribute("data-overlay-open"));
      // Atribut ini dipasang TransitionProvider. Banner hanya boleh tampil
      // setelah tirai benar-benar selesai dan halaman dalam keadaan tenang.
      setTransitioning((root.dataset.transition ?? "intro") !== "idle");
    };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, {
      attributes: true,
      attributeFilter: ["data-overlay-open", "data-transition"],
    });
    return () => mo.disconnect();
  }, []);

  /* Beri tahu tombol melayang supaya naik dan tidak tertutup banner. */
  useEffect(() => {
    const visible = show && !overlayOpen && !transitioning;
    if (visible) document.documentElement.setAttribute("data-cookie-open", "");
    else document.documentElement.removeAttribute("data-cookie-open");
    return () => document.documentElement.removeAttribute("data-cookie-open");
  }, [show, overlayOpen, transitioning]);

  if (!show || overlayOpen || transitioning) return null;

  const decide = (preferences: boolean) => {
    writeConsent(preferences);
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-judul"
      aria-describedby="cookie-teks"
      className="fixed inset-x-0 bottom-0 border-t border-[var(--color-line)] bg-[var(--color-surface)] shadow-[0_-8px_28px_-16px_rgba(17,30,26,0.3)]"
      style={{ zIndex: "var(--z-cookie)" }}
    >
      <div className="u-container py-4 sm:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[62ch]">
            <h2
              id="cookie-judul"
              className="text-[0.9375rem] font-semibold text-[var(--color-ink)]"
            >
              Penyimpanan di perangkat Anda
            </h2>
            <p
              id="cookie-teks"
              className="mt-1.5 text-[0.875rem] leading-relaxed text-[var(--color-ink-muted)]"
            >
              Situs ini menyimpan sedikit data di peramban Anda agar alur janji
              temu dapat berjalan. Anda dapat memilih apakah draf isian formulir
              ikut disimpan. Tidak ada data yang dikirim ke pihak ketiga.{" "}
              <TLink
                href="/kebijakan-privasi"
                className="text-[var(--color-accent)] underline underline-offset-4"
              >
                Kebijakan Privasi
              </TLink>
            </p>

            {expanded ? (
              <dl className="mt-4 grid gap-3 text-[0.8125rem] sm:grid-cols-2">
                <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-bg)] p-3.5">
                  <dt className="font-semibold text-[var(--color-ink)]">
                    Diperlukan · selalu aktif
                  </dt>
                  <dd className="mt-1 leading-relaxed text-[var(--color-ink-muted)]">
                    Menyimpan janji temu yang Anda buat di perangkat ini sehingga
                    alur pemesanan dapat diselesaikan.
                  </dd>
                </div>
                <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-bg)] p-3.5">
                  <dt className="font-semibold text-[var(--color-ink)]">
                    Preferensi · opsional
                  </dt>
                  <dd className="mt-1 leading-relaxed text-[var(--color-ink-muted)]">
                    Menyimpan draf isian formulir janji temu. Jika ditolak, isian
                    yang belum dikirim tidak disimpan dan akan hilang saat halaman
                    ditutup.
                  </dd>
                </div>
              </dl>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="u-btn u-btn--ghost h-11 min-h-0"
              aria-expanded={expanded}
            >
              {expanded ? "Sembunyikan rincian" : "Lihat rincian"}
            </button>
            <button
              type="button"
              onClick={() => decide(false)}
              className="u-btn u-btn--outline h-11 min-h-0"
            >
              Hanya yang diperlukan
            </button>
            <button
              type="button"
              onClick={() => decide(true)}
              className="u-btn u-btn--primary h-11 min-h-0"
            >
              Izinkan semua
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
