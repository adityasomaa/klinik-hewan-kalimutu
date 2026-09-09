/* =============================================================================
 * FILE PENGATURAN UTAMA — KLINIK HEWAN KALIMUTU
 * =============================================================================
 *
 * SEMUA isi situs yang bisa berubah ada di file ini. Kalau ada yang perlu
 * diperbaiki (jam buka, layanan, nomor, jenis hewan), ubah di sini saja.
 *
 * ATURAN PALING PENTING:
 *   Nilai `null` atau array kosong berarti "BELUM DIKONFIRMASI".
 *   Situs sengaja MENYEMBUNYIKAN bagian yang belum dikonfirmasi, bukan
 *   menampilkan tebakan. Ini klinik hewan — informasi salah bisa membuat
 *   orang menunda membawa hewannya. Kosong jauh lebih aman daripada salah.
 *
 * Cara mengisi: cari komentar bertanda  >>> ISI DI SINI  di bawah.
 * ============================================================================= */

/* -----------------------------------------------------------------------------
 * 1. IDENTITAS
 * -------------------------------------------------------------------------- */
export const clinic = {
  name: "Klinik Hewan Kalimutu",
  shortName: "Kalimutu",
  /** Dipakai di judul halaman dan hasil pencarian Google. */
  tagline: "Klinik hewan di Denpasar Barat",
  city: "Denpasar",
  region: "Bali",
  country: "ID",
} as const;

/* -----------------------------------------------------------------------------
 * 2. KONTAK
 *
 * SUMBER: nomor WhatsApp diberikan langsung oleh pihak klinik. Alamat dan
 * plus code diambil dari listing Google Maps resmi klinik (dicek 8 Sep 2026).
 * Nomor yang hanya muncul di direktori pihak ketiga TIDAK dipakai.
 * -------------------------------------------------------------------------- */
export const contact = {
  /** Format internasional tanpa tanda plus — dipakai untuk tautan wa.me. */
  whatsapp: "6281239844650",
  /** Format yang ditampilkan ke pengunjung. */
  whatsappDisplay: "0812-3984-465",
  /** Dipakai untuk tautan telepon. */
  phone: "+6281239844650",
  phoneDisplay: "0812-3984-465",

  /** >>> ISI DI SINI kalau klinik punya email resmi. Biarkan null kalau tidak. */
  email: null as string | null,

  address: {
    street: "Jl. Gn. Kalimutu XIX No.36",
    village: "Pemecutan Klod",
    district: "Kec. Denpasar Barat",
    city: "Kota Denpasar",
    region: "Bali",
    postalCode: "80113",
    /** Plus code dari Google Maps — berguna untuk navigasi. */
    plusCode: "86H2+73 Pemecutan Klod, Kota Denpasar, Bali",
  },

  /** Koordinat perkiraan dari plus code 86H2+73. Dipakai untuk peta dan schema. */
  geo: { lat: -8.6595, lng: 115.2 },

  /** Tautan yang membuka rute langsung di Google Maps. */
  mapsDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Klinik+Hewan+Kalimutu%2C+Jl.+Gn.+Kalimutu+XIX+No.36%2C+Pemecutan+Klod%2C+Denpasar",
  mapsPlaceUrl:
    "https://www.google.com/maps/search/?api=1&query=Klinik+Hewan+Kalimutu%2C+Jl.+Gn.+Kalimutu+XIX+No.36%2C+Pemecutan+Klod%2C+Denpasar",

  /**
   * >>> ISI DI SINI kalau klinik punya akun sosial media resmi.
   * Per 8 Sep 2026 tidak ditemukan akun yang bisa dipastikan milik klinik,
   * jadi dikosongkan. Jangan diisi akun yang belum jelas kepemilikannya.
   */
  social: [] as { label: string; url: string }[],
} as const;

