import type { ReactNode } from "react";

/**
 * Kepala section yang dipakai SEMUA section di situs.
 *
 * Selalu empat bagian dengan urutan yang sama:
 *   1. judul section  2. headline  3. deskripsi singkat  4. CTA
 *
 * `cta` boleh kosong hanya untuk section yang CTA-nya sudah menyatu di dalam
 * isi section itu sendiri (mis. form janji temu).
 */

type Props = {
  /** 1. Judul section — label kecil di atas headline. */
  eyebrow: string;
  /** 2. Headline. */
  title: string;
  /** 3. Deskripsi singkat. */
  description: string;
  /** 4. CTA. */
  cta?: ReactNode;
  /** Tingkat heading, supaya urutan h1-h2-h3 tetap benar per halaman. */
  as?: "h1" | "h2" | "h3";
  align?: "start" | "center";
  id?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  cta,
  as: Tag = "h2",
  align = "start",
  id,
}: Props) {
  const headingClass = Tag === "h1" ? "u-h1" : Tag === "h2" ? "u-h2" : "u-h3";

  return (
    <header
      className={
        "flex flex-col gap-4 " +
        (align === "center" ? "items-center text-center" : "items-start")
      }
    >
      <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
        {eyebrow}
      </p>

      <Tag id={id} className={headingClass + " text-[var(--color-ink)]"}>
        {title}
      </Tag>

      <p
        className={
          "text-[1.0625rem] leading-relaxed text-[var(--color-ink-muted)] " +
          (align === "center" ? "max-w-[52ch]" : "max-w-[58ch]")
        }
      >
        {description}
      </p>

      {cta ? <div className="mt-2 flex flex-wrap gap-3">{cta}</div> : null}
    </header>
  );
}
