"use client";

/**
 * Pemilih tanggal custom.
 *
 * Kenapa tidak <input type="date"> bawaan: tampilannya berbeda-beda di tiap
 * peramban, tidak bisa menandai tanggal yang kliniknya tutup, dan di beberapa
 * peramban desktop kalendernya hanya terbuka lewat ikon kecil di ujung kanan.
 *
 * Yang dijaga di sini:
 *   - Kalender terbuka saat field diklik DI MANA PUN, bukan hanya di ikonnya.
 *   - Tanggal lampau ditolak, begitu juga tanggal di luar jangkauan config.
 *   - Dirender lewat PORTAL ke <body> supaya tidak pernah terpotong oleh
 *     induk yang memakai overflow-hidden.
 *   - Menandai dirinya sebagai overlay supaya Lenis berhenti selama terbuka.
 */

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { booking } from "@/data/clinic";
import {
  MONTH,
  addDaysIso,
  dayIndexOf,
  formatIsoDateLong,
  isSelectableDate,
  todayIso,
} from "@/lib/slots";
import { pushOverlay, popOverlay } from "@/lib/overlay";

const DAY_HEAD = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

type Props = {
  label: string;
  value: string;
  onChange: (iso: string) => void;
  description?: string;
  error?: string;
  required?: boolean;
};

