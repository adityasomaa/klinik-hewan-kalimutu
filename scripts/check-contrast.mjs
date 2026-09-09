/**
 * Cek kontras WCAG untuk setiap pasangan warna yang benar-benar dipakai di situs.
 * Jalankan ulang SETIAP KALI warna aksen diubah:  node scripts/check-contrast.mjs
 * Keluar dengan kode 1 kalau ada pasangan yang gagal.
 */

const T = {
  bg: "#F6F4EF",
  surface: "#FFFFFF",
  surfaceSunken: "#EFEBE3",
  ink: "#111E1A",
  inkMuted: "#4C5A54",
  inkSubtle: "#5C6A63",
  accent: "#0E5C46",
  accentHover: "#0A4634",
  accentSoft: "#DFEDE7",
  accentInk: "#0B4735",
  urgent: "#983521",
  urgentSoft: "#FAEBE6",
  border: "#DCD6CB",
  borderStrong: "#8A8275",
  white: "#FFFFFF",
};

function srgb(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function lum(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
}
function ratio(a, b) {
  const l1 = lum(a);
  const l2 = lum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** [nama, foreground, background, minimum] */
const PAIRS = [
  ["teks utama di latar halaman", T.ink, T.bg, 4.5],
  ["teks utama di kartu putih", T.ink, T.surface, 4.5],
  ["teks utama di panel tenggelam", T.ink, T.surfaceSunken, 4.5],
  ["teks sekunder di latar halaman", T.inkMuted, T.bg, 4.5],
  ["teks sekunder di kartu putih", T.inkMuted, T.surface, 4.5],
  ["teks tersier di latar halaman", T.inkSubtle, T.bg, 4.5],
  ["teks tersier di kartu putih", T.inkSubtle, T.surface, 4.5],
  ["tautan aksen di latar halaman", T.accent, T.bg, 4.5],
  ["tautan aksen di kartu putih", T.accent, T.surface, 4.5],
  ["teks putih di tombol aksen", T.white, T.accent, 4.5],
  ["teks putih di tombol aksen hover", T.white, T.accentHover, 4.5],
  ["teks aksen di panel aksen lembut", T.accentInk, T.accentSoft, 4.5],
  ["teks putih di tombol darurat", T.white, T.urgent, 4.5],
  ["teks darurat di panel darurat lembut", T.urgent, T.urgentSoft, 4.5],
  ["teks darurat di latar halaman", T.urgent, T.bg, 4.5],
  // Batas non-teks (ikon, garis, ring fokus) minimal 3:1 per WCAG 1.4.11
  ["garis pembatas di latar halaman", T.borderStrong, T.bg, 3],
  ["garis pembatas di kartu putih", T.borderStrong, T.surface, 3],
  ["ring fokus di latar halaman", T.accent, T.bg, 3],
];

let failed = 0;
console.log("Pemeriksaan kontras WCAG\n" + "=".repeat(64));
for (const [name, fg, bg, min] of PAIRS) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(
    `${ok ? "LULUS" : "GAGAL"}  ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${name}  ${fg} / ${bg}`
  );
}
console.log("=".repeat(64));
if (failed) {
  console.error(`${failed} pasangan GAGAL. Perbaiki token sebelum lanjut.`);
  process.exit(1);
}
console.log(`Semua ${PAIRS.length} pasangan lulus.`);
