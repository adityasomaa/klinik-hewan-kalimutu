/**
 * Validasi janji temu di SISI SERVER.
 *
 * Validasi di browser hanya untuk kenyamanan dan bisa dilewati siapa pun dengan
 * mengirim permintaan langsung ke endpoint ini. Karena itu setiap field
 * divalidasi ulang di sini memakai aturan yang sama persis (src/lib/validation).
 *
 * Yang TIDAK dapat divalidasi di sini: apakah sebuah slot sudah dipesan orang
 * lain. Selama belum ada basis data, daftar pemesanan hanya ada di peramban
 * masing-masing pengunjung. Begitu backend disambungkan lewat `serverStore` di
 * src/lib/store.ts, ambil daftar slot terpakai di sini dan teruskan ke
 * validateAppointment sebagai `taken` — sisanya tidak perlu diubah.
 *
 * Endpoint ini tidak menyimpan isi permintaan.
 */

import { NextResponse } from "next/server";
import { validateAppointment } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -----------------------------------------------------------------------------
 * Pembatasan laju sederhana.
 *
 * Disimpan di memori proses, jadi tidak berlaku lintas instance serverless.
 * Ini penghalang untuk penyalahgunaan kasar, bukan pengaman kuat. Saat backend
 * sungguhan disambungkan, ganti dengan pembatas berbasis penyimpanan bersama.
 * -------------------------------------------------------------------------- */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(key, list);

  // Jaga peta tidak tumbuh tanpa batas.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return list.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Terlalu banyak permintaan. Coba lagi sebentar lagi." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Permintaan tidak dapat dibaca." },
      { status: 400 }
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { ok: false, message: "Permintaan tidak dapat dibaca." },
      { status: 400 }
    );
  }

  const result = validateAppointment(body as Record<string, unknown>);

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        errors: result.errors,
        message: "Beberapa isian perlu diperbaiki.",
      },
      { status: 422 }
    );
  }

  // Sengaja tidak mengembalikan isi permintaan: tidak ada gunanya memantulkan
  // data pribadi kembali ke jaringan.
  return NextResponse.json({ ok: true }, { status: 200 });
}

/** Metode selain POST ditolak dengan jelas. */
export async function GET() {
  return NextResponse.json({ ok: false, message: "Metode tidak diizinkan." }, {
    status: 405,
    headers: { Allow: "POST" },
  });
}
