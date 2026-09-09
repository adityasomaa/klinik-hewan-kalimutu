/* =============================================================================
 * GENERATOR GAMBAR — deterministik, bisa dijalankan ulang kapan saja.
 *
 *   npm run gen:art
 *
 * Semua gambar di situs ini dibuat dari script ini. Tidak ada foto stok, tidak
 * ada layanan placeholder pihak ketiga. Karena seed-nya tetap, menjalankan ulang
 * script selalu menghasilkan file yang identik.
 *
 * ATURAN YANG DIPEGANG SCRIPT INI:
 *   - Hanya dua orientasi: 16:9 dan 1:1. Tidak ada rasio lain.
 *   - Tidak ada grain, noise, film grain, atau tekstur bintik. Kedalaman visual
 *     dibuat dari gradasi halus, garis, bentuk geometris, dan kontras.
 *   - Tidak ada yang berpura-pura jadi foto klinik, foto hewan, atau wajah orang.
 *   - Tidak pernah menggambar hewan yang sakit, terluka, berdarah, atau diinfus.
 *     Bahasa bentuknya siluet hewan yang sangat disederhanakan dan tenang.
 *   - Satu warna aksen, selaras dengan token di globals.css.
 * ========================================================================== */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "art");

const C = {
  bg: "#F6F4EF",
  sunken: "#EFEBE3",
  ink: "#111E1A",
  accent: "#0E5C46",
  accentSoft: "#DFEDE7",
  accentMid: "#7FAE9C",
  line: "#DCD6CB",
  surface: "#FFFFFF",
};

/* --- PRNG berseed: hasil selalu sama untuk seed yang sama. ---------------- */
function rng(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

const n = (v) => Math.round(v * 100) / 100;

/* --- Bahasa bentuk: siluet hewan yang sangat disederhanakan. --------------
   Bukan ilustrasi realistis — hanya kepala geometris dengan telinga, cukup
   untuk dikenali sekilas dan tetap tenang. -------------------------------- */

/** Kepala kucing: telinga segitiga tegak. */
function catHead(cx, cy, r, fill, opacity = 1) {
  const ear = r * 0.62;
  return `<g opacity="${opacity}">
    <path d="M ${n(cx - r * 0.78)} ${n(cy - r * 0.42)} L ${n(cx - r * 0.62)} ${n(cy - r - ear * 0.5)} L ${n(cx - r * 0.12)} ${n(cy - r * 0.74)} Z" fill="${fill}"/>
    <path d="M ${n(cx + r * 0.78)} ${n(cy - r * 0.42)} L ${n(cx + r * 0.62)} ${n(cy - r - ear * 0.5)} L ${n(cx + r * 0.12)} ${n(cy - r * 0.74)} Z" fill="${fill}"/>
    <circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${fill}"/>
  </g>`;
}

/** Kepala anjing: telinga lengkung menggantung. */
function dogHead(cx, cy, r, fill, opacity = 1) {
  return `<g opacity="${opacity}">
    <path d="M ${n(cx - r * 0.86)} ${n(cy - r * 0.55)}
             q ${n(-r * 0.5)} ${n(r * 0.35)} ${n(-r * 0.24)} ${n(r * 1.05)}
             q ${n(r * 0.3)} ${n(r * 0.24)} ${n(r * 0.66)} ${n(-r * 0.36)} Z" fill="${fill}"/>
    <path d="M ${n(cx + r * 0.86)} ${n(cy - r * 0.55)}
             q ${n(r * 0.5)} ${n(r * 0.35)} ${n(r * 0.24)} ${n(r * 1.05)}
             q ${n(-r * 0.3)} ${n(r * 0.24)} ${n(-r * 0.66)} ${n(-r * 0.36)} Z" fill="${fill}"/>
    <circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${fill}"/>
  </g>`;
}

/** Jejak kaki yang disederhanakan. */
function paw(cx, cy, r, fill, opacity = 1) {
  const t = [];
  for (let i = 0; i < 4; i++) {
    const a = -Math.PI * 0.86 + (i * Math.PI * 0.72) / 3;
    t.push(
      `<ellipse cx="${n(cx + Math.cos(a) * r * 0.82)}" cy="${n(cy + Math.sin(a) * r * 0.82)}" rx="${n(r * 0.235)}" ry="${n(r * 0.3)}" fill="${fill}" transform="rotate(${n((a * 180) / Math.PI + 90)} ${n(cx + Math.cos(a) * r * 0.82)} ${n(cy + Math.sin(a) * r * 0.82)})"/>`
    );
  }
  return `<g opacity="${opacity}">${t.join("")}
    <path d="M ${n(cx)} ${n(cy + r * 0.9)}
             q ${n(-r * 0.72)} 0 ${n(-r * 0.72)} ${n(-r * 0.42)}
             q 0 ${n(-r * 0.42)} ${n(r * 0.72)} ${n(-r * 0.42)}
             q ${n(r * 0.72)} 0 ${n(r * 0.72)} ${n(r * 0.42)}
             q 0 ${n(r * 0.42)} ${n(-r * 0.72)} ${n(r * 0.42)} Z" fill="${fill}"/>
  </g>`;
}

/** Busur tenang yang dipakai berulang sebagai motif pengikat. */
function arcs(cx, cy, count, step, from, sweep, stroke, width, rand) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const r = from + i * step;
    const a0 = -Math.PI * 0.96 + (rand ? rand() * 0.12 : 0);
    const a1 = a0 + sweep;
    out.push(
      `<path d="M ${n(cx + Math.cos(a0) * r)} ${n(cy + Math.sin(a0) * r)} A ${n(r)} ${n(r)} 0 0 1 ${n(cx + Math.cos(a1) * r)} ${n(cy + Math.sin(a1) * r)}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`
    );
  }
  return out.join("");
}

