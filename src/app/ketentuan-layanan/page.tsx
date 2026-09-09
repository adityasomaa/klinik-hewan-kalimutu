import type { Metadata } from "next";

import { clinic, contact } from "@/data/clinic";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { WhatsAppLink } from "@/components/WhatsAppLink";

export const metadata: Metadata = {
  title: "Ketentuan Layanan",
  description:
    "Ketentuan penggunaan situs Klinik Hewan Kalimutu, termasuk cara kerja permintaan janji temu dan hal-hal yang ditetapkan langsung oleh pihak klinik.",
  alternates: { canonical: "/ketentuan-layanan" },
};

export default function KetentuanLayananPage() {
  return (
    <section className="u-container py-12 lg:py-16">
      <Reveal>
        <SectionHeader
          as="h1"
          eyebrow="Ketentuan"
          title="Ketentuan Layanan"
          description="Halaman ini menjelaskan ketentuan penggunaan situs ini. Ketentuan mengenai pelayanan di klinik ditetapkan langsung oleh pihak klinik."
          cta={
            <WhatsAppLink
              label="Tanya soal ketentuan"
              intro="Halo, saya ingin menanyakan mengenai ketentuan layanan di Klinik Hewan Kalimutu."
              className="u-btn u-btn--outline"
            >
              Ajukan pertanyaan
            </WhatsAppLink>
          }
        />
      </Reveal>

      <Reveal>
        <div className="mt-10 max-w-[68ch] [&_h2]:u-h3 [&_h2]:mt-9 [&_h2]:text-[var(--color-ink)] [&_li]:leading-relaxed [&_p]:mt-3 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 text-[1.0625rem] text-[var(--color-ink-muted)]">
          <h2>Lingkup</h2>
          <p>
            Ketentuan ini berlaku untuk penggunaan situs {clinic.name}. Situs ini
            berfungsi sebagai sarana informasi dan penyampaian permintaan janji
            temu kepada klinik.
          </p>

          <h2>Sifat informasi di situs ini</h2>
          <p>
            Informasi di situs ini bersifat umum dan tidak dimaksudkan sebagai
            saran medis. Situs ini tidak memberikan diagnosis, tidak menyarankan
            tindakan, dan tidak menentukan urgensi suatu kondisi. Penilaian atas
            kondisi hewan hanya dapat dilakukan oleh dokter hewan setelah
            pemeriksaan langsung.
          </p>

          <h2>Permintaan janji temu</h2>
          <ul>
            <li>
              Permintaan yang Anda kirim melalui situs ini adalah permintaan, bukan
              jadwal yang sudah pasti.
            </li>
            <li>
              Janji temu berlaku setelah dikonfirmasi oleh pihak klinik melalui
              WhatsApp atau telepon.
            </li>
            <li>
              Ketersediaan waktu yang ditampilkan di situs dapat berbeda dengan
              ketersediaan sebenarnya di klinik. Klinik berhak menyesuaikan waktu
              kunjungan.
            </li>
            <li>
              Keterangan yang Anda isi diteruskan apa adanya kepada klinik agar
              dapat dipersiapkan sebelum kunjungan.
            </li>
          </ul>

          <h2>Biaya, pembatalan, dan tindakan medis</h2>
          <p>
            Ketentuan mengenai biaya layanan, cara pembayaran, pembatalan dan
            perubahan jadwal, serta persetujuan atas tindakan medis ditetapkan
            langsung oleh pihak klinik dan disampaikan pada saat konfirmasi atau
            saat kunjungan. Situs ini tidak menampilkan tarif dan tidak memproses
            pembayaran dalam bentuk apa pun.
          </p>

          <h2>Ketersediaan situs</h2>
          <p>
            Situs ini disediakan sebagaimana adanya. Kami berupaya menjaga
            informasi tetap mutakhir, namun tidak menjamin situs bebas dari
            kesalahan atau selalu dapat diakses tanpa gangguan. Bila Anda perlu
            memastikan sesuatu, hubungi klinik secara langsung.
          </p>

          <h2>Penggunaan yang wajar</h2>
          <ul>
            <li>
              Isilah formulir dengan data yang benar dan hanya untuk keperluan
              janji temu Anda sendiri.
            </li>
            <li>
              Jangan menggunakan situs ini untuk mengirim permintaan otomatis
              dalam jumlah besar atau mengganggu operasionalnya.
            </li>
          </ul>

          <h2>Tautan ke pihak ketiga</h2>
          <p>
            Situs ini memuat tautan ke WhatsApp dan Google Maps. Penggunaan
            layanan tersebut tunduk pada ketentuan masing-masing penyedia.
          </p>

          <h2>Perubahan ketentuan</h2>
          <p>
            Ketentuan ini dapat diperbarui sewaktu-waktu. Versi yang berlaku
            adalah versi yang tampil di halaman ini.
          </p>

          <h2>Kontak</h2>
          <p>
            Pertanyaan mengenai ketentuan ini dapat disampaikan ke{" "}
            {contact.whatsappDisplay}.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
