"use client";

/**
 * Papan admin — DEMO.
 *
 * Yang bisa dilakukan di sini:
 *   - melihat janji temu per tanggal
 *   - mengubah status: menunggu, ditangani, selesai
 *   - memblokir slot secara manual (hari libur, dokter berhalangan)
 *   - mengembalikan seluruh data demo ke kondisi awal
 *
 * Catatan penting soal tabel:
 *   Tabel janji temu adalah sumber overflow horizontal paling sering di
 *   halaman seperti ini. Karena itu tabelnya dibungkus wadah yang menggulir
 *   sendiri, bukan dibiarkan mendorong lebar halaman.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  allAnimals,
  services,
  symptoms as allSymptoms,
} from "@/data/clinic";
import { DatePicker } from "@/components/DatePicker";
import { formatTime } from "@/lib/hours";
import { formatIsoDateLong, slotsForDate, todayIso } from "@/lib/slots";
import {
  store,
  STORE_EVENT,
  type Appointment,
  type AppointmentStatus,
} from "@/lib/store";

const STATUSES: AppointmentStatus[] = ["menunggu", "ditangani", "selesai"];

export function AdminBoard() {
  const [date, setDate] = useState(() => todayIso());
  const [rows, setRows] = useState<Appointment[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [confirmReset, setConfirmReset] = useState(false);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const [appts, blocks] = await Promise.all([
      store.listByDate(date),
      store.listBlocked(),
    ]);
    setRows(appts);
    setBlocked(blocks.filter((b) => b.date === date).map((b) => b.time));
    setReady(true);
  }, [date]);

  useEffect(() => {
    refresh();
    window.addEventListener(STORE_EVENT, refresh);
    return () => window.removeEventListener(STORE_EVENT, refresh);
  }, [refresh]);

  const slots = useMemo(
    () => slotsForDate(date, rows.map((r) => r.time), blocked),
    [date, rows, blocked]
  );

  const label = (list: { id: string; label?: string; name?: string }[], id: string) =>
    list.find((x) => x.id === id)?.label ?? list.find((x) => x.id === id)?.name ?? id;

  return (
    <section className="u-container py-10 lg:py-14">
      {/* Penanda demo yang tidak bisa dilewatkan. */}
      <div className="rounded-[var(--radius-card)] border-2 border-dashed border-[var(--color-line-strong)] bg-[var(--color-sunken)] p-5">
        <h1 className="u-h3 text-[var(--color-ink)]">Papan admin — demo</h1>
        <p className="mt-2 max-w-[70ch] text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
          Halaman ini adalah demo dan belum terhubung ke basis data. Semua data
          di sini tersimpan di peramban perangkat ini saja, tidak terlihat di
          perangkat lain, dan belum dilindungi login. Sebelum dipakai
          sesungguhnya, halaman ini perlu disambungkan ke basis data dan
          dilindungi autentikasi di sisi server.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full max-w-[22rem]">
          <DatePicker label="Tanggal" value={date} onChange={setDate} />
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setDate(todayIso())}
            className="u-btn u-btn--ghost"
          >
            Hari ini
          </button>

          {confirmReset ? (
            <>
              <button
                type="button"
                onClick={async () => {
                  await store.reset();
                  setConfirmReset(false);
                  refresh();
                }}
                className="u-btn u-btn--urgent"
              >
                Ya, hapus semua data demo
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="u-btn u-btn--ghost"
              >
                Batal
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="u-btn u-btn--outline"
            >
              Reset Demo
            </button>
          )}
        </div>
      </div>

      {/* --- Janji temu ----------------------------------------------------- */}
      <h2 className="u-h3 mt-10 text-[var(--color-ink)]">
        Janji temu · {formatIsoDateLong(date)}
      </h2>

      {!ready ? (
        <p className="mt-3 text-[0.9375rem] text-[var(--color-ink-subtle)]">Memuat…</p>
      ) : rows.length === 0 ? (
        <p className="mt-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 text-[0.9375rem] text-[var(--color-ink-muted)]">
          Belum ada janji temu untuk tanggal ini.
        </p>
      ) : (
        /* Wadah yang menggulir sendiri — inilah yang mencegah tabel mendorong
           lebar halaman dan memicu scroll horizontal. */
        <div className="mt-4 max-w-full overflow-x-auto rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)]">
          <table className="w-full min-w-[62rem] border-collapse text-left text-[0.875rem]">
            <caption className="u-sr-only">
              Daftar janji temu pada {formatIsoDateLong(date)}
            </caption>
            <thead>
              <tr className="border-b border-[var(--color-line)] bg-[var(--color-sunken)]">
                {["Waktu", "Pemilik", "Hewan", "Layanan", "Gejala", "Keterangan", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      scope="col"
                      className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--color-ink)]"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-[var(--color-line)] last:border-0 align-top">
                  <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums text-[var(--color-ink)]">
                    {formatTime(r.time)}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-ink-muted)]">
                    <span className="block font-medium text-[var(--color-ink)]">
                      {r.ownerName}
                    </span>
                    <a
                      href={`https://wa.me/${r.ownerPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-accent)] underline underline-offset-4"
                    >
                      {r.ownerPhone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-ink-muted)]">
                    <span className="block font-medium text-[var(--color-ink)]">
                      {r.petName}
                    </span>
                    {label(allAnimals, r.animalType)} · {r.petAge}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-ink-muted)]">
                    {label(services as never, r.serviceId)}
                  </td>
                  <td className="max-w-[16rem] px-4 py-3 text-[var(--color-ink-muted)]">
                    {r.symptomIds.length
                      ? r.symptomIds.map((id) => label(allSymptoms as never, id)).join(", ")
                      : "—"}
                  </td>
                  <td className="max-w-[20rem] px-4 py-3 text-[var(--color-ink-muted)]">
                    {r.complaint || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div
                      role="group"
                      aria-label={`Status janji temu ${r.petName}`}
                      className="flex flex-wrap gap-1.5"
                    >
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={r.status === s}
                          onClick={() => store.updateStatus(r.id, s)}
                          className={
                            "rounded-[var(--radius-pill)] border px-3 py-1.5 text-[0.75rem] font-semibold capitalize transition-colors " +
                            (r.status === s
                              ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                              : "border-[var(--color-line-strong)] text-[var(--color-ink-muted)] hover:border-[var(--color-accent)]")
                          }
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- Blokir slot manual --------------------------------------------- */}
      <h2 className="u-h3 mt-12 text-[var(--color-ink)]">Blokir slot</h2>
      <p className="mt-2 max-w-[64ch] text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
        Tekan sebuah slot untuk memblokirnya, misalnya saat hari libur atau
        dokter berhalangan. Slot yang diblokir tidak dapat dipilih pengunjung.
        Slot yang sudah terisi janji temu tidak dapat diblokir.
      </p>

      {slots.length === 0 ? (
        <p className="mt-4 text-[0.9375rem] text-[var(--color-ink-subtle)]">
          Tidak ada slot untuk tanggal ini.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
          {slots.map((s) => {
            const isBlocked = s.state === "blocked";
            const isBooked = s.state === "booked";
            const isPast = s.state === "past";
            return (
              <li key={s.time}>
                <button
                  type="button"
                  disabled={isBooked || isPast}
                  aria-pressed={isBlocked}
                  onClick={() => store.toggleBlocked({ date, time: s.time })}
                  className={
                    "flex w-full flex-col items-center gap-0.5 rounded-[12px] border px-1 py-2.5 text-[0.8125rem] font-semibold transition-colors " +
                    (isBlocked
                      ? "border-[var(--color-urgent)] bg-[var(--color-urgent)] text-white"
                      : isBooked || isPast
                        ? "cursor-not-allowed border-[var(--color-line)] bg-[var(--color-sunken)] text-[var(--color-ink-subtle)]"
                        : "border-[var(--color-line-strong)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:border-[var(--color-accent)]")
                  }
                >
                  {formatTime(s.time)}
                  {/* Keadaan selalu punya label teks, bukan warna saja. */}
                  <span className="text-[0.6875rem] font-medium leading-none">
                    {isBlocked ? "Diblokir" : isBooked ? "Terisi" : isPast ? "Lewat" : "Terbuka"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