function defs(id) {
  return `<defs>
    <linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.accentSoft}"/>
      <stop offset="1" stop-color="${C.sunken}"/>
    </linearGradient>
    <linearGradient id="a-${id}" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="${C.accent}"/>
      <stop offset="1" stop-color="${C.accentMid}"/>
    </linearGradient>
    <clipPath id="c-${id}"><rect width="100%" height="100%" rx="0"/></clipPath>
  </defs>`;
}

function svg(w, h, id, body, transparent = false) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-hidden="true">
${defs(id)}
${transparent ? "" : `<rect width="${w}" height="${h}" fill="${C.bg}"/>`}
<g clip-path="url(#c-${id})">
${body}
</g>
</svg>`;
}

/* =============================================================================
 * KARTU LAYANAN — 1:1, satu komposisi berbeda per kategori supaya kartu bisa
 * dibedakan sekilas tanpa membaca judulnya.
 * ========================================================================== */
const S = 640; // sisi kotak 1:1

const serviceArt = {
  /** Pemeriksaan umum: lingkaran fokus + kepala kucing di titik pusat. */
  "pemeriksaan-umum": () => `
    <rect width="${S}" height="${S}" fill="url(#g-pemeriksaan-umum)"/>
    <circle cx="${S * 0.5}" cy="${S * 0.54}" r="176" fill="none" stroke="${C.accentMid}" stroke-width="2" opacity="0.55"/>
    <circle cx="${S * 0.5}" cy="${S * 0.54}" r="222" fill="none" stroke="${C.accentMid}" stroke-width="2" opacity="0.34"/>
    <circle cx="${S * 0.5}" cy="${S * 0.54}" r="268" fill="none" stroke="${C.accentMid}" stroke-width="2" opacity="0.18"/>
    <circle cx="${S * 0.5}" cy="${S * 0.54}" r="118" fill="${C.surface}"/>
    ${catHead(S * 0.5, S * 0.54, 62, "url(#a-pemeriksaan-umum)")}
    <circle cx="${S * 0.5}" cy="${S * 0.54}" r="118" fill="none" stroke="${C.accent}" stroke-width="2.5"/>
    <line x1="${S * 0.5}" y1="${S * 0.54 - 160}" x2="${S * 0.5}" y2="${S * 0.54 - 132}" stroke="${C.accent}" stroke-width="3" stroke-linecap="round"/>
    <line x1="${S * 0.5}" y1="${S * 0.54 + 132}" x2="${S * 0.5}" y2="${S * 0.54 + 160}" stroke="${C.accent}" stroke-width="3" stroke-linecap="round"/>
    <line x1="${S * 0.5 - 160}" y1="${S * 0.54}" x2="${S * 0.5 - 132}" y2="${S * 0.54}" stroke="${C.accent}" stroke-width="3" stroke-linecap="round"/>
    <line x1="${S * 0.5 + 132}" y1="${S * 0.54}" x2="${S * 0.5 + 160}" y2="${S * 0.54}" stroke="${C.accent}" stroke-width="3" stroke-linecap="round"/>`,

  /** Vaksinasi: perisai. Sengaja TIDAK menggambar jarum suntik. */
  vaksinasi: () => `
    <rect width="${S}" height="${S}" fill="${C.sunken}"/>
    <path d="M ${S * 0.5} 118 L ${S * 0.5 + 138} 186 L ${S * 0.5 + 138} 352
             Q ${S * 0.5 + 138} 466 ${S * 0.5} 522
             Q ${S * 0.5 - 138} 466 ${S * 0.5 - 138} 352
             L ${S * 0.5 - 138} 186 Z" fill="url(#a-vaksinasi)"/>
    <path d="M ${S * 0.5} 158 L ${S * 0.5 + 104} 210 L ${S * 0.5 + 104} 348
             Q ${S * 0.5 + 104} 434 ${S * 0.5} 480
             Q ${S * 0.5 - 104} 434 ${S * 0.5 - 104} 348
             L ${S * 0.5 - 104} 210 Z" fill="none" stroke="${C.accentSoft}" stroke-width="2.5" opacity="0.75"/>
    ${paw(S * 0.5, S * 0.52, 56, C.accentSoft)}`,

  /** Sterilisasi: dua cincin bertaut. */
  sterilisasi: () => `
    <rect width="${S}" height="${S}" fill="url(#g-sterilisasi)"/>
    <circle cx="${S * 0.39}" cy="${S * 0.5}" r="126" fill="none" stroke="${C.accent}" stroke-width="20"/>
    <circle cx="${S * 0.61}" cy="${S * 0.5}" r="126" fill="none" stroke="${C.accentMid}" stroke-width="20"/>
    <circle cx="${S * 0.39}" cy="${S * 0.5}" r="126" fill="none" stroke="${C.accent}" stroke-width="20"
      stroke-dasharray="120 700" stroke-dashoffset="-58"/>
    <circle cx="${S * 0.5}" cy="${S * 0.5}" r="26" fill="${C.surface}"/>`,

  /** Bedah: kisi presisi + satu lengkung tunggal. */
  bedah: () => {
    const lines = [];
    for (let i = 1; i < 8; i++) {
      const p = (i / 8) * S;
      lines.push(
        `<line x1="${n(p)}" y1="96" x2="${n(p)}" y2="${S - 96}" stroke="#C7C0B2" stroke-width="1.4"/>`,
        `<line x1="96" y1="${n(p)}" x2="${S - 96}" y2="${n(p)}" stroke="#C7C0B2" stroke-width="1.4"/>`
      );
    }
    return `
    <rect width="${S}" height="${S}" fill="${C.surface}"/>
    ${lines.join("")}
    <rect x="96" y="96" width="${S - 192}" height="${S - 192}" fill="none" stroke="${C.accent}" stroke-width="2.5"/>
    <path d="M 96 ${S * 0.66} Q ${S * 0.32} ${S * 0.2} ${S * 0.5} ${S * 0.5}
             T ${S - 96} ${S * 0.34}" fill="none" stroke="url(#a-bedah)" stroke-width="16" stroke-linecap="round"/>
    <circle cx="${S * 0.5}" cy="${S * 0.5}" r="15" fill="${C.accent}"/>`;
  },

  /** Grooming: sisir sebagai garis sejajar + gelembung. */
  grooming: (r) => {
    const teeth = [];
    for (let i = 0; i < 9; i++) {
      const x = S * 0.24 + i * ((S * 0.52) / 8);
      teeth.push(
        `<line x1="${n(x)}" y1="${S * 0.42}" x2="${n(x)}" y2="${n(S * 0.66 + r() * 18)}" stroke="${C.accent}" stroke-width="9" stroke-linecap="round"/>`
      );
    }
    const bubbles = [];
    for (let i = 0; i < 7; i++) {
      bubbles.push(
        `<circle cx="${n(70 + r() * (S - 140))}" cy="${n(70 + r() * 190)}" r="${n(10 + r() * 24)}" fill="none" stroke="${C.accentMid}" stroke-width="2.5"/>`
      );
    }
    return `
    <rect width="${S}" height="${S}" fill="url(#g-grooming)"/>
    ${bubbles.join("")}
    <rect x="${S * 0.2}" y="${S * 0.3}" width="${S * 0.6}" height="${S * 0.14}" rx="${S * 0.07}" fill="url(#a-grooming)"/>
    ${teeth.join("")}
    ${dogHead(S * 0.5, S * 0.83, 52, C.accent, 0.16)}`;
  },

  /** Rawat inap: lengkung pelindung + kepala anjing yang tenang. */
  "rawat-inap": (r) => `
    <rect width="${S}" height="${S}" fill="${C.sunken}"/>
    ${arcs(S * 0.5, S * 0.78, 5, 40, 120, Math.PI, C.accentMid, 2, r)}
    <path d="M 132 ${S * 0.78} A 188 188 0 0 1 508 ${S * 0.78} Z" fill="url(#a-rawat-inap)"/>
    <path d="M 132 ${S * 0.78} L 508 ${S * 0.78}" stroke="${C.accent}" stroke-width="5" stroke-linecap="round"/>
    ${dogHead(S * 0.5, S * 0.64, 62, C.bg)}`,

  /** Penitipan: lengkung bersarang + jejak kaki. */
  penitipan: () => `
    <rect width="${S}" height="${S}" fill="url(#g-penitipan)"/>
    <path d="M 108 ${S - 118} L 108 ${S * 0.46} A 212 212 0 0 1 532 ${S * 0.46} L 532 ${S - 118} Z"
      fill="none" stroke="${C.accent}" stroke-width="18" stroke-linejoin="round"/>
    <path d="M 190 ${S - 118} L 190 ${S * 0.53} A 130 130 0 0 1 450 ${S * 0.53} L 450 ${S - 118} Z"
      fill="${C.surface}"/>
    ${paw(S * 0.5, S * 0.6, 62, C.accent)}`,
};

/* =============================================================================
 * KOMPOSISI 16:9
 * ========================================================================== */
const W = 1600;
const H = 900;

/** Hero: lanskap tenang dari busur konsentris, tanpa apa pun yang menyerupai foto. */
function heroArt() {
  const r = rng("hero");
  const rings = [];
  for (let i = 0; i < 9; i++) {
    const rad = 180 + i * 92;
    rings.push(
      `<circle cx="${W * 0.74}" cy="${H * 1.02}" r="${rad}" fill="none" stroke="${i % 2 ? C.line : C.accentMid}" stroke-width="${i % 2 ? 1.5 : 2.5}" opacity="${n(0.85 - i * 0.075)}"/>`
    );
  }
  const dots = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI * 0.86 + r() * Math.PI * 0.7;
    const rad = 272 + Math.floor(r() * 5) * 92;
    dots.push(
      `<circle cx="${n(W * 0.74 + Math.cos(a) * rad)}" cy="${n(H * 1.02 + Math.sin(a) * rad)}" r="7" fill="${C.accent}" opacity="0.5"/>`
    );
  }
  return `
    <rect width="${W}" height="${H}" fill="${C.bg}"/>
    <path d="M 0 ${H} L 0 ${H * 0.52} Q ${W * 0.3} ${H * 0.3} ${W * 0.62} ${H * 0.52} T ${W} ${H * 0.42} L ${W} ${H} Z" fill="${C.accentSoft}" opacity="0.55"/>
    ${rings.join("")}
    ${dots.join("")}
    <circle cx="${W * 0.74}" cy="${H * 1.02}" r="180" fill="url(#a-hero)"/>
    ${paw(W * 0.74, H * 0.9, 74, C.accentSoft)}
    ${catHead(W * 0.235, H * 0.6, 66, C.accent, 0.14)}
    ${dogHead(W * 0.4, H * 0.72, 54, C.accent, 0.1)}`;
}

/** Lokasi: peta abstrak — grid jalan + satu penanda. Bukan peta sungguhan. */
function locationArt() {
  const r = rng("lokasi");
  const roads = [];
  for (let i = 0; i < 6; i++) {
    const y = 110 + i * 140 + r() * 30;
    roads.push(
      `<line x1="0" y1="${n(y)}" x2="${W}" y2="${n(y - 40 + r() * 80)}" stroke="#CFC7B8" stroke-width="${i === 3 ? 18 : 8}" stroke-linecap="round"/>`
    );
  }
  for (let i = 0; i < 7; i++) {
    const x = 120 + i * 220 + r() * 50;
    roads.push(
      `<line x1="${n(x)}" y1="0" x2="${n(x + 30 - r() * 60)}" y2="${H}" stroke="#CFC7B8" stroke-width="${i === 4 ? 16 : 7}" stroke-linecap="round"/>`
    );
  }
  const blocks = [];
  for (let i = 0; i < 9; i++) {
    blocks.push(
      `<rect x="${n(60 + r() * (W - 260))}" y="${n(60 + r() * (H - 220))}" width="${n(70 + r() * 130)}" height="${n(55 + r() * 90)}" rx="10" fill="#E4DED2"/>`
    );
  }
  const px = W * 0.53;
  const py = H * 0.46;
  return `
    <rect width="${W}" height="${H}" fill="${C.bg}"/>
    ${blocks.join("")}
    ${roads.join("")}
    <circle cx="${px}" cy="${py}" r="132" fill="${C.accentSoft}" opacity="0.65"/>
    <circle cx="${px}" cy="${py}" r="132" fill="none" stroke="${C.accent}" stroke-width="2.5"/>
    <path d="M ${px} ${py - 76} a 52 52 0 0 1 52 52 c 0 38 -52 90 -52 90 s -52 -52 -52 -90 a 52 52 0 0 1 52 -52 Z" fill="url(#a-lokasi)"/>
    <circle cx="${px}" cy="${py - 24}" r="19" fill="${C.bg}"/>`;
}

/** Janji temu: kisi kalender + slot terpilih. */
function bookingArt() {
  const cells = [];
  const cols = 7;
  const rows = 4;
  const cw = 150;
  const ch = 132;
  const ox = (W - cols * cw) / 2;
  const oy = (H - rows * ch) / 2 + 20;
  const r = rng("janji-temu");
  let picked = -1;
  const list = [];
  for (let i = 0; i < cols * rows; i++) list.push(i);
  picked = list[Math.floor(r() * list.length)];
  for (let i = 0; i < cols * rows; i++) {
    const x = ox + (i % cols) * cw;
    const y = oy + Math.floor(i / cols) * ch;
    const on = i === picked;
    cells.push(
      `<rect x="${n(x + 8)}" y="${n(y + 8)}" width="${cw - 16}" height="${ch - 16}" rx="16"
        fill="${on ? C.accent : C.surface}" stroke="${on ? C.accent : C.line}" stroke-width="2"/>` +
        (on
          ? `<path d="M ${n(x + cw / 2 - 26)} ${n(y + ch / 2)} l 18 20 l 34 -42" fill="none" stroke="${C.bg}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`
          : `<line x1="${n(x + 32)}" y1="${n(y + ch / 2)}" x2="${n(x + cw - 32)}" y2="${n(y + ch / 2)}" stroke="${C.line}" stroke-width="5" stroke-linecap="round"/>`)
    );
  }
  return `
    <rect width="${W}" height="${H}" fill="${C.sunken}"/>
    <rect x="${ox - 4}" y="${oy - 74}" width="${cols * cw + 8}" height="52" rx="26" fill="${C.accentSoft}"/>
    ${cells.join("")}`;
}