/* -----------------------------------------------------------------------------
 * 3. JAM OPERASIONAL          <<< BAGIAN YANG PALING PENTING DIISI
 *
 * Format: { open: "09:00", close: "20:00" }  atau  null kalau tutup/belum tahu.
 * Waktu 24 jam, zona waktu WITA.
 *
 * SELAMA MASIH null SEMUA:
 *   - indikator "Buka sekarang / Tutup" TIDAK ditampilkan di mana pun
 *   - pemilihan jam di form janji temu memakai jam cadangan di bagian 8
 *   - structured data tidak mencantumkan openingHours
 *
 * CATATAN VERIFIKASI (8 Sep 2026):
 *   Listing Google Maps hanya membuka jadwal hari itu saja: Selasa 09.00-20.00.
 *   Jadwal enam hari lainnya belum terverifikasi. Direktori pihak ketiga
 *   menyebut 08.00-21.00 setiap hari, tapi itu BERTENTANGAN dengan Google Maps
 *   sehingga tidak dipakai. Semua hari sengaja dibiarkan null sampai klinik
 *   mengonfirmasi sendiri.
 * -------------------------------------------------------------------------- */
export type Weekday =
  | "senin"
  | "selasa"
  | "rabu"
  | "kamis"
  | "jumat"
  | "sabtu"
  | "minggu";

export type DayHours = { open: string; close: string } | null;

export const openingHours: Record<Weekday, DayHours> = {
  // >>> ISI DI SINI. Contoh: senin: { open: "09:00", close: "20:00" },
  senin: null,
  selasa: null, // Google Maps 8 Sep 2026 menunjukkan 09.00-20.00 — tunggu konfirmasi klinik
  rabu: null,
  kamis: null,
  jumat: null,
  sabtu: null,
  minggu: null,
};

/** Urutan hari mengikuti Date.getDay(): indeks 0 = Minggu. */
export const weekdayOrder: Weekday[] = [
  "minggu",
  "senin",
  "selasa",
  "rabu",
  "kamis",
  "jumat",
  "sabtu",
];

export const weekdayLabel: Record<Weekday, string> = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
  minggu: "Minggu",
};

/** Kode hari untuk structured data schema.org. */
export const weekdaySchema: Record<Weekday, string> = {
  senin: "Monday",
  selasa: "Tuesday",
  rabu: "Wednesday",
  kamis: "Thursday",
  jumat: "Friday",
  sabtu: "Saturday",
  minggu: "Sunday",
};

/** Zona waktu klinik. Status buka/tutup selalu dihitung di zona ini. */
export const timeZone = "Asia/Makassar"; // WITA

/* -----------------------------------------------------------------------------
 * 4. FLAG LAYANAN DARURAT              <<< DEFAULT: MATI. JANGAN ASAL DINYALAKAN.
 *
 * Nyalakan HANYA kalau klinik memang benar-benar melayani panggilan darurat
 * di luar jam buka. Kalau dinyalakan padahal tidak, orang bisa datang dini hari
 * ke klinik yang tutup.
 *
 * Waktu `enabled: false`, seluruh blok darurat hilang dari semua halaman dan
 * rute /darurat mengembalikan 404.
 * -------------------------------------------------------------------------- */
export const emergency = {
  enabled: false,

  /** Dipakai hanya kalau enabled: true. Biarkan null untuk memakai nomor utama. */
  phone: null as string | null,
  phoneDisplay: null as string | null,

  /** Teks blok darurat. Netral, tanpa menakut-nakuti. */
  headline: "Kondisi mendesak",
  description:
    "Untuk kondisi yang tidak bisa menunggu, hubungi langsung lewat telepon atau WhatsApp. Tidak perlu mengisi formulir.",
} as const;

/* -----------------------------------------------------------------------------
 * 5. JENIS HEWAN YANG DITANGANI
 *
 * Anjing dan kucing diasumsikan sebagai layanan dasar klinik hewan kecil.
 * Jenis lain (kelinci, burung, reptil, hewan eksotis) BELUM dikonfirmasi,
 * jadi tidak dicantumkan. Selama daftar tambahan kosong, situs menampilkan
 * pertanyaan yang mengarahkan ke WhatsApp, bukan daftar tebakan.
 * -------------------------------------------------------------------------- */
export const animals = {
  confirmed: [
    { id: "anjing", label: "Anjing" },
    { id: "kucing", label: "Kucing" },
  ],

  /** >>> ISI DI SINI kalau klinik juga menangani jenis lain. */
  additional: [] as { id: string; label: string }[],
};

