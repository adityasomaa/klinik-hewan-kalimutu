# Klinik Hewan Kalimutu

Website untuk Klinik Hewan Kalimutu, klinik hewan di Jalan Gunung Kalimutu XIX,
Pemecutan Klod, Denpasar Barat, Bali.

Dibangun dari nol. Tidak ada kode, komponen, aset, atau konfigurasi yang disalin
dari project klien lain.

- **Produksi:** https://klinik-hewan-kalimutu.onyxcreative.asia
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4
- **Hosting:** Vercel

---

## Daftar isi

1. [Prinsip utama: apa yang boleh dan tidak boleh ditulis](#1-prinsip-utama)
2. [Verifikasi klien](#2-verifikasi-klien)
3. [Yang belum dikonfirmasi klien](#3-yang-belum-dikonfirmasi-klien)
4. [Riset referensi](#4-riset-referensi)
5. [Keputusan desain](#5-keputusan-desain)
6. [Apa yang nyata dan apa yang masih lokal](#6-apa-yang-nyata-dan-apa-yang-masih-lokal)
7. [Menjalankan project](#7-menjalankan-project)
8. [Struktur project](#8-struktur-project)
9. [Cara mengubah isi situs](#9-cara-mengubah-isi-situs)
10. [Verifikasi yang sudah dijalankan](#10-verifikasi-yang-sudah-dijalankan)
11. [Yang bisa ditambahkan nanti](#11-yang-bisa-ditambahkan-nanti)

---

## 1. Prinsip utama

Ini kategori medis. Satu kalimat yang salah bisa membuat orang menunda membawa
hewannya, atau datang ke klinik yang sedang tutup.

Aturan yang dipegang seluruh codebase:

> Kalau ragu antara menulis sesuatu atau mengosongkannya, **kosongkan**.

Wujudnya di kode: nilai `null` dan array kosong di `src/data/clinic.ts` berarti
"belum dikonfirmasi", dan komponen yang bersangkutan **menyembunyikan dirinya
sepenuhnya** — bukan menampilkan tebakan, bukan menampilkan bagian kosong yang
menggantung.

Yang **tidak ada** di situs ini, dan tidak boleh ditambahkan tanpa konfirmasi
tertulis dari klinik:

- harga apa pun, termasuk frasa "mulai dari"
- nama dokter hewan, gelar, nomor STRV/SIP, sertifikasi
- klaim fasilitas (USG, rontgen, laboratorium, ruang operasi, kandang rawat inap)
- jam buka 24 jam atau layanan panggilan darurat
- jenis hewan selain anjing dan kucing
- rating, jumlah ulasan, jumlah pasien, tahun berdiri, testimoni
- klaim "terbaik" / "terlengkap" / "nomor satu"
- janji kesembuhan, jaminan keselamatan, atau kata "aman"/"tanpa risiko"
- saran medis, dosis, jadwal vaksin, atau cara menangani gejala
- artikel kesehatan hewan yang isinya dikarang sendiri

Daftar gejala di form janji temu **bukan alat diagnosis**. Gejala hanya
dikumpulkan lalu diteruskan apa adanya ke klinik. Tidak ada pemetaan gejala ke
penyakit, ke tingkat kegawatan, maupun ke saran tindakan — dan jangan pernah
ditambahkan.

---

## 2. Verifikasi klien

Dilakukan 8 September 2026, sebelum satu baris kode pun ditulis.

### Apakah mereka sudah punya website?

**Belum.** Diverifikasi langsung di listing Google Maps mereka: panel bisnisnya
menampilkan tombol **"Tambahkan situs web"**, yang hanya muncul kalau kolom
website memang kosong. Diperiksa juga lewat DOM listing tersebut — tidak ada
elemen `a[data-item-id="authority"]` (tautan website resmi) dan tidak ada satu
pun tautan keluar non-Google di panelnya.

Pencarian nama usaha di mesin pencari hanya memunculkan direktori pihak ketiga
(dilokasi.com, alamatindonesia.com, idalamat.com, polomap.com, 2pos.asia) dan
artikel listicle — tidak ada domain milik klinik sendiri.

### Sosial media

**Tidak ditemukan** akun Instagram atau Facebook yang bisa dipastikan milik
klinik. Karena itu **tidak ada satu pun tautan sosial media di situs**, dan
`contact.social` di config sengaja dibiarkan array kosong. Kalau nanti ditemukan
akun resminya, isi array itu dan blok sosial media akan muncul sendiri di footer
dan halaman kontak.

Konsekuensinya: **klinik belum punya logo**, jadi site icon dan OG image memakai
wordmark dan lambang yang dibuat untuk project ini.

### Data yang dipakai, dan dari mana asalnya

| Data | Nilai | Sumber |
|---|---|---|
| Nomor WhatsApp / telepon | 0812-3984-465 | Diberikan langsung oleh klien; cocok dengan yang tertera di listing Google Maps resmi klinik |
| Alamat | Jl. Gn. Kalimutu XIX No.36, Pemecutan Klod, Kec. Denpasar Barat, Kota Denpasar, Bali 80113 | Panel listing Google Maps klinik |
| Plus code | 86H2+73 Pemecutan Klod, Kota Denpasar, Bali | Panel listing Google Maps klinik |

Tidak ada data yang diambil dari direktori pihak ketiga. Alasannya konkret,
bukan kehati-hatian abstrak — lihat bagian jam operasional di bawah.

---

## 3. Yang belum dikonfirmasi klien

Semuanya ada slotnya di `src/data/clinic.ts` dengan penanda `>>> ISI DI SINI`.

### Jam operasional — ini yang paling penting

**Belum diisi. Semua hari bernilai `null`.**

Selama begitu, indikator "Buka sekarang / Tutup" **tidak ditampilkan di mana
pun**, dan `openingHoursSpecification` **tidak dimasukkan** ke structured data.

Kenapa dikosongkan, padahal ada datanya di internet:

- Listing Google Maps klinik (tanpa login) hanya membuka jadwal hari itu saja.
  Pada 8 September 2026 tertulis **Selasa 09.00–20.00**. Enam hari lainnya tidak
  bisa dilihat.
- Direktori pihak ketiga kompak menyebut **08.00–21.00 setiap hari**. Itu
  **bertentangan** dengan Google Maps di jam buka maupun jam tutup.

Karena kedua sumber bertabrakan dan hanya satu hari yang terverifikasi, seluruh
minggu dibiarkan kosong. Menerbitkan jam yang salah di situs klinik hewan
berisiko membuat orang datang saat klinik tutup — itu kerugian yang lebih besar
daripada tidak menampilkan jam sama sekali.

**Begitu klinik mengonfirmasi:** isi tujuh baris di bagian 3 file config. Tidak
ada perubahan kode lain yang diperlukan. Indikator buka/tutup, tabel jam di
halaman lokasi dan kontak, slot janji temu, dan structured data akan langsung
hidup semuanya.

### Lainnya

| Item | Status | Efek di situs sekarang |
|---|---|---|
| Layanan darurat / 24 jam | `emergency.enabled: false` | Seluruh blok darurat hilang; rute `/darurat` mengembalikan 404 |
| Nama & gelar dokter hewan | `null` | Kartu tim tampil sebagai peran, ditandai "Nama belum dicantumkan" |
| Fasilitas (USG, rontgen, lab, ruang operasi, rawat inap, apotek) | semua `confirmed: false` | Blok fasilitas tidak dirender sama sekali |
| Rawat inap & penitipan | `enabled: false` | Kedua layanan tidak muncul di mana pun, termasuk di pilihan form |
| Jenis hewan selain anjing & kucing | `additional: []` | Ditampilkan sebagai pertanyaan yang diarahkan ke WhatsApp |
| Email resmi | `null` | Tidak ditampilkan |
| Harga | tidak ada di config | Semua layanan diarahkan ke konsultasi WhatsApp |

---

## 4. Riset referensi

Sembilan website klinik hewan nyata dibaca sebelum mendesain — campuran lokal
dan luar negeri, klinik independen dan multi-cabang.

| Situs | Yang diambil |
|---|---|
| [masvetbali.com](https://masvetbali.com/ind) (Canggu, Bali) | Hero paling informatif dari sampel Indonesia: telepon, alamat, jam, WhatsApp, dan tombol janji temu semuanya sebelum scroll. Ini yang jadi acuan utama isi hero. |
| [balivetclinic.com](https://balivetclinic.com) (Bali, 24 jam) | Cara menaikkan jalur darurat ke posisi paling menonjol, dan prinsipnya: kontak darurat selalu `tel:`/WhatsApp langsung, tidak pernah lewat form. |
| [hewania.com](https://hewania.com) (Jakarta, multi-cabang) | Pengelompokan layanan sebagai kartu ber-ikon, dan penempatan CTA booking berulang di beberapa titik halaman. |
| [faunafellacare.co.id](https://faunafellacare.co.id) (Jakarta) | Dipakai sebagai **anti-referensi**: hero carousel-nya tidak punya CTA maupun kontak sama sekali, dan tombol WhatsApp-nya terkubur di footer. Ini yang dihindari. |
| [batterseasquarevets.com](https://batterseasquarevets.com) (London) | Dual CTA di hero — tombol booking berdampingan dengan tombol telepon dan WhatsApp. Nav 20+ item-nya dijadikan anti-referensi. |
| [boldvets.co.uk](https://boldvets.co.uk) (St Helens) | Disiplin menaruh "Out of hours" sebagai item nav sejajar dengan booking, bukan dikubur di submenu. Pola inilah yang ditiru blok darurat kita. |
| [independenthillvet.com](https://independenthillvet.com) (Virginia, AS) | Headline hero yang menjual **ketersediaan** ("Same Day Care Available") alih-alih slogan, dan telepon yang ditulis lengkap sebagai teks, bukan cuma ikon. |
| [chatswoodvet.com.au](https://chatswoodvet.com.au) (Sydney) | Nav pendek dan fokus, plus banner rujukan after-hours dengan nomor lengkap. |
| [ambervet.com](https://ambervet.com) (Singapura) | Pola hybrid Asia: tombol "Book An Appointment" yang eksekusinya ke WhatsApp — persis alur yang paling masuk akal untuk klien ini. |

### Pola yang berulang di ≥6 dari 9 situs, dan diikuti

1. Header sticky berisi nomor telepon dan tombol kontak, di setiap halaman.
2. Dua CTA berdampingan di hero: booking **dan** kanal instan (telepon/WhatsApp).
3. Layanan sebagai grid kartu ber-ikon, 5–9 item, tiap kartu punya link detail.
4. Urutan homepage: hero → layanan → blok booking → lokasi/kontak → footer.
5. Nav inti: Home · Layanan · Booking · Lokasi · Kontak.
6. Floating WhatsApp — muncul di **4 dari 4** situs Asia, **0 dari 4** situs
   UK/US/AU. Untuk klinik Indonesia ini wajib.
7. Jalur darurat selalu ada di tempat yang tidak perlu dicari.

### Pola yang sengaja tidak diikuti, dengan alasannya

- **Mega-nav 20+ item** (Battersea) — melawan tujuan situs ini.
- **Trust anchor "sejak tahun X" / "1000+ hewan"** — muncul di 8 dari 9 situs,
  tapi tidak bisa dipakai di sini karena angkanya belum dikonfirmasi klinik.
  Ruang itu diisi informasi kontak, yang lebih berguna.
- **Section testimoni & Google review** — sama, tidak boleh dikarang.
- **Halaman artikel kesehatan** — 8 dari 9 situs punya, tapi menulisnya sendiri
  berarti mengarang saran medis.
- **Halaman harga** — tarif belum ada.
- **E-commerce, health plan, language switcher** — hanya muncul di 1–2 situs dan
  tidak relevan untuk klinik ini.

### Yang membedakan situs ini dari kesembilannya

**Nol dari 9 situs punya indikator buka/tutup real-time.** Hanya satu (MASVET)
yang bahkan menaruh jam statis di hero. Padahal itu pertanyaan pertama pemilik
hewan yang panik. Fitur itu sudah dibangun penuh di sini dan tinggal menunggu
jam operasional dikonfirmasi.

---

## 5. Keputusan desain

Knob: **DESIGN_VARIANCE 2 · MOTION_INTENSITY 2 · VISUAL_DENSITY 3.**

Alasannya satu: pemilik hewan yang membuka situs ini sering sedang panik. Ukuran
keberhasilan situs ini adalah berapa detik sampai dia tahu harus ke mana dan
menghubungi siapa — bukan seberapa cantik animasinya.

### Warna aksen — hijau `#0E5C46`

Dipilih sendiri untuk bisnis ini, bukan mengulang warna klien lain di Denpasar.

- **Bukan biru-tosca.** Itu warna default kategori klinik hewan dan dipakai
  klinik-klinik pembanding di kota yang sama. Memakainya berarti langsung
  tenggelam di antara mereka.
- **Bukan merah.** Di konteks medis merah membaca sebagai alarm dan darah.
  Untuk orang yang sedang panik, itu menaikkan tegangan, bukan menurunkannya.
- **Hijau tua** membaca sebagai perawatan dan pemulihan tanpa dinginnya biru
  klinis, dan punya kaitan wajar dengan Bali: hijau dedaunan tropis, hangat,
  bukan hijau korporat.
- **Praktis:** cukup gelap untuk lolos AA sebagai teks di latar terang (7,24:1)
  sekaligus menahan teks putih di atasnya (7,96:1) — jadi satu token bisa
  dipakai untuk tautan maupun isi tombol.

Warna kedua, tanah bakar `#983521`, dipakai **hanya** untuk jalur darurat dan
pesan kesalahan. Sengaja bukan merah murni, dengan alasan yang sama.

Latar `#F6F4EF` (putih tulang hangat), bukan putih murni — mengurangi silau di
layar HP dan membuat kartu putih punya kedalaman tanpa perlu bayangan berat.

Seluruh 18 pasangan warna diuji otomatis:

```bash
node scripts/check-contrast.mjs
```

**Wajib dijalankan ulang setiap kali warna aksen diubah.** Script keluar dengan
kode 1 kalau ada pasangan yang gagal.

### Tipografi

Neue Montreal tidak dipakai. Alasannya: font itu berlisensi komersial dari
Pangram Pangram, dan lisensi web-nya belum dipastikan ada. Untuk situs produksi
milik klien, itu risiko yang tidak perlu diambil.

Keduanya di bawah **SIL Open Font License 1.1** — bebas dipakai di web —
dan **di-self-host sebagai WOFF2**. Tidak ada permintaan ke CDN font pihak ketiga.

| Font | Peran | Alasan |
|---|---|---|
| **Archivo** (Omnibus-Type) | Heading | Punya sumbu lebar (`wdth` 62–125). Ini bukan hiasan: sumbu itu dipakai untuk mengatur batas baris heading per breakpoint — heading **menyempit** alih-alih pecah baris di layar sempit, tanpa perlu `<br>` manual yang sama untuk semua ukuran layar. |
| **Plus Jakarta Sans** (Tokotype) | Body & UI | Buatan foundry Jakarta, digambar untuk teks Indonesia dan terbaca rapi di ukuran kecil — penting karena hampir seluruh isi penting situs ini berukuran 15–17px di layar HP. |

Total 115 KB untuk dua font variabel, subset latin. Regenerasi:

```bash
npm run gen:fonts
```

### Batas baris heading

Diatur **per viewport**, bukan disamaratakan: mobile maksimal 3 baris, tablet 2,
desktop 1. Dicapai lewat ukuran font, `max-width`, dan sumbu lebar Archivo yang
berbeda per breakpoint. Diverifikasi otomatis oleh `npm run audit:overflow`.

### Gambar

Semua gambar dibuat dari script sendiri — **tidak ada foto stok, tidak ada
picsum, tidak ada layanan placeholder**:

```bash
npm run gen:art
```

Seed-nya tetap, jadi menjalankan ulang selalu menghasilkan file identik.

Aturan yang dipegang generator:

- **Hanya dua orientasi: 16:9 dan 1:1.** Tidak ada rasio lain, tidak ada potret.
  Rasio dikunci di level komponen (`src/components/Art.tsx`) dan pembungkusnya
  menahan ruang sebelum gambar termuat, jadi layout tidak pernah melompat.
- **Tidak ada grain, noise, film grain, atau tekstur bintik** — di loader maupun
  di bagian mana pun situs. Kedalaman visual dibuat dari gradasi halus, garis,
  bentuk geometris, dan kontras.
- Tidak ada yang berpura-pura jadi foto klinik, foto hewan, atau wajah orang.
- **Tidak pernah menggambar hewan yang sakit, terluka, berdarah, atau diinfus.**
  Itu membuat orang yang sedang panik makin panik.
- Tiap kategori layanan punya komposisi berbeda supaya kartu bisa dibedakan
  sekilas tanpa membaca judulnya.

### Komponen dari componentry.dev

Ditinjau, dan **sebagian besar ditolak** — bukan dipaksa masuk. Katalognya
didominasi efek berat: WebGL Liquid, Dither Prism, Matrix Rain, ASCII Effect,
Particle Typography, Image Trail, Eye Tracking. Semuanya menambah waktu sebelum
orang menemukan tombol kontak, dan sebagian memakai tekstur bintik yang memang
dilarang di project ini.

Yang diambil adalah **polanya, bukan kodenya**: pola tirai transisi halaman dan
reveal berjenjang saat scroll — keduanya ditulis ulang dari nol dengan durasi
yang jauh lebih pendek dan tanpa dependency tambahan.

### Motion

- Dua loader: pembuka (saat situs pertama dibuka) dan tirai transisi antar
  halaman. Keduanya pendek — 680 ms dan 320/420 ms.
- Urutan transisi: halaman menutup → konten berganti → scroll ke atas → halaman
  membuka. Seluruh pergantian konten terjadi saat tirai menutup.
- **Lanjutan sequence tidak pernah digantungkan ke `requestAnimationFrame`
  saja.** rAF berhenti kalau tab dipindah ke belakang, dan tirai akan nyangkut
  selamanya. Setiap penantian frame diadu (race) dengan `setTimeout`, plus ada
  jaring pengaman 3,5 detik.
- Status buka/tutup dan perhitungan slot lewat **selalu** dihitung dari waktu
  nyata di zona waktu klinik, bukan dari akumulasi frame. Tab yang ditinggal
  berjam-jam tetap benar begitu dibuka lagi.
- Grafik hero statis — tidak ada zoom saat discroll.
- Hero memakai `100svh`, bukan `100vh`, supaya tingginya tidak ikut berubah saat
  bilah peramban di HP menyembunyikan diri sewaktu discroll.
- Lenis smooth scroll aktif **hanya** di layar ≥1024px, dan dimatikan di halaman
  admin serta selama kalender/modal/menu terbuka.
- Semua motion hormat pada `prefers-reduced-motion`.

---

## 6. Apa yang nyata dan apa yang masih lokal

Bagian ini sengaja ditulis blak-blakan.

### Nyata

- Seluruh isi situs, navigasi, dan halaman legal.
- Nomor WhatsApp dan telepon — tersambung ke nomor klinik sungguhan.
- Alamat dan tautan rute Google Maps.
- Structured data `VeterinaryCare`, sitemap, robots.
- **Validasi janji temu di sisi server** (`/api/janji-temu`) — setiap field
  divalidasi ulang di server memakai aturan yang sama persis dengan client,
  lengkap dengan pembatasan laju dan umpan bot. Endpoint ini tidak menyimpan
  isi permintaan.
- Pengiriman janji temu ke WhatsApp dengan pesan terisi otomatis.
- Persetujuan cookie yang **benar-benar menggerakkan sesuatu**: menolak
  preferensi membuat draf isian form tidak disimpan, dan draf yang sudah ada
  langsung dihapus.

### Masih lokal (belum ada backend)

- **Data janji temu disimpan di `localStorage` peramban masing-masing
  pengunjung.** Konsekuensinya: janji temu yang dibuat di satu perangkat tidak
  terlihat di perangkat lain, dan slot yang "terkunci" hanya terkunci di
  perangkat itu. Karena itulah pengiriman sesungguhnya tetap lewat WhatsApp.
- **Halaman `/admin` adalah demo** — tidak ada autentikasi, datanya lokal, dan
  halamannya diberi banner peringatan yang tidak bisa dilewatkan. Dikecualikan
  dari sitemap dan diberi `noindex`, serta di-`Disallow` di robots.txt.
- Server belum bisa memvalidasi apakah sebuah slot sudah dipesan orang lain,
  karena daftarnya memang belum ada di server.

### Cara menyambungkan backend

Semua akses data melewati satu antarmuka `BookingStore` di `src/lib/store.ts`.
Kerangka kosong `serverStore` sudah disediakan di file yang sama.

1. Isi metode `serverStore`.
2. Ubah satu baris di bagian bawah file: `export const store = serverStore`.
3. Di `src/app/api/janji-temu/route.ts`, ambil daftar slot terpakai dan
   teruskan ke `validateAppointment` sebagai `taken`.
4. Tambahkan autentikasi sisi server untuk `/admin`.

Yang perlu disiapkan di database: tabel `appointments` dan `blocked_slots`,
dengan **batasan unik pada `(date, time)`** supaya satu slot tidak bisa dipesan
dua kali.

Tidak ada file komponen atau halaman yang perlu disentuh.

### Pembayaran

**Tidak ada payment gateway.** Pembayaran diurus langsung di klinik.

Lapisan adapter kosong sudah disiapkan di `src/lib/payments.ts` dengan
`paymentsEnabled = false`. Selama flag itu mati, tidak ada satu pun bagian situs
yang menyebut pembayaran, harga, atau tagihan. Untuk menambahkannya nanti: isi
`PaymentAdapter` (Midtrans atau Xendit untuk pasar Indonesia), nyalakan flag,
simpan kunci rahasia hanya di environment variable sisi server, dan verifikasi
tanda tangan webhook sebelum mengubah status apa pun.

---

## 7. Menjalankan project

```bash
npm install
npm run dev
```

Perintah lain:

| Perintah | Fungsi |
|---|---|
| `npm run build` | Build produksi (menjalankan `gen:art` lebih dulu) |
| `npm run typecheck` | Cek TypeScript |
| `npm run lint` | ESLint |
| `npm run gen:art` | Regenerasi seluruh gambar SVG |
| `npm run gen:fonts` | Unduh ulang font dan simpan sebagai WOFF2 |
| `node scripts/check-contrast.mjs` | Cek kontras WCAG semua pasangan warna |
| `npm run audit:overflow` | Audit overflow horizontal + baris heading di 375/768/1440 |

Catatan: `images.unoptimized = true` di `next.config.ts` **disengaja**. Kuota
Vercel Image Optimization di akun ini sudah habis; kalau optimizer aktif, semua
gambar balas 402 dan produksi jadi blank. Jangan diubah tanpa mengecek kuota.

---

## 8. Struktur project

```
src/
  data/clinic.ts          <- SATU-SATUNYA file yang perlu diedit orang non-teknis
  lib/
    hours.ts              status buka/tutup dari waktu nyata
    slots.ts              pembentukan slot janji temu
    store.ts              lapisan adapter data (localStorage + kerangka server)
    validation.ts         aturan validasi, dipakai client DAN server
    whatsapp.ts           penyusunan pesan WhatsApp
    payments.ts           lapisan adapter pembayaran (kosong, sengaja)
    consent.ts            persetujuan cookie yang benar-benar berefek
    overlay.ts            penanda overlay terbuka (untuk Lenis)
  components/             komponen UI
  app/                    halaman dan rute
scripts/
  generate-art.mjs        generator SVG deterministik
  build-fonts.mjs         unduh + self-host font
  check-contrast.mjs      pemeriksa kontras WCAG
  audit-overflow.mjs      audit overflow + baris heading
```

### Skala z-index

Satu skala token di `src/app/globals.css`. **Nol angka z-index mentah di seluruh
codebase.** Urutan dari bawah ke atas:

```
konten (1) < raised (10) < header sticky (100) < tombol melayang (200)
  < menu mobile (300) < kalender & modal (400) < banner cookie (500)
  < skip link (600)
```

Catatan: banner cookie memang berada di atas menu mobile dalam skala ini, tapi
banner **menyembunyikan diri** selama ada overlay terbuka — jadi tidak pernah
benar-benar menutupi menu. Saat banner tampil, tombol melayang dinaikkan supaya
tidak ada klik yang tertelan di layar kecil.

Semua CSS custom berada di dalam `@layer` supaya tidak pernah menimpa utility
Tailwind.

---

## 9. Cara mengubah isi situs

Buka `src/data/clinic.ts`. Semua yang bisa berubah ada di sana, dengan komentar
penjelasan di atas tiap bagian dan penanda `>>> ISI DI SINI` di tempat yang
menunggu konfirmasi.

Yang paling sering dibutuhkan:

- **Jam operasional** → bagian 3
- **Menyalakan layanan darurat** → bagian 4, ubah `enabled` jadi `true`
- **Menambah jenis hewan** → bagian 5, isi `additional`
- **Mengonfirmasi fasilitas** → bagian 6, ubah `confirmed` jadi `true`
- **Nama dokter** → bagian 7
- **Menyalakan rawat inap / penitipan** → bagian 10, ubah `enabled` jadi `true`

Setelah mengubah, jalankan `npm run build` dan deploy ulang.

---

## 10. Verifikasi yang sudah dijalankan

Dijalankan di build produksi, bukan hanya di dev server.

**Rute** — semua 200 (`/`, `/layanan`, `/janji-temu`, `/lokasi`, `/kontak`,
`/kebijakan-privasi`, `/ketentuan-layanan`, `/admin`, `/sitemap.xml`,
`/robots.txt`, `/opengraph-image`). URL ngawur → 404.

**Overflow horizontal** — audit otomatis di 375, 768, dan 1440 px pada 8
halaman: **nol pelanggar**. Tabel janji temu di halaman admin dibungkus wadah
yang menggulir sendiri. Honeypot form memakai `clip-path`, bukan
`absolute left:-9999px`.

**Batas baris heading** — semua heading dalam batas per viewport (mobile ≤3,
tablet ≤2, desktop 1).

**Kontras** — 18 dari 18 pasangan warna lolos WCAG AA (teks ≥4,5:1, elemen
non-teks ≥3:1).

**Indikator buka/tutup** — diuji dengan menyuntik waktu palsu ke lapisan yang
menghitungnya (`window.__KALIMUTU_NOW__`), lima kondisi:

| Waktu disuntik | Hasil |
|---|---|
| Rabu 13.00 WITA | "Buka sekarang · tutup pukul 20.00" |
| Rabu 08.00 WITA | "Tutup · buka lagi hari ini pukul 09.00" |
| Rabu 22.00 WITA | "Tutup · buka lagi Kamis pukul 09.00" |
| Sabtu 22.00 WITA (Minggu tutup) | "Tutup · buka lagi Senin pukul 09.00" |
| Jam operasional kosong | Indikator **tidak dirender sama sekali** |

**Alur janji temu** — diuji nyata: memilih layanan dari halaman layanan
mengisi form otomatis (`?layanan=sterilisasi` → "Sterilisasi" terpilih); slot
yang sudah lewat hari ini terkunci dengan label "Sudah lewat"; setelah satu slot
dibooking, slot itu terkunci dengan label "Penuh".

**Pesan WhatsApp** — diverifikasi memuat seluruh isian dan URL halaman asal yang
tepat, dirapikan per baris.

**Flag darurat** — dinyalakan: blok darurat muncul di HTML server pada 6 halaman
dan `/darurat` jadi 200. Dimatikan: nol sisa di semua halaman, `/darurat`
kembali 404, dan rute itu hilang dari sitemap.

Catatan: blok darurat sengaja dirender di **atas** batas Suspense halaman janji
temu, supaya tombol teleponnya sudah ada di HTML server dan tidak perlu menunggu
JavaScript.

**Halaman admin** — janji temu tampil lengkap per tanggal, perubahan status
(menunggu → ditangani → selesai) jalan, blokir slot manual jalan, dan tombol
Reset Demo benar-benar mengosongkan seluruh data.

**Pembacaan ulang seluruh teks** — pemeriksaan terpisah khusus untuk mencari
kalimat yang tanpa sengaja jadi saran medis, janji kesembuhan, atau klaim
fasilitas. Tiga kalimat ditemukan dan diperbaiki:

1. "Hubungi klinik lebih dulu bila Anda ingin **memastikan kondisi hewan Anda**"
   — menyiratkan klinik bisa menilai kondisi lewat telepon.
2. "Untuk hal yang **tidak bisa menunggu**, telepon langsung" — bisa terbaca
   sebagai klaim ketersediaan darurat, padahal flag darurat mati.
3. "saat ada **keluhan ringan**" — "ringan" adalah penilaian tingkat keparahan.

**Aksesibilitas** — status buka/tutup dan status slot selalu punya label teks,
tidak dibedakan lewat warna saja. Dropdown diuji dengan keyboard sungguhan:
Enter membuka, panah memindah pilihan, Enter memilih, Escape menutup, dan fokus
kembali ke trigger. Kalender diverifikasi benar-benar dirender lewat portal ke
`body` (induk langsungnya `body`, bukan di dalam `form`) sehingga tidak dapat
terpotong induk `overflow-hidden`.

**Lapisan dan overlay** — diverifikasi di produksi: Lenis aktif hanya di 1440px,
mati di 375px, 768px, dan di `/admin`; kalender menandai overlay sehingga Lenis
berhenti selama terbuka; banner cookie tidak muncul di atas tirai loader maupun
di atas menu mobile, dan tombol melayang naik saat banner tampil sehingga tidak
ada klik yang tertelan.

**Persetujuan cookie benar-benar berefek** — diuji dua arah di produksi: menolak
preferensi membuat draf isian form tidak tersimpan sama sekali, mengizinkannya
membuat draf tersimpan.

### Catatan jujur soal apa yang belum pernah dilihat mata

Motion **sudah** dilihat, bukan hanya dibaca dari DOM: tirai loader pembuka dan
tirai transisi halaman ditangkap sebagai gambar di pertengahan gerakannya, dan
urutan fase beserta durasinya diukur di peramban sungguhan (`closing` ~2 ms,
`opening` ~360 ms, `idle` ~780 ms, dengan posisi scroll kembali ke 0 setiap
kali).

Satu hal yang perlu diketahui untuk pengujian berikutnya: panel pratinjau di
dalam alat bantu tidak selalu mengeksekusi `loading="lazy"` maupun `setTimeout`
dengan benar saat tabnya tidak aktif — di sana transisi terukur ~2 detik dan
gambar di bawah lipatan tampak "rusak". Keduanya artefak alat, bukan cacat
situs; pengukuran yang dipakai di dokumen ini semuanya diambil dari peramban
sungguhan.

---

## 11. Yang bisa ditambahkan nanti

- Backend sungguhan — lihat bagian 6.
- Mengisi jam operasional begitu klinik mengonfirmasi — ini pekerjaan tujuh baris
  di config, dan langsung menghidupkan fitur pembeda utama situs ini.
- Autentikasi untuk `/admin`.
- Payment gateway — adapter kosongnya sudah siap.
- Konfirmasi otomatis lewat WhatsApp Business API.
- Halaman artikel — **hanya kalau ditulis atau ditinjau dokter hewan klinik.**
  Jangan pernah dikarang sendiri.
