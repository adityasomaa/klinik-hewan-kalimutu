import type { Metadata } from "next";

import { clinic, contact, site } from "@/data/clinic";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { WhatsAppLink } from "@/components/WhatsAppLink";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan privasi Klinik Hewan Kalimutu: data apa yang disimpan situs ini, di mana disimpan, dan bagaimana cara menghapusnya.",
  alternates: { canonical: "/kebijakan-privasi" },
};

export default function KebijakanPrivasiPage() {
  return (
    <section className="u-container py-12 lg:py-16">
      <Reveal>
        <SectionHeader
          as="h1"
          eyebrow="Ketentuan"
          title="Kebijakan Privasi"
          description="Halaman ini menjelaskan data apa yang diproses situs klinikhewankalimutu, di mana data itu berada, dan bagaimana Anda dapat menghapusnya."
          cta={
            <WhatsAppLink
              label="Tanya soal privasi"
              intro="Halo, saya ingin menanyakan mengenai kebijakan privasi situs Klinik Hewan Kalimutu."
              className="u-btn u-btn--outline"
            >
              Ajukan pertanyaan
            </WhatsAppLink>
          }
        />
      </Reveal>

      <Reveal>
        <div className="mt-10 max-w-[68ch] [&_h2]:u-h3 [&_h2]:mt-9 [&_h2]:text-[var(--color-ink)] [&_li]:leading-relaxed [&_p]:mt-3 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 text-[1.0625rem] text-[var(--color-ink-muted)]">
          <h2>Ringkasan</h2>
          <p>
            Situs ini tidak menggunakan layanan analitik, tidak memasang piksel
            pelacak, dan tidak memuat skrip pihak ketiga. Data yang Anda isi di
            formulir janji temu tidak dikirim ke basis data mana pun; data itu
            hanya disusun menjadi pesan WhatsApp yang Anda kirim sendiri.
          </p>

          <h2>Data yang diproses</h2>
          <ul>
            <li>
              <strong>Isian formulir janji temu.</strong> Nama pemilik, nomor
              WhatsApp, jenis dan nama hewan, perkiraan umur, jenis layanan,
              gejala yang dicentang, keterangan tambahan, serta tanggal dan waktu
              yang dipilih.
            </li>
            <li>
              <strong>Penyimpanan lokal peramban.</strong> Janji temu yang Anda
              buat disimpan di peramban perangkat Anda agar slot yang sama tidak
              dapat dipilih dua kali dari perangkat itu.
            </li>
            <li>
              <strong>Pilihan persetujuan penyimpanan.</strong> Pilihan Anda pada
              banner penyimpanan disimpan di peramban Anda.
            </li>
          </ul>

          <h2>Ke mana data dikirim</h2>
          <p>
            Ketika Anda menekan tombol kirim, isian formulir disusun menjadi teks
            pesan lalu dibuka di WhatsApp. Pengiriman dilakukan oleh Anda sendiri
            dari aplikasi WhatsApp Anda. Sebelum pesan itu dikirim, isian formulir
            tidak pernah meninggalkan perangkat Anda kecuali untuk pemeriksaan
            keabsahan di server situs ini, yang tidak menyimpan isinya.
          </p>
          <p>
            Setelah pesan terkirim, isi percakapan berada di WhatsApp dan tunduk
            pada ketentuan layanan WhatsApp, bukan pada kebijakan ini.
          </p>

          <h2>Penyimpanan di peramban Anda</h2>
          <p>
            Situs ini menyimpan dua jenis data di peramban Anda. Yang pertama
            diperlukan agar alur janji temu dapat berjalan dan selalu aktif. Yang
            kedua bersifat opsional: draf isian formulir, yang hanya disimpan bila
            Anda mengizinkannya. Bila Anda menolak, draf tidak disimpan dan isian
            yang belum dikirim akan hilang saat halaman ditutup.
          </p>
          <p>
            Anda dapat menghapus seluruh data ini kapan saja dengan membersihkan
            data situs di pengaturan peramban Anda.
          </p>

          <h2>Hosting</h2>
          <p>
            Situs ini dihosting di Vercel. Seperti umumnya penyedia hosting,
            Vercel dapat mencatat permintaan teknis seperti alamat IP dan jenis
            peramban untuk keperluan operasional dan keamanan. Catatan itu berada
            di bawah kendali penyedia hosting.
          </p>

          <h2>Peta</h2>
          <p>
            Halaman lokasi menampilkan peta dari Google Maps. Saat peta dimuat,
            Google dapat menerima data permintaan dari peramban Anda sesuai
            kebijakan privasi Google.
          </p>

          <h2>Data medis hewan</h2>
          <p>
            Keterangan yang Anda isi mengenai kondisi hewan hanya diteruskan ke
            klinik sebagai pesan. Situs ini tidak menyimpan, menganalisis, atau
            menilai keterangan tersebut, dan tidak memberikan kesimpulan apa pun
            atas isinya.
          </p>

          <h2>Hak Anda</h2>
          <p>
            Untuk pertanyaan mengenai data yang telah Anda kirimkan ke klinik,
            hubungi klinik di {contact.whatsappDisplay}. Untuk data yang tersimpan
            di peramban Anda, penghapusan dapat Anda lakukan sendiri melalui
            pengaturan peramban.
          </p>

          <h2>Perubahan</h2>
          <p>
            Kebijakan ini dapat diperbarui bila cara kerja situs berubah. Versi
            yang berlaku adalah versi yang tampil di halaman ini.
          </p>

          <h2>Kontak</h2>
          <p>
            {clinic.name} — {contact.whatsappDisplay} — {site.url.replace("https://", "")}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
