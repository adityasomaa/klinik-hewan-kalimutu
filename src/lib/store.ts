/**
 * LAPISAN ADAPTER DATA
 * =============================================================================
 * Belum ada backend sungguhan. Data janji temu disimpan di penyimpanan lokal
 * browser supaya alurnya bisa didemokan dari ujung ke ujung.
 *
 * SEMUA akses data melewati antarmuka `BookingStore` di bawah. Waktu database
 * asli disambungkan nanti, yang perlu diganti hanya satu implementasi di file
 * ini — halaman dan komponen tidak perlu disentuh sama sekali.
 *
 * Kerangka kosong untuk implementasi server sudah disediakan di bagian bawah.
 *
 * PENTING: penyimpanan lokal hanya ada di browser masing-masing pengunjung.
 * Janji temu yang dibuat di satu perangkat TIDAK terlihat di perangkat lain.
 * Itulah sebabnya pengiriman sesungguhnya tetap lewat WhatsApp, dan halaman
 * admin ditandai jelas sebagai demo.
 */

export type AppointmentStatus = "menunggu" | "ditangani" | "selesai";

export type Appointment = {
  id: string;
  createdAt: string;
  ownerName: string;
  ownerPhone: string;
  animalType: string;
  petName: string;
  petAge: string;
  serviceId: string;
  symptomIds: string[];
  complaint: string;
  /** "YYYY-MM-DD" */
  date: string;
  /** "HH:MM" */
  time: string;
  status: AppointmentStatus;
};

/** Slot yang diblokir manual dari halaman admin (hari libur, dokter berhalangan). */
export type BlockedSlot = { date: string; time: string };

export interface BookingStore {
  listAppointments(): Promise<Appointment[]>;
  listByDate(date: string): Promise<Appointment[]>;
  createAppointment(
    data: Omit<Appointment, "id" | "createdAt" | "status">
  ): Promise<Appointment>;
  updateStatus(id: string, status: AppointmentStatus): Promise<void>;
  listBlocked(): Promise<BlockedSlot[]>;
  toggleBlocked(slot: BlockedSlot): Promise<void>;
  /** Kembalikan semua data ke kondisi awal. */
  reset(): Promise<void>;
}

const KEY_APPOINTMENTS = "kalimutu.appointments.v1";
const KEY_BLOCKED = "kalimutu.blocked.v1";

/** Peristiwa yang dipancarkan setiap kali data berubah, supaya UI ikut segar. */
export const STORE_EVENT = "kalimutu:store-changed";

function emit() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(STORE_EVENT));
  }
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    // Mode privat, penyimpanan penuh, atau data rusak — jangan sampai
    // seluruh halaman gagal render karenanya.
    return fallback;
  }
}

function write(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    emit();
    return true;
  } catch {
    return false;
  }
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `a-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Implementasi yang aktif sekarang: penyimpanan lokal browser. */
export const localStore: BookingStore = {
  async listAppointments() {
    return read<Appointment[]>(KEY_APPOINTMENTS, []).sort((a, b) =>
      (a.date + a.time).localeCompare(b.date + b.time)
    );
  },

  async listByDate(date) {
    return (await this.listAppointments()).filter((a) => a.date === date);
  },

  async createAppointment(data) {
    const all = read<Appointment[]>(KEY_APPOINTMENTS, []);
    const clash = all.some((a) => a.date === data.date && a.time === data.time);
    if (clash) throw new Error("SLOT_TAKEN");

    const appointment: Appointment = {
      ...data,
      id: newId(),
      createdAt: new Date().toISOString(),
      status: "menunggu",
    };
    all.push(appointment);
    write(KEY_APPOINTMENTS, all);
    return appointment;
  },

  async updateStatus(id, status) {
    const all = read<Appointment[]>(KEY_APPOINTMENTS, []);
    const found = all.find((a) => a.id === id);
    if (found) {
      found.status = status;
      write(KEY_APPOINTMENTS, all);
    }
  },

  async listBlocked() {
    return read<BlockedSlot[]>(KEY_BLOCKED, []);
  },

  async toggleBlocked(slot) {
    const all = read<BlockedSlot[]>(KEY_BLOCKED, []);
    const i = all.findIndex((b) => b.date === slot.date && b.time === slot.time);
    if (i >= 0) all.splice(i, 1);
    else all.push(slot);
    write(KEY_BLOCKED, all);
  },

  async reset() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(KEY_APPOINTMENTS);
      window.localStorage.removeItem(KEY_BLOCKED);
    } catch {
      /* abaikan */
    }
    emit();
  },
};

/* =============================================================================
 * KERANGKA KOSONG UNTUK BACKEND SUNGGUHAN
 * =============================================================================
 * Waktu database sudah siap, isi metode di bawah lalu ubah baris `export const
 * store` di bagian paling bawah file ini. Tidak ada file lain yang perlu diubah.
 *
 * Yang perlu disiapkan di sisi server:
 *   - tabel appointments dan tabel blocked_slots
 *   - batasan unik pada (date, time) supaya slot tidak bisa dipesan dua kali
 *   - autentikasi untuk rute admin
 *   - pembatasan laju permintaan pada endpoint pembuatan janji temu
 * ========================================================================== */
export const serverStore: BookingStore = {
  async listAppointments() {
    throw new Error("serverStore belum diimplementasikan");
  },
  async listByDate() {
    throw new Error("serverStore belum diimplementasikan");
  },
  async createAppointment() {
    throw new Error("serverStore belum diimplementasikan");
  },
  async updateStatus() {
    throw new Error("serverStore belum diimplementasikan");
  },
  async listBlocked() {
    throw new Error("serverStore belum diimplementasikan");
  },
  async toggleBlocked() {
    throw new Error("serverStore belum diimplementasikan");
  },
  async reset() {
    throw new Error("serverStore belum diimplementasikan");
  },
};

/** Implementasi yang dipakai situs. Ganti ke `serverStore` saat backend siap. */
export const store: BookingStore = localStore;
