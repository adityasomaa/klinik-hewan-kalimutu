/**
 * Unduh font variabel dari Google Fonts (subset latin + latin-ext) sebagai WOFF2
 * lalu simpan ke public/fonts untuk di-self-host.
 *
 * Kedua font berlisensi SIL Open Font License 1.1 -> boleh dipakai di web.
 *   - Archivo        (Omnibus-Type)  : display / heading. Punya sumbu wdth.
 *   - Plus Jakarta Sans (Tokotype)   : body / UI.
 *
 * Jalankan: npm run gen:fonts
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

const FACES = [
  {
    file: "archivo-variable.woff2",
    css: "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap",
  },
  {
    file: "plus-jakarta-sans-variable.woff2",
    css: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap",
  },
];

const OUT = join(process.cwd(), "public", "fonts");

async function run() {
  await mkdir(OUT, { recursive: true });
  for (const face of FACES) {
    const css = await (await fetch(face.css, { headers: { "User-Agent": UA } })).text();
    // Ambil blok latin (bukan latin-ext/vietnamese) supaya file sekecil mungkin.
    const blocks = css.split("@font-face");
    let url = null;
    for (const b of blocks) {
      if (/unicode-range:\s*U\+0000-00FF/.test(b)) {
        const m = b.match(/url\((https:\/\/[^)]+\.woff2)\)/);
        if (m) { url = m[1]; break; }
      }
    }
    if (!url) {
      const m = css.match(/url\((https:\/\/[^)]+\.woff2)\)/);
      url = m && m[1];
    }
    if (!url) throw new Error("woff2 tidak ditemukan untuk " + face.file);
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    await writeFile(join(OUT, face.file), buf);
    console.log(`${face.file}  ${(buf.length / 1024).toFixed(1)} KB  <- ${url}`);
  }
}
run();