/** Kontak: gelombang percakapan yang tenang. */
function contactArt() {
  const r = rng("kontak");
  const waves = [];
  for (let i = 0; i < 7; i++) {
    const y = H * 0.5 + (i - 3) * 108;
    const amp = 72 + r() * 58;
    waves.push(
      `<path d="M -40 ${n(y)} Q ${W * 0.25} ${n(y - amp)} ${W * 0.5} ${n(y)} T ${W + 40} ${n(y)}"
        fill="none" stroke="${i === 3 ? C.accent : C.accentMid}" stroke-width="${i === 3 ? 9 : 4}"
        opacity="${i === 3 ? 1 : n(0.8 - Math.abs(i - 3) * 0.16)}" stroke-linecap="round"/>`
    );
  }
  return `
    <rect width="${W}" height="${H}" fill="${C.bg}"/>
    ${waves.join("")}
    <circle cx="${W * 0.5}" cy="${H * 0.5}" r="112" fill="${C.bg}"/>
    <circle cx="${W * 0.5}" cy="${H * 0.5}" r="90" fill="url(#a-kontak)"/>
    ${paw(W * 0.5, H * 0.5, 46, C.accentSoft)}`;
}

/* =============================================================================
 * WORDMARK, IKON SITUS, OG IMAGE
 * ========================================================================== */

