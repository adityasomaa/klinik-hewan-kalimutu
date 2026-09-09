import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { clinic } from "@/data/clinic";

/**
 * OG image.
 *
 * Dibuat sebagai PNG, bukan SVG: WhatsApp, Facebook, dan LinkedIn tidak
 * merender SVG sebagai gambar pratinjau tautan. Karena situs ini paling sering
 * dibagikan lewat WhatsApp, ini bukan detail kecil.
 *
 * Memakai wordmark klien, tanpa foto stok. Font Archivo dimuat dari
 * src/assets (tidak ikut ke peramban pengunjung, hanya dipakai saat render).
 *
 * Catatan: rute ini TIDAK melewati Vercel Image Optimization, jadi tidak
 * terpengaruh kuota yang sudah habis di akun ini.
 */

export const runtime = "nodejs";
export const alt = `${clinic.name} — klinik hewan di Denpasar Barat`;
export const size = { width: 1200, height: 675 }; // 16:9
export const contentType = "image/png";

const C = {
  bg: "#F6F4EF",
  ink: "#111E1A",
  accent: "#0E5C46",
  accentSoft: "#DFEDE7",
  accentMid: "#7FAE9C",
};

export default async function Image() {
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/archivo-regular.ttf")),
    readFile(join(process.cwd(), "src/assets/archivo-bold.ttf")),
  ]);

  const rings = Array.from({ length: 7 }, (_, i) => (
    <div
      key={i}
      style={{
        position: "absolute",
        right: -260 - i * 6,
        bottom: -320 - i * 6,
        width: 340 + i * 156,
        height: 340 + i * 156,
        borderRadius: 9999,
        border: `2px solid ${C.accentMid}`,
        opacity: 0.5 - i * 0.055,
      }}
    />
  ));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: C.bg,
          position: "relative",
          padding: "0 96px",
          fontFamily: "Archivo",
        }}
      >
        {/* Lengkung latar yang tenang. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: 1200,
            height: 300,
            background: C.accentSoft,
            opacity: 0.55,
            borderTopRightRadius: 600,
          }}
        />
        {rings}

        {/* Lambang klinik. */}
        <div style={{ display: "flex", marginBottom: 34 }}>
          <svg width="104" height="104" viewBox="0 0 512 512">
            <path d="M 116 216 L 148 74 L 262 156 Z" fill={C.accent} />
            <path d="M 396 216 L 364 74 L 250 156 Z" fill={C.accent} />
            <circle cx="256" cy="300" r="168" fill={C.accent} />
            <circle cx="200" cy="284" r="19" fill={C.bg} />
            <circle cx="312" cy="284" r="19" fill={C.bg} />
            <path
              d="M 220 352 q 36 34 72 0"
              fill="none"
              stroke={C.bg}
              strokeWidth="17"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 82,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.06,
          }}
        >
          <span style={{ color: C.ink }}>Klinik Hewan</span>
          <span style={{ color: C.accent }}>Kalimutu</span>
        </div>

        <div
          style={{
            width: 78,
            height: 5,
            borderRadius: 3,
            background: C.accent,
            margin: "34px 0 26px",
          }}
        />

        <div style={{ fontSize: 30, color: C.ink, opacity: 0.74, display: "flex" }}>
          Denpasar Barat, Bali · Anjing dan kucing
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: regular, weight: 400, style: "normal" },
        { name: "Archivo", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
