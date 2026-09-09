"use client";

/**
 * Dropdown custom — pola ARIA listbox yang sungguhan, bukan select native
 * yang disamarkan.
 *
 * Yang didukung:
 *   - ArrowDown / ArrowUp   pindah pilihan
 *   - Home / End            ke pilihan pertama / terakhir
 *   - ketik huruf           lompat ke pilihan yang diawali huruf itu (type-ahead)
 *   - Enter / Space         buka, atau pilih yang sedang disorot
 *   - Escape                tutup tanpa mengubah pilihan
 *   - fokus SELALU kembali ke trigger setelah ditutup
 *   - klik di luar menutup
 *
 * Opsi yang dinonaktifkan dilewati saat navigasi keyboard dan diberi label
 * teks, tidak hanya dibedakan lewat warna.
 */

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

export type Option = {
  value: string;
  label: string;
  /** Keterangan singkat di bawah label. */
  hint?: string;
  disabled?: boolean;
  /** Label teks untuk keadaan nonaktif, mis. "Tidak berlaku". */
  disabledLabel?: string;
};

type Props = {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Keterangan di bawah kontrol. */
  description?: string;
  error?: string;
  name?: string;
  required?: boolean;
};

export function Listbox({
  label,
  options,
  value,
  onChange,
  placeholder = "Pilih salah satu",
  description,
  error,
  name,
  required,
}: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ buffer: "", at: 0 });

  const baseId = useId();
  const listId = `${baseId}-list`;
  const labelId = `${baseId}-label`;
  const descId = description ? `${baseId}-desc` : undefined;
  const errId = error ? `${baseId}-err` : undefined;

  const selectedIndex = useMemo(
    () => options.findIndex((o) => o.value === value),
    [options, value]
  );
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  const firstEnabled = useCallback(
    (from: number, dir: 1 | -1) => {
      const n = options.length;
      for (let i = 0; i < n; i++) {
        const idx = (((from + dir * i) % n) + n) % n;
        if (!options[idx].disabled) return idx;
      }
      return -1;
    },
    [options]
  );

  const openList = useCallback(() => {
    setOpen(true);
    setActive(selectedIndex >= 0 ? selectedIndex : firstEnabled(0, 1));
  }, [selectedIndex, firstEnabled]);

  const closeList = useCallback((focusTrigger = true) => {
    setOpen(false);
    setActive(-1);
    if (focusTrigger) triggerRef.current?.focus();
  }, []);

  const commit = useCallback(
    (index: number) => {
      const opt = options[index];
      if (!opt || opt.disabled) return;
      onChange(opt.value);
      closeList();
    },
    [options, onChange, closeList]
  );

  /* Klik di luar menutup daftar tanpa memindahkan fokus. */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) closeList(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, closeList]);

  /* Jaga opsi yang sedang disorot tetap terlihat. */
  useEffect(() => {
    if (!open || active < 0) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  /* Fokus pindah ke daftar saat terbuka, supaya pembaca layar ikut. */
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  const typeAhead = useCallback(
    (char: string) => {
      const now = Date.now();
      const t = typed.current;
      t.buffer = now - t.at > 600 ? char : t.buffer + char;
      t.at = now;

      const start = active >= 0 ? active : 0;
      const n = options.length;
      for (let i = 1; i <= n; i++) {
        const idx = (start + i) % n;
        const o = options[idx];
        if (!o.disabled && o.label.toLowerCase().startsWith(t.buffer.toLowerCase())) {
          setActive(idx);
          return;
        }
      }
    },
    [active, options]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        closeList();
        break;
      case "Tab":
        closeList(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => firstEnabled(a < 0 ? 0 : a + 1, 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => firstEnabled(a < 0 ? options.length - 1 : a - 1, -1));
        break;
      case "Home":
        e.preventDefault();
        setActive(firstEnabled(0, 1));
        break;
      case "End":
        e.preventDefault();
        setActive(firstEnabled(options.length - 1, -1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(active);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          typeAhead(e.key);
        }
    }
  };

  return (
    <div ref={rootRef} className="flex flex-col gap-1.5">
      <span id={labelId} className="text-[0.9375rem] font-semibold text-[var(--color-ink)]">
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

      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-labelledby={labelId}
          aria-describedby={[descId, errId].filter(Boolean).join(" ") || undefined}
          aria-required={required}
          aria-invalid={error ? true : undefined}
          onClick={() => (open ? closeList() : openList())}
          onKeyDown={onKeyDown}
          className={
            "flex min-h-[3.25rem] w-full items-center justify-between gap-3 rounded-[var(--radius-card)] border bg-[var(--color-surface)] px-4 py-2.5 text-left text-[0.9375rem] transition-colors " +
            (error
              ? "border-[var(--color-urgent)]"
              : "border-[var(--color-line-strong)] hover:border-[var(--color-accent)]")
          }
        >
          <span
            className={
              selected ? "text-[var(--color-ink)]" : "text-[var(--color-ink-subtle)]"
            }
          >
            {selected ? selected.label : placeholder}
          </span>
          <ChevronIcon open={open} />
        </button>

        {open ? (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={labelId}
            aria-activedescendant={active >= 0 ? `${baseId}-opt-${active}` : undefined}
            onKeyDown={onKeyDown}
            className="absolute inset-x-0 top-[calc(100%+0.375rem)] max-h-72 overflow-y-auto rounded-[var(--radius-card)] border border-[var(--color-line-strong)] bg-[var(--color-surface)] py-1.5 shadow-[0_14px_38px_-14px_rgba(17,30,26,0.36)] focus:outline-none"
            style={{ zIndex: "var(--z-raised)" }}
          >
            {options.map((o, i) => {
              const isSelected = o.value === value;
              return (
                <li
                  key={o.value}
                  id={`${baseId}-opt-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={o.disabled || undefined}
                  onPointerEnter={() => !o.disabled && setActive(i)}
                  onClick={() => commit(i)}
                  className={
                    "flex cursor-pointer items-start justify-between gap-3 px-4 py-2.5 text-[0.9375rem] " +
                    (o.disabled
                      ? "cursor-not-allowed text-[var(--color-ink-subtle)] opacity-70"
                      : i === active
                        ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-ink)]"
                        : "text-[var(--color-ink)]")
                  }
                >
                  <span className="min-w-0">
                    <span className="block font-medium">{o.label}</span>
                    {o.hint ? (
                      <span className="mt-0.5 block text-[0.8125rem] leading-snug text-[var(--color-ink-subtle)]">
                        {o.hint}
                      </span>
                    ) : null}
                  </span>

                  {/* Keadaan selalu punya label teks, tidak hanya warna. */}
                  {o.disabled ? (
                    <span className="shrink-0 rounded-[var(--radius-pill)] border border-[var(--color-line)] px-2 py-0.5 text-[0.75rem]">
                      {o.disabledLabel ?? "Tidak tersedia"}
                    </span>
                  ) : isSelected ? (
                    <span className="shrink-0 text-[0.75rem] font-semibold text-[var(--color-accent)]">
                      Dipilih
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {name ? <input type="hidden" name={name} value={value} /> : null}

      {error ? (
        <p id={errId} role="alert" className="text-[0.8125rem] font-medium text-[var(--color-urgent)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={
        "size-[18px] shrink-0 text-[var(--color-ink-muted)] transition-transform " +
        (open ? "rotate-180" : "")
      }
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