/** Tanda gambar: kepala kucing + telinga, dipakai sebagai lambang klinik. */
function markGlyph(cx, cy, r, fill) {
  return `<g>
    ${catHead(cx, cy, r, fill)}
    <circle cx="${n(cx - r * 0.33)}" cy="${n(cy - r * 0.06)}" r="${n(r * 0.108)}" fill="${C.bg}"/>
    <circle cx="${n(cx + r * 0.33)}" cy="${n(cy - r * 0.06)}" r="${n(r * 0.108)}" fill="${C.bg}"/>
    <path d="M ${n(cx - r * 0.2)} ${n(cy + r * 0.34)} q ${n(r * 0.2)} ${n(r * 0.2)} ${n(r * 0.4)} 0"
      fill="none" stroke="${C.bg}" stroke-width="${n(r * 0.1)}" stroke-linecap="round"/>
  </g>`;
}

/** Site icon: latar TRANSPARAN, tanpa kotak warna di belakangnya. */
function siteIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <g>
    <path d="M 116 216 L 148 74 L 262 156 Z" fill="${C.accent}"/>
    <path d="M 396 216 L 364 74 L 250 156 Z" fill="${C.accent}"/>
    <circle cx="256" cy="300" r="168" fill="${C.accent}"/>
    <circle cx="200" cy="284" r="19" fill="#F6F4EF"/>
    <circle cx="312" cy="284" r="19" fill="#F6F4EF"/>
    <path d="M 220 352 q 36 34 72 0" fill="none" stroke="#F6F4EF" stroke-width="17" stroke-linecap="round"/>
  </g>
