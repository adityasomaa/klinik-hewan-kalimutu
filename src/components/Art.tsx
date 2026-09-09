/**
 * Pembungkus gambar.
 *
 * Rasio dikunci DI LEVEL KOMPONEN: hanya 16:9 atau 1:1, tidak ada pilihan lain.
 * Pembungkusnya menahan ruang lewat aspect-ratio sebelum gambar termuat, jadi
 * layout tidak pernah melompat.
 *
 * Kalau sebuah komposisi terasa menuntut rasio lain, ubah komposisinya di
 * scripts/generate-art.mjs — jangan menambah rasio baru di sini.
 */

type Ratio = "16x9" | "1x1";

type Props = {
  /** Nama file di public/art tanpa ekstensi. */
  src: string;
  ratio: Ratio;
  /**
   * Teks alternatif. Gambar di situs ini dekoratif — semua informasi selalu
   * ada juga sebagai teks — jadi defaultnya kosong dan disembunyikan dari
   * pembaca layar. Isi hanya kalau gambar benar-benar membawa informasi.
   */
  alt?: string;
  className?: string;
  priority?: boolean;
};

export function Art({ src, ratio, alt = "", className = "", priority }: Props) {
  const decorative = alt === "";

  return (
    <div
      className={
        (ratio === "16x9" ? "u-media-16x9" : "u-media-1x1") +
        " rounded-[var(--radius-card)] " +
        className
      }
    >
      {/*
        next/image sengaja tidak dipakai untuk aset SVG statis ini: kuota Image
        Optimization di akun Vercel sudah habis, dan optimizer tidak memberi
        keuntungan apa pun untuk SVG. next.config juga menyetel
        images.unoptimized = true sebagai pengaman kedua.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/art/${src}.svg`}
        alt={alt}
        aria-hidden={decorative ? "true" : undefined}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        width={ratio === "16x9" ? 1600 : 640}
        height={ratio === "16x9" ? 900 : 640}
      />
    </div>
  );
}
