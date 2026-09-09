"use client";

/**
 * Form janji temu.
 *
 * Beberapa keputusan yang perlu diketahui sebelum mengubah file ini:
 *
 *  - Jalur darurat SENGAJA tidak berada di komponen ini. Blok itu dirender di
 *    halaman, di atas batas Suspense, supaya sudah ada di HTML server dan tidak
 *    perlu menunggu JavaScript. Orang yang hewannya sedang gawat tidak boleh
 *    menunggu hidrasi hanya untuk melihat tombol telepon.
 *
 *  - Kolom keluhan dibantu daftar gejala yang bisa dicentang. Daftar itu
 *    BUKAN alat diagnosis: gejala hanya dikumpulkan lalu diteruskan apa adanya.
 *    Jangan pernah memetakan gejala ke penyakit, tingkat kegawatan, atau saran
 *    tindakan.
 *
 *  - Pemilih jenis hewan dan jenis layanan bertingkat. Mengganti jenis hewan
 *    mengosongkan layanan yang tidak berlaku, bukan meninggalkan pilihan lama
 *    yang sudah tidak valid.
 *
 *  - Validasi di sini hanya untuk kenyamanan. Server memvalidasi ulang SEMUA
 *    field lewat /api/janji-temu dan tidak mempercayai apa pun dari browser.
 *
 *  - Hasil akhirnya dikirim ke WhatsApp, karena di situlah klinik benar-benar
 *    membaca pesan. Penyimpanan lokal hanya membuat slot terkunci di perangkat
 *    ini supaya alurnya bisa didemokan utuh.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  activeServices,
  allAnimals,
  animals,
  booking,
  hasOpeningHours,
  symptoms,
} from "@/data/clinic";
import { Listbox, type Option } from "@/components/Listbox";
import { DatePicker } from "@/components/DatePicker";
import { WhatsAppIcon } from "@/components/WhatsAppLink";
import { formatTime } from "@/lib/hours";
import {
  earliestSelectableDate,
  formatIsoDateLong,
  slotsForDate,
  type Slot,
} from "@/lib/slots";
import { store, STORE_EVENT } from "@/lib/store";
import { appointmentMessage, whatsappHref } from "@/lib/whatsapp";
import { validateAppointment, type FieldErrors } from "@/lib/validation";
import { readDraft, saveDraft, CONSENT_EVENT } from "@/lib/consent";

type Form = {
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
};

const EMPTY: Form = {
  ownerName: "",
  ownerPhone: "",
  animalType: "",
  petName: "",
  petAge: "",
  serviceId: "",
  symptomIds: [],
  complaint: "",
  date: "",
  time: "",
};

export function BookingForm() {
  const params = useSearchParams();
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [taken, setTaken] = useState<string[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState<{ href: string; summary: string } | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const set = useCallback(<K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }, []);

  /* --- Muat draf (hanya kalau pengunjung mengizinkan preferensi). --------- */
  useEffect(() => {
    const load = () => {
      const draft = readDraft<Partial<Form>>();
      if (draft) setForm((f) => ({ ...f, ...draft, date: "", time: "" }));
    };
    load();
    window.addEventListener(CONSENT_EVENT, load);
    return () => window.removeEventListener(CONSENT_EVENT, load);
  }, []);

  /* --- Layanan yang dipilih dari halaman layanan ikut terisi otomatis. ---- */
  useEffect(() => {
    const wanted = params?.get("layanan");
    if (!wanted) return;
    const svc = activeServices.find((s) => s.id === wanted);
    if (!svc) return;
    setForm((f) => ({
      ...f,
      serviceId: svc.id,
      // Kalau layanan ini hanya berlaku untuk satu jenis hewan, isi sekalian.
      animalType:
        f.animalType || (svc.animals.length === 1 ? svc.animals[0] : f.animalType),
    }));
  }, [params]);

  /* --- Tanggal awal: hari paling dekat yang masih punya slot kosong. ------ */
  useEffect(() => {
    setForm((f) => (f.date ? f : { ...f, date: earliestSelectableDate() }));
  }, []);

  /* --- Slot terpakai dan slot yang diblokir admin. ------------------------ */
  const refreshSlots = useCallback(async () => {
    if (!form.date) return;
    const [appts, blocks] = await Promise.all([
      store.listByDate(form.date),
      store.listBlocked(),
    ]);
    setTaken(appts.map((a) => a.time));
    setBlocked(blocks.filter((b) => b.date === form.date).map((b) => b.time));
  }, [form.date]);

  useEffect(() => {
    refreshSlots();
    window.addEventListener(STORE_EVENT, refreshSlots);
    return () => window.removeEventListener(STORE_EVENT, refreshSlots);
  }, [refreshSlots]);

  /* --- Simpan draf setiap kali isian berubah. ----------------------------- */
  useEffect(() => {
    const { date: _d, time: _t, ...rest } = form;
    void _d;
    void _t;
    saveDraft(rest);
  }, [form]);

  /* --- Pilihan bertingkat: hewan menentukan layanan yang berlaku. --------- */
  const serviceOptions: Option[] = useMemo(
    () =>
      activeServices.map((s) => {
        const applies = !form.animalType || s.animals.includes(form.animalType);
        return {
          value: s.id,
          label: s.name,
          hint: s.what,
          disabled: !applies,
          disabledLabel: "Tidak berlaku",
        };
      }),
    [form.animalType]
  );

  /** Mengganti jenis hewan mengosongkan layanan yang jadi tidak berlaku. */
  const onAnimalChange = (next: string) => {
    setForm((f) => {
      const svc = activeServices.find((s) => s.id === f.serviceId);
      const stillValid = svc ? svc.animals.includes(next) : true;
      return {
        ...f,
        animalType: next,
        serviceId: stillValid ? f.serviceId : "",
        time: f.time,
      };
    });
    setErrors((e) => ({ ...e, animalType: undefined, serviceId: undefined }));
  };

  const animalOptions: Option[] = allAnimals.map((a) => ({
    value: a.id,
    label: a.label,
  }));

  const slots: Slot[] = useMemo(
    () => (form.date ? slotsForDate(form.date, taken, blocked) : []),
    [form.date, taken, blocked]
  );

  /* Kalau tanggal berganti dan waktu lama jadi tidak valid, kosongkan. */
  useEffect(() => {
    if (!form.time) return;
    const s = slots.find((x) => x.time === form.time);
    if (!s || s.state !== "available") setForm((f) => ({ ...f, time: "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots]);

  const toggleSymptom = (id: string) => {
    setForm((f) => ({
      ...f,
      symptomIds: f.symptomIds.includes(id)
        ? f.symptomIds.filter((s) => s !== id)
        : [...f.symptomIds, id],
    }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const payload = {
      ...form,
      sourcePath: window.location.pathname + window.location.search,
      website: honeypot.current?.value ?? "",
    };

    // Cek cepat di browser supaya pesan kesalahan muncul tanpa menunggu server.
    const local = validateAppointment(payload, { taken, blocked });
    if (!local.ok) {
      setErrors(local.errors);
      const firstKey = Object.keys(local.errors)[0];
      document
        .querySelector<HTMLElement>(`[data-field="${firstKey}"]`)
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    try {
      // Server memvalidasi ulang semuanya. Ini bukan formalitas: field apa pun
      // bisa dipalsukan dari browser.
      const res = await fetch("/api/janji-temu", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as
        | { ok: true }
        | { ok: false; errors?: FieldErrors; message?: string };

      if (!res.ok || !data.ok) {
        if ("errors" in data && data.errors) setErrors(data.errors);
        setServerError(
          ("message" in data && data.message) ||
            "Permintaan tidak dapat diproses. Periksa kembali isian Anda."
        );
        setSubmitting(false);
        return;
      }

      // Simpan di perangkat ini supaya slotnya terkunci dan alurnya utuh.
      await store.createAppointment({
        ownerName: local.value.ownerName,
        ownerPhone: local.value.ownerPhone,
        animalType: local.value.animalType,
        petName: local.value.petName,
        petAge: local.value.petAge,
        serviceId: local.value.serviceId,
        symptomIds: local.value.symptomIds,
        complaint: local.value.complaint,
        date: local.value.date,
        time: local.value.time,
      });

      const message = appointmentMessage(local.value);
      setDone({
        href: whatsappHref(message),
        summary: `${formatIsoDateLong(local.value.date)}, pukul ${formatTime(local.value.time)} WITA`,
      });
    } catch {
      setServerError(
        "Koneksi terputus saat mengirim. Periksa jaringan Anda lalu coba lagi."
      );
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (done) summaryRef.current?.focus();
  }, [done]);

  /* --- Layar setelah berhasil ------------------------------------------- */
  if (done) {
    return (
      <div
        ref={summaryRef}
        tabIndex={-1}
        className="u-card p-6 focus:outline-none sm:p-8"
      >
        <h2 className="u-h3 text-[var(--color-ink)]">Permintaan siap dikirim</h2>
        <p className="mt-3 max-w-[56ch] text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
          Waktu yang Anda pilih: <strong>{done.summary}</strong>. Tekan tombol di
          bawah untuk membuka WhatsApp dengan pesan yang sudah terisi, lalu kirim.
          Permintaan ini belum terjadwal sampai klinik mengonfirmasinya.
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <a
            href={done.href}
            target="_blank"
            rel="noopener noreferrer"
            className="u-btn u-btn--primary"
          >
            <WhatsAppIcon className="size-[18px]" />
            Kirim lewat WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              setDone(null);
              setForm((f) => ({ ...EMPTY, date: f.date }));
            }}
            className="u-btn u-btn--ghost"
          >
            Buat permintaan lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} noValidate className="u-card p-5 sm:p-7">
        {/* Umpan bot. Memakai clip, bukan posisi negatif jauh di luar layar. */}
        <div className="u-honeypot" aria-hidden="true">
          <label htmlFor="situs-web">Biarkan kosong</label>
          <input
            ref={honeypot}
            id="situs-web"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <fieldset className="border-0 p-0">
          <legend className="u-h3 mb-1 text-[var(--color-ink)]">Data pemilik</legend>
          <p className="mb-5 text-[0.875rem] text-[var(--color-ink-subtle)]">
            Konfirmasi akan dikirim ke nomor WhatsApp ini.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              name="ownerName"
              label="Nama pemilik"
              value={form.ownerName}
              onChange={(v) => set("ownerName", v)}
              error={errors.ownerName}
              autoComplete="name"
              required
            />
            <Field
              name="ownerPhone"
              label="Nomor WhatsApp"
              value={form.ownerPhone}
              onChange={(v) => set("ownerPhone", v)}
              error={errors.ownerPhone}
              inputMode="tel"
              autoComplete="tel"
              placeholder="0812xxxxxxx"
              required
            />
          </div>
        </fieldset>

        <hr className="my-7 border-t border-[var(--color-line)]" />

        <fieldset className="border-0 p-0">
          <legend className="u-h3 mb-1 text-[var(--color-ink)]">Data hewan</legend>
          <p className="mb-5 max-w-[60ch] text-[0.875rem] leading-relaxed text-[var(--color-ink-subtle)]">
            {animals.additional.length === 0
              ? "Daftar di bawah adalah jenis hewan yang dilayani klinik. Untuk jenis lain, tanyakan lebih dulu lewat WhatsApp."
              : "Pilih jenis hewan Anda."}
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div data-field="animalType">
              <Listbox
                label="Jenis hewan"
                options={animalOptions}
                value={form.animalType}
                onChange={onAnimalChange}
                error={errors.animalType}
                required
              />
            </div>

            <Field
              name="petName"
              label="Nama hewan"
              value={form.petName}
              onChange={(v) => set("petName", v)}
              error={errors.petName}
              required
            />

            <Field
              name="petAge"
              label="Perkiraan umur"
              value={form.petAge}
              onChange={(v) => set("petAge", v)}
              error={errors.petAge}
              placeholder="mis. 2 tahun, atau 4 bulan"
              description="Perkiraan saja sudah cukup."
              required
            />

            <div data-field="serviceId">
              <Listbox
                label="Jenis layanan"
                options={serviceOptions}
                value={form.serviceId}
                onChange={(v) => set("serviceId", v)}
                error={errors.serviceId}
                description={
                  form.animalType
                    ? undefined
                    : "Pilih jenis hewan lebih dulu untuk menyaring layanan."
                }
                required
              />
            </div>
          </div>
        </fieldset>

        <hr className="my-7 border-t border-[var(--color-line)]" />

        <fieldset className="border-0 p-0" data-field="complaint">
          <legend className="u-h3 mb-1 text-[var(--color-ink)]">Keluhan</legend>
          <p className="mb-5 max-w-[62ch] text-[0.875rem] leading-relaxed text-[var(--color-ink-subtle)]">
            Centang yang Anda amati, lalu tambahkan keterangan bila perlu.
            Keterangan ini diteruskan apa adanya ke klinik agar dokter dapat
            bersiap sebelum kunjungan. Daftar ini bukan alat diagnosis.
          </p>

          <ul className="flex flex-wrap gap-2">
            {symptoms.map((s) => {
              const on = form.symptomIds.includes(s.id);
              return (
                <li key={s.id}>
                  <label
                    className={
                      "inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-pill)] border px-3.5 py-2.5 text-[0.875rem] font-medium transition-colors " +
                      (on
                        ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent-ink)]"
                        : "border-[var(--color-line-strong)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:border-[var(--color-accent)]")
                    }
                  >
                    <input
                      type="checkbox"
                      className="size-4 accent-[var(--color-accent)]"
                      checked={on}
                      onChange={() => toggleSymptom(s.id)}
                    />
                    {s.label}
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="mt-5">
            <label
              htmlFor="complaint"
              className="text-[0.9375rem] font-semibold text-[var(--color-ink)]"
            >
              Keterangan tambahan
            </label>
            <textarea
              id="complaint"
              name="complaint"
              rows={4}
              maxLength={600}
              value={form.complaint}
              onChange={(e) => set("complaint", e.target.value)}
              placeholder="Sejak kapan, dan apa yang Anda amati."
              aria-invalid={errors.complaint ? true : undefined}
              className={
                "mt-1.5 w-full rounded-[var(--radius-card)] border bg-[var(--color-surface)] px-4 py-3 text-[0.9375rem] leading-relaxed transition-colors " +
                (errors.complaint
                  ? "border-[var(--color-urgent)]"
                  : "border-[var(--color-line-strong)] focus:border-[var(--color-accent)]")
              }
            />
            <p className="mt-1.5 text-[0.8125rem] text-[var(--color-ink-subtle)]">
              {form.complaint.length} / 600 karakter
            </p>
            {errors.complaint ? (
              <p role="alert" className="text-[0.8125rem] font-medium text-[var(--color-urgent)]">
                {errors.complaint}
              </p>
            ) : null}
          </div>
        </fieldset>

        <hr className="my-7 border-t border-[var(--color-line)]" />

        <fieldset className="border-0 p-0">
          <legend className="u-h3 mb-1 text-[var(--color-ink)]">Waktu kunjungan</legend>
          <p className="mb-5 max-w-[62ch] text-[0.875rem] leading-relaxed text-[var(--color-ink-subtle)]">
            {hasOpeningHours
              ? `Slot dibuat dari jam operasional klinik, setiap ${booking.slotMinutes} menit. Pemesanan paling cepat ${booking.minLeadMinutes} menit dari sekarang.`
              : `Jam operasional klinik belum kami konfirmasi, jadi pilihan waktu di bawah masih bersifat sementara dan akan dipastikan ulang oleh klinik saat konfirmasi. Pemesanan paling cepat ${booking.minLeadMinutes} menit dari sekarang.`}
          </p>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,20rem)_1fr]">
            <div data-field="date">
              <DatePicker
                label="Tanggal"
                value={form.date}
                onChange={(v) => set("date", v)}
                error={errors.date}
                required
              />
            </div>

            <div data-field="time">
              <span className="text-[0.9375rem] font-semibold text-[var(--color-ink)]">
                Waktu
                <span className="text-[var(--color-urgent)]" aria-hidden="true">
                  {" "}
                  *
                </span>
              </span>

              {slots.length === 0 ? (
                <p className="mt-2 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-sunken)] p-4 text-[0.875rem] text-[var(--color-ink-muted)]">
                  Tidak ada slot untuk tanggal ini. Pilih tanggal lain.
                </p>
              ) : (
                <ul
                  role="radiogroup"
                  aria-label="Pilih waktu kunjungan"
                  className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4"
                >
                  {slots.map((s) => {
                    const usable = s.state === "available";
                    const chosen = form.time === s.time;
                    return (
                      <li key={s.time}>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={chosen}
                          disabled={!usable}
                          onClick={() => set("time", s.time)}
                          className={
                            "flex w-full flex-col items-center gap-0.5 rounded-[12px] border px-1 py-2.5 text-[0.875rem] font-semibold transition-colors " +
                            (chosen
                              ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                              : usable
                                ? "border-[var(--color-line-strong)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:border-[var(--color-accent)]"
                                : "cursor-not-allowed border-[var(--color-line)] bg-[var(--color-sunken)] text-[var(--color-ink-subtle)]")
                          }
                        >
                          <span className={usable ? "" : "line-through"}>
                            {formatTime(s.time)}
                          </span>
                          {/* Status slot selalu punya label teks, bukan warna saja. */}
                          {!usable ? (
                            <span className="text-[0.6875rem] font-medium leading-none">
                              {s.label}
                            </span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {errors.time ? (
                <p role="alert" className="mt-2 text-[0.8125rem] font-medium text-[var(--color-urgent)]">
                  {errors.time}
                </p>
              ) : null}
            </div>
          </div>
        </fieldset>

        {serverError ? (
          <p
            role="alert"
            className="mt-6 rounded-[var(--radius-card)] border border-[var(--color-urgent)] bg-[var(--color-urgent-soft)] p-4 text-[0.9375rem] font-medium text-[var(--color-urgent)]"
          >
            {serverError}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 border-t border-[var(--color-line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[46ch] text-[0.8125rem] leading-relaxed text-[var(--color-ink-subtle)]">
            Menekan tombol ini membuka WhatsApp dengan pesan yang sudah terisi.
            Janji temu berlaku setelah dikonfirmasi klinik.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="u-btn u-btn--primary shrink-0 disabled:opacity-60"
          >
            <WhatsAppIcon className="size-[18px]" />
            {submitting ? "Memeriksa…" : "Lanjut ke WhatsApp"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* --- Input teks biasa ----------------------------------------------------- */
function Field({
  name,
  label,
  value,
  onChange,
  error,
  description,
  placeholder,
  required,
  inputMode,
  autoComplete,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  inputMode?: "text" | "tel" | "numeric";
  autoComplete?: string;
}) {
  const errId = error ? `${name}-err` : undefined;
  const descId = description ? `${name}-desc` : undefined;

  return (
    <div className="flex flex-col gap-1.5" data-field={name}>
      <label htmlFor={name} className="text-[0.9375rem] font-semibold text-[var(--color-ink)]">
        {label}
        {required ? (
          <span className="text-[var(--color-urgent)]" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>

      {description ? (
        <p id={descId} className="text-[0.8125rem] text-[var(--color-ink-subtle)]">
          {description}
        </p>
      ) : null}

      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={[descId, errId].filter(Boolean).join(" ") || undefined}
        className={
          "min-h-[3.25rem] w-full rounded-[var(--radius-card)] border bg-[var(--color-surface)] px-4 text-[0.9375rem] transition-colors " +
          (error
            ? "border-[var(--color-urgent)]"
            : "border-[var(--color-line-strong)] focus:border-[var(--color-accent)]")
        }
      />

      {error ? (
        <p id={errId} role="alert" className="text-[0.8125rem] font-medium text-[var(--color-urgent)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