</svg>`;
}

/** OG image 16:9 memakai wordmark klien. Tidak ada foto stok. */
function ogImage() {
  const w = 1200;
  const h = 675;
  const rings = [];
  for (let i = 0; i < 7; i++) {
    rings.push(
      `<circle cx="${w * 0.86}" cy="${h * 1.08}" r="${170 + i * 78}" fill="none" stroke="${C.accentMid}" stroke-width="2" opacity="${n(0.5 - i * 0.055)}"/>`
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="${C.bg}"/>
  <path d="M 0 ${h} L 0 ${h * 0.6} Q ${w * 0.34} ${h * 0.44} ${w} ${h * 0.66} L ${w} ${h} Z" fill="${C.accentSoft}" opacity="0.55"/>
  ${rings.join("")}
  ${markGlyph(126, 128, 58, C.accent)}
  <text x="96" y="330" font-family="Archivo, Arial, sans-serif" font-size="82" font-weight="700" fill="${C.ink}" letter-spacing="-2.5">Klinik Hewan</text>
  <text x="96" y="424" font-family="Archivo, Arial, sans-serif" font-size="82" font-weight="700" fill="${C.accent}" letter-spacing="-2.5">Kalimutu</text>
  <rect x="96" y="470" width="76" height="5" rx="3" fill="${C.accent}"/>
  <text x="96" y="536" font-family="Arial, sans-serif" font-size="30" fill="${C.ink}" opacity="0.72">Denpasar Barat, Bali</text>
</svg>`;
}

/* =============================================================================
 * TULIS FILE
 * ========================================================================== */
async function run() {
  await mkdir(OUT, { recursive: true });
  const written = [];

  for (const [key, fn] of Object.entries(serviceArt)) {
    const body = fn(rng("svc-" + key));
    await writeFile(join(OUT, `layanan-${key}.svg`), svg(S, S, key, body));
    written.push(`layanan-${key}.svg  1:1`);
  }

  const wide = {
    hero: heroArt,
    lokasi: locationArt,
    "janji-temu": bookingArt,
    kontak: contactArt,
  };
  for (const [key, fn] of Object.entries(wide)) {
    await writeFile(join(OUT, `${key}.svg`), svg(W, H, key, fn()));
    written.push(`${key}.svg  16:9`);
  }

  await writeFile(join(process.cwd(), "public", "icon.svg"), siteIcon());
  written.push("icon.svg  transparan");

  await writeFile(join(process.cwd(), "public", "og.svg"), ogImage());
  written.push("og.svg  16:9");

  console.log("Gambar dibuat ulang:\n  " + written.join("\n  "));
}

run();
