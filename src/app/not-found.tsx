import { contact } from "@/data/clinic";
import { SectionHeader } from "@/components/SectionHeader";
import { TLink } from "@/components/Transition";
import { WhatsAppIcon, WhatsAppLink } from "@/components/WhatsAppLink";
import { PhoneIcon } from "@/components/Header";

/**
 * Halaman 404.
 *
 * Tetap menyediakan kontak dan rute, karena orang yang tersesat di situs ini
 * kemungkinan besar sedang mencari cara menghubungi klinik — bukan sedang
 * menjelajah.
 */
export default function NotFound() {
  return (
    <section className="u-container py-16 lg:py-24">
      <SectionHeader
        as="h1"
        eyebrow="404"
        title="Halaman yang Anda cari tidak ada"
        description="Tautannya mungkin sudah berubah atau salah ketik. Anda dapat kembali ke beranda, atau langsung menghubungi klinik."
        cta={
          <>
            <TLink href="/" className="u-btn u-btn--primary">
              Kembali ke beranda
            </TLink>
            <WhatsAppLink label="WhatsApp dari halaman 404" className="u-btn u-btn--outline">
              <WhatsAppIcon className="size-[18px]" />
              Hubungi klinik
            </WhatsAppLink>
            <a href={`tel:${contact.phone}`} className="u-btn u-btn--ghost">
              <PhoneIcon className="size-[18px]" />
              {contact.phoneDisplay}
            </a>
          </>
        }
      />

      <nav aria-label="Halaman lain" className="mt-10">
        <ul className="flex flex-wrap gap-2.5">
          {[
            { href: "/layanan", label: "Layanan" },
            { href: "/janji-temu", label: "Janji Temu" },
            { href: "/lokasi", label: "Lokasi" },
            { href: "/kontak", label: "Kontak" },
          ].map((l) => (
            <li key={l.href}>
              <TLink href={l.href} className="u-btn u-btn--ghost">
                {l.label}
              </TLink>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