export function DatePicker({
  label,
  value,
  onChange,
  description,
  error,
  required,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cursor, setCursor] = useState(() => value || todayIso());
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(
    null
  );

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const baseId = useId();
  const descId = description ? `${baseId}-desc` : undefined;
  const errId = error ? `${baseId}-err` : undefined;

  const today = todayIso();
  const lastDate = addDaysIso(today, booking.maxAdvanceDays);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (value) setCursor(value);
  }, [value]);

  /* Posisi panel dihitung dari posisi trigger di layar, karena panel berada di
     <body> dan tidak lagi mengikuti aliran layout form. */
  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.max(r.width, 320);
    const panelH = 400;
    const below = window.innerHeight - r.bottom;
    const top = below < panelH && r.top > panelH ? r.top - panelH - 8 : r.bottom + 8;
    // Jaga panel tetap di dalam layar pada lebar kecil.
    const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
    setRect({ top, left, width });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  /* Tandai overlay + tutup lewat Escape atau klik di luar. */
  useEffect(() => {
    if (!open) return;
    pushOverlay();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    panelRef.current?.focus();

    return () => {
      popOverlay();
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const [cy, cm] = cursor.split("-").map(Number);

  const shiftMonth = (delta: number) => {
    const d = new Date(Date.UTC(cy, cm - 1 + delta, 1));
    setCursor(d.toISOString().slice(0, 10));
  };

  const monthStart = `${cy}-${String(cm).padStart(2, "0")}-01`;
  const daysInMonth = new Date(Date.UTC(cy, cm, 0)).getUTCDate();
  const leading = dayIndexOf(monthStart);

  const canGoBack = `${cy}-${String(cm).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}` > today;
  const canGoForward = monthStart < lastDate.slice(0, 8) + "01";

  const cells: (string | null)[] = [
    ...Array<null>(leading).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      `${cy}-${String(cm).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`
    ),
  ];

  const pick = (iso: string) => {
    onChange(iso);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const panel =
    open && rect && mounted
      ? createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-label={`Pilih ${label.toLowerCase()}`}
            tabIndex={-1}
            className="fixed rounded-[var(--radius-card)] border border-[var(--color-line-strong)] bg-[var(--color-surface)] p-4 shadow-[0_20px_50px_-18px_rgba(17,30,26,0.42)] focus:outline-none"
            style={{
              zIndex: "var(--z-overlay)",
              top: rect.top,
              left: rect.left,
              width: rect.width,
            }}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                disabled={!canGoBack}
                className="u-btn u-btn--ghost size-10 min-h-0 px-0 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="u-sr-only">Bulan sebelumnya</span>
                <Chevron dir="left" />
              </button>

              <p aria-live="polite" className="text-[0.9375rem] font-semibold text-[var(--color-ink)]">
                {MONTH[cm - 1]} {cy}
              </p>

              <button
                type="button"
                onClick={() => shiftMonth(1)}
                disabled={!canGoForward}
                className="u-btn u-btn--ghost size-10 min-h-0 px-0 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="u-sr-only">Bulan berikutnya</span>
                <Chevron dir="right" />
              </button>
            </div>

            <div
              role="grid"
              aria-label={`${MONTH[cm - 1]} ${cy}`}
              className="grid grid-cols-7 gap-1"
            >
              {DAY_HEAD.map((d) => (
                <div
                  key={d}
                  role="columnheader"
                  className="pb-1 text-center text-[0.75rem] font-semibold text-[var(--color-ink-subtle)]"
                >
                  {d}
                </div>
              ))}

              {cells.map((iso, i) => {
                if (!iso) return <div key={`e-${i}`} aria-hidden="true" />;
                const selectable = isSelectableDate(iso);
                const isSelected = iso === value;
                const isToday = iso === today;
                const day = Number(iso.slice(8));

                return (
                  <button
                    key={iso}
                    type="button"
                    role="gridcell"
                    disabled={!selectable}
                    aria-selected={isSelected}
                    aria-label={
                      formatIsoDateLong(iso) + (selectable ? "" : " — tidak tersedia")
                    }
                    onClick={() => pick(iso)}
                    className={
                      "flex h-10 items-center justify-center rounded-[10px] text-[0.875rem] font-medium transition-colors " +
                      (isSelected
                        ? "bg-[var(--color-accent)] text-white"
                        : !selectable
                          ? "cursor-not-allowed text-[var(--color-ink-subtle)] line-through opacity-45"
                          : isToday
                            ? "border border-[var(--color-accent)] text-[var(--color-accent-ink)] hover:bg-[var(--color-accent-soft)]"
                            : "text-[var(--color-ink)] hover:bg-[var(--color-sunken)]")
                    }
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 border-t border-[var(--color-line)] pt-3 text-[0.75rem] leading-relaxed text-[var(--color-ink-subtle)]">
              Tanggal yang dicoret tidak tersedia. Pemesanan dapat dilakukan hingga{" "}
              {booking.maxAdvanceDays} hari ke depan.
            </p>
          </div>,
          document.body
        )
      : null;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[0.9375rem] font-semibold text-[var(--color-ink)]">
        {label}
        {required ? (
          <span className="text-[var(--color-urgent)]" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </span>

      {description ? (
        <p id={descId} className="text-[0.8125rem] leading-relaxed text-[var(--color-ink-subtle)]">
          {description}
        </p>
      ) : null}

      {/* Seluruh permukaan field ini yang membuka kalender, bukan ikonnya saja. */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-describedby={[descId, errId].filter(Boolean).join(" ") || undefined}
        aria-invalid={error ? true : undefined}
        className={
          "flex min-h-[3.25rem] w-full items-center justify-between gap-3 rounded-[var(--radius-card)] border bg-[var(--color-surface)] px-4 py-2.5 text-left text-[0.9375rem] transition-colors " +
          (error
            ? "border-[var(--color-urgent)]"
            : "border-[var(--color-line-strong)] hover:border-[var(--color-accent)]")
        }
      >
        <span className={value ? "text-[var(--color-ink)]" : "text-[var(--color-ink-subtle)]"}>
          {value ? formatIsoDateLong(value) : "Pilih tanggal"}
        </span>
        <CalendarIcon />
      </button>

      {error ? (
        <p id={errId} role="alert" className="text-[0.8125rem] font-medium text-[var(--color-urgent)]">
          {error}
        </p>
      ) : null}

      {panel}
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px] shrink-0 text-[var(--color-ink-muted)]"
      fill="none"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