/* -----------------------------------------------------------------------------
 * 6. FASILITAS
 *
 * Semua masih `confirmed: false` karena belum ada konfirmasi dari klinik.
 * Fasilitas dengan confirmed: false TIDAK ditampilkan sebagai klaim di situs.
 * Jangan ubah jadi true sebelum benar-benar dipastikan ke klinik.
 * -------------------------------------------------------------------------- */
export const facilities = [
  { id: "usg", label: "USG", confirmed: false },
  { id: "rontgen", label: "Rontgen", confirmed: false },
  { id: "laboratorium", label: "Laboratorium", confirmed: false },
  { id: "ruang-operasi", label: "Ruang operasi", confirmed: false },
  { id: "rawat-inap", label: "Kandang rawat inap", confirmed: false },
  { id: "apotek", label: "Apotek", confirmed: false },
];

/* -----------------------------------------------------------------------------
 * 7. TIM
 *
 * Nama dokter, gelar, nomor STRV/SIP, dan sertifikasi TIDAK BOLEH dikarang.
 * Selama `name: null`, kartu tim tampil sebagai peran tanpa nama dan ditandai
 * jelas sebagai slot yang belum diisi.
 * -------------------------------------------------------------------------- */
export const team = [
  {
    id: "dokter-hewan",
    role: "Dokter hewan",
    /** >>> ISI DI SINI setelah dikonfirmasi klinik. */
    name: null as string | null,
    credentials: null as string | null,
  },
  {
    id: "paramedis",
    role: "Paramedis veteriner",
    name: null as string | null,
    credentials: null as string | null,
  },
  {
    id: "resepsionis",
    role: "Resepsionis",
    name: null as string | null,
    credentials: null as string | null,
  },
];

/* -----------------------------------------------------------------------------
 * 8. PENGATURAN JANJI TEMU
 * -------------------------------------------------------------------------- */
export const booking = {
  /** Panjang satu slot dalam menit. */
  slotMinutes: 30,

  /** Jarak minimal antara sekarang dan slot yang boleh dipesan (menit). */
  minLeadMinutes: 60,

  /** Berapa hari ke depan kalender boleh dibuka. */
  maxAdvanceDays: 30,

  /**
   * Jam cadangan yang dipakai HANYA kalau `openingHours` masih kosong semua,
   * supaya form janji temu tetap bisa dipakai. Ini bukan klaim jam buka dan
   * tidak pernah ditampilkan sebagai jam operasional di mana pun — form
   * menyebutkan bahwa jam akan dikonfirmasi ulang oleh klinik.
   */
  fallbackSlotWindow: { open: "09:00", close: "17:00" },
};

/* -----------------------------------------------------------------------------
 * 9. GEJALA UNTUK FORM JANJI TEMU
 *
 * Ini BUKAN alat diagnosis. Daftar ini hanya mengumpulkan keterangan dari
 * pemilik supaya klinik bisa bersiap. JANGAN menambahkan pemetaan gejala ke
 * penyakit, ke tingkat kegawatan, atau ke saran tindakan apa pun.
 * -------------------------------------------------------------------------- */
export const symptoms = [
  { id: "tidak-mau-makan", label: "Tidak mau makan" },
  { id: "muntah", label: "Muntah" },
  { id: "diare", label: "Diare" },
  { id: "lemas", label: "Lemas" },
  { id: "gatal-berlebihan", label: "Gatal berlebihan" },
  { id: "luka", label: "Luka" },
  { id: "pincang", label: "Pincang" },
  { id: "batuk-bersin", label: "Batuk atau bersin" },
  { id: "perubahan-perilaku", label: "Perubahan perilaku" },
];

/* -----------------------------------------------------------------------------
 * 10. LAYANAN
 *
 * `enabled: false` = layanan disembunyikan sepenuhnya dari situs.
 * Nyalakan hanya layanan yang sudah dipastikan tersedia di klinik.
 *
 * TIDAK ADA HARGA di file ini, dan tidak boleh ada sampai daftar harga resmi
 * diterima dari klinik. Jangan menulis "mulai dari" dengan angka apa pun.
 *
 * `animals` = jenis hewan yang berlaku untuk layanan ini. Dipakai form janji
 * temu untuk menyaring pilihan layanan sesuai jenis hewan yang dipilih.
 * -------------------------------------------------------------------------- */
