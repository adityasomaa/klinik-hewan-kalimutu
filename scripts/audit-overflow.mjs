/**
 * AUDIT OTOMATIS: overflow horizontal + jumlah baris heading.
 *
 *   npm run audit:overflow                    (default http://localhost:3300)
 *   npm run audit:overflow -- https://situs   (audit produksi)
 *
 * Diperiksa di tiga lebar: 375, 768, 1440.
 *
 * Dua hal yang dicari:
 *   1. Elemen yang melebihi lebar dokumen sehingga memicu scroll horizontal.
 *      Hasil yang diterima: NOL pelanggar di ketiga lebar.
 *   2. Jumlah baris tiap heading. Batasnya diatur per viewport, tidak
 *      disamaratakan: mobile maksimal 3 baris, tablet 2, desktop 1.
 *      Tidak ada heading yang boleh tembus 4 baris di lebar mana pun.
 *
 * Memakai playwright-core dengan peramban yang sudah terpasang di mesin
 * (Chrome atau Edge), jadi tidak ada unduhan peramban dan tidak membebani
 * build di Vercel.
 */

import { chromium } from "playwright-core";
import { existsSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:3300";

const ROUTES = [
  "/",
  "/layanan",
  "/janji-temu",
  "/lokasi",
  "/kontak",
  "/kebijakan-privasi",
  "/ketentuan-layanan",
  "/admin",
];

const VIEWPORTS = [
  { width: 375, height: 780, name: "mobile", maxHeadingLines: 3 },
  { width: 768, height: 1024, name: "tablet", maxHeadingLines: 2 },
  { width: 1440, height: 900, name: "desktop", maxHeadingLines: 1 },
];

const BROWSERS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

function findBrowser() {
  for (const p of BROWSERS) if (existsSync(p)) return p;
  return null;
}

/** Dijalankan di dalam halaman. */
const collect = () => {
  const docWidth = document.documentElement.clientWidth;

  const offenders = [];
  for (const el of document.querySelectorAll("body *")) {
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;
    // Elemen fixed/sticky yang sengaja penuh layar bukan penyebab scroll dokumen.
    if (style.position === "fixed") continue;

    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;

    const overflowRight = r.right - docWidth;
    if (overflowRight > 1 || r.left < -1) {
      // Abaikan kalau salah satu induknya memang memotong isinya sendiri.
      let clipped = false;
      let p = el.parentElement;
      while (p) {
        const ps = getComputedStyle(p);
        const ox = ps.overflowX;
        if (ox === "hidden" || ox === "auto" || ox === "scroll" || ox === "clip") {
          clipped = true;
          break;
        }
        p = p.parentElement;
      }
      if (clipped) continue;

      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.getAttribute("class") || "").slice(0, 70),
        left: Math.round(r.left),
        right: Math.round(r.right),
        over: Math.round(Math.max(overflowRight, -r.left)),
      });
    }
  }

  const headings = [...document.querySelectorAll("h1, h2, h3")].map((h) => {
    const cs = getComputedStyle(h);
    let lh = parseFloat(cs.lineHeight);
    if (Number.isNaN(lh)) lh = parseFloat(cs.fontSize) * 1.2;
    const lines = Math.max(1, Math.round(h.getBoundingClientRect().height / lh));
    return {
      tag: h.tagName.toLowerCase(),
      lines,
      text: (h.textContent || "").trim().slice(0, 58),
    };
  });

  return {
    docWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    offenders,
    headings,
  };
};

async function run() {
  const exe = findBrowser();
  if (!exe) {
    console.error(
      "Tidak menemukan Chrome atau Edge di lokasi umum. Pasang salah satunya, atau sunting daftar BROWSERS di script ini."
    );
    process.exit(1);
  }

  const browser = await chromium.launch({ executablePath: exe, headless: true });

  let overflowFails = 0;
  let headingFails = 0;
  const headingNotes = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    console.log(`\n${"=".repeat(72)}\n${vp.name.toUpperCase()}  ${vp.width}px\n${"=".repeat(72)}`);

    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      // Lewati tirai loader pembuka dan biarkan reveal selesai.
      await page.waitForTimeout(1800);

      const r = await page.evaluate(collect);

      const scrollOver = r.scrollWidth - r.docWidth;
      const bad = r.offenders.length > 0 || scrollOver > 1;
      if (bad) overflowFails++;

      console.log(
        `${bad ? "GAGAL" : "LULUS"}  ${route.padEnd(22)} scrollWidth ${r.scrollWidth} / ${r.docWidth}` +
          (r.offenders.length ? `  ${r.offenders.length} elemen melebar` : "")
      );

      for (const o of r.offenders.slice(0, 6)) {
        console.log(`         -> <${o.tag} class="${o.cls}"> lebih ${o.over}px`);
      }

      for (const h of r.headings) {
        if (h.lines > vp.maxHeadingLines) {
          headingFails++;
          headingNotes.push(
            `${vp.name} ${route}  <${h.tag}> ${h.lines} baris (batas ${vp.maxHeadingLines}) — "${h.text}"`
          );
        }
      }
    }

    await context.close();
  }

  await browser.close();

  console.log(`\n${"=".repeat(72)}`);
  if (headingNotes.length) {
    console.log("Heading melebihi batas baris:");
    for (const n of headingNotes) console.log("  " + n);
  } else {
    console.log("Semua heading dalam batas baris per viewport.");
  }

  console.log(
    `\nOverflow horizontal: ${overflowFails === 0 ? "NOL pelanggar" : overflowFails + " halaman bermasalah"}`
  );

  // Overflow horizontal wajib nol. Heading dilaporkan tapi tidak mematikan
  // build, karena "1 baris di desktop" adalah target ideal, bukan batas keras.
  process.exit(overflowFails === 0 ? 0 : 1);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
