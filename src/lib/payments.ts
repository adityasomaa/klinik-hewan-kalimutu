/**
 * LAPISAN ADAPTER PEMBAYARAN — sengaja kosong.
 * =============================================================================
 * Situs ini TIDAK memproses pembayaran. Pembayaran diurus langsung di klinik.
 *
 * Lapisan ini disediakan supaya payment gateway bisa ditambahkan nanti tanpa
 * membongkar alur janji temu. Selama `paymentsEnabled` bernilai false, tidak
 * ada satu pun bagian situs yang menyebut pembayaran, harga, atau tagihan.
 *
 * Cara menyambungkannya nanti:
 *   1. Isi metode di `PaymentAdapter` dengan penyedia yang dipilih
 *      (mis. Midtrans atau Xendit untuk pasar Indonesia).
 *   2. Ubah `paymentsEnabled` menjadi true.
 *   3. Simpan kunci rahasia HANYA di environment variable sisi server.
 *      Jangan pernah menaruh kunci apa pun di kode yang ikut ke browser.
 *   4. Tambahkan endpoint webhook untuk konfirmasi pembayaran, dan verifikasi
 *      tanda tangannya sebelum mengubah status apa pun.
 * ========================================================================== */

export const paymentsEnabled = false;

export type PaymentIntent = {
  appointmentId: string;
  amount: number;
  currency: "IDR";
  description: string;
};

export type PaymentResult = {
  status: "created" | "paid" | "failed" | "cancelled";
  reference: string | null;
  redirectUrl: string | null;
};

export interface PaymentAdapter {
  createIntent(intent: PaymentIntent): Promise<PaymentResult>;
  getStatus(reference: string): Promise<PaymentResult>;
  cancel(reference: string): Promise<void>;
}

/** Adapter kosong. Menolak dengan jelas kalau dipanggil sebelum diisi. */
export const noopPaymentAdapter: PaymentAdapter = {
  async createIntent() {
    throw new Error(
      "Pembayaran belum diaktifkan. Isi PaymentAdapter di src/lib/payments.ts lebih dulu."
    );
  },
  async getStatus() {
    throw new Error("Pembayaran belum diaktifkan.");
  },
  async cancel() {
    throw new Error("Pembayaran belum diaktifkan.");
  },
};

export const payments: PaymentAdapter = noopPaymentAdapter;