export type Service = {
  id: string;
  name: string;
  /** Apa yang dikerjakan. Deskriptif, bukan instruksi medis. */
  what: string;
  /** Kapan orang biasanya membutuhkannya. Berhenti sebelum jadi saran medis. */
  when: string;
  animals: string[];
  enabled: boolean;
  /** Kunci gambar generatif di public/art. */
  art: string;
};

export const services: Service[] = [
  {
    id: "pemeriksaan-umum",
    name: "Pemeriksaan umum",
    what: "Pemeriksaan kondisi hewan oleh dokter hewan dan konsultasi mengenai keluhan yang dialami.",
    when: "Biasanya menjadi langkah pertama ketika ada perubahan pada kondisi hewan yang ingin diperiksakan.",
    animals: ["anjing", "kucing"],
    enabled: true,
    art: "pemeriksaan-umum",
  },
  {
    id: "vaksinasi",
    name: "Vaksinasi",
    what: "Pemberian vaksin sesuai penilaian dokter hewan terhadap kondisi dan riwayat hewan.",
    when: "Jenis dan waktu vaksinasi ditentukan dokter hewan setelah pemeriksaan. Tanyakan lewat WhatsApp untuk kondisi hewan Anda.",
    animals: ["anjing", "kucing"],
    enabled: true,
    art: "vaksinasi",
  },
  {
    id: "sterilisasi",
    name: "Sterilisasi",
    what: "Tindakan sterilisasi pada hewan jantan maupun betina.",
    when: "Biasanya dipertimbangkan pemilik yang tidak berencana mengembangbiakkan hewannya. Kelayakan dan waktunya dinilai dokter hewan.",
    animals: ["anjing", "kucing"],
    enabled: true,
    art: "sterilisasi",
  },
  {
    id: "bedah",
    name: "Bedah",
    what: "Tindakan bedah sesuai indikasi yang ditetapkan dokter hewan.",
    when: "Ditentukan setelah pemeriksaan. Diskusikan lebih dulu lewat konsultasi.",
    animals: ["anjing", "kucing"],
    enabled: true,
    art: "bedah",
  },
  {
    id: "grooming",
    name: "Grooming",
    what: "Perawatan kebersihan hewan seperti mandi dan perapian bulu.",
    when: "Dilakukan berkala sesuai kebutuhan dan jenis bulu hewan.",
    animals: ["anjing", "kucing"],
    enabled: true,
    art: "grooming",
  },
  {
    id: "rawat-inap",
    name: "Rawat inap",
    what: "Perawatan hewan yang perlu tinggal di klinik untuk periode tertentu.",
    when: "Ditentukan dokter hewan bila kondisi hewan perlu dipantau lebih lama.",
    animals: ["anjing", "kucing"],
    /** >>> Ketersediaan rawat inap belum dikonfirmasi klinik. */
    enabled: false,
    art: "rawat-inap",
  },
  {
    id: "penitipan",
    name: "Penitipan",
    what: "Menitipkan hewan di klinik selama pemilik bepergian.",
    when: "Untuk pemilik yang perlu meninggalkan hewannya dalam beberapa hari.",
    animals: ["anjing", "kucing"],
    /** >>> Ketersediaan penitipan belum dikonfirmasi klinik. */
    enabled: false,
    art: "penitipan",
  },
];

/* -----------------------------------------------------------------------------
 * 11. SITUS
 * -------------------------------------------------------------------------- */
export const site = {
  /** Domain final. Dipakai untuk canonical, sitemap, robots, dan OG image. */
  url: "https://klinik-hewan-kalimutu.onyxcreative.asia",
  locale: "id_ID",
  lang: "id",
};

/* -------------------------------------------------------------------------- */
/* Turunan — tidak perlu diedit di bawah garis ini.                            */
/* -------------------------------------------------------------------------- */

export const activeServices = services.filter((s) => s.enabled);

export const hasOpeningHours = Object.values(openingHours).some((h) => h !== null);

export const allAnimals = [...animals.confirmed, ...animals.additional];

export const confirmedFacilities = facilities.filter((f) => f.confirmed);

export const fullAddress = [
  contact.address.street,
  contact.address.village,
  contact.address.district,
  contact.address.city,
  contact.address.region + " " + contact.address.postalCode,
].join(", ");
