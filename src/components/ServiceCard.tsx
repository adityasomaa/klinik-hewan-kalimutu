import type { Service } from "@/data/clinic";
import { Art } from "@/components/Art";
import { TLink } from "@/components/Transition";

/**
 * Kartu layanan.
 *
 * Tiap kategori punya komposisi gambar yang berbeda supaya kartu bisa
 * dibedakan sekilas tanpa membaca judulnya.
 *
 * Tidak ada harga di kartu ini, dan tidak boleh ditambahkan sampai daftar harga
 * resmi diterima dari klinik.
 */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="u-card group flex h-full flex-col overflow-hidden">
      <Art src={`layanan-${service.art}`} ratio="1x1" className="rounded-none" />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="u-h3 text-[var(--color-ink)]">{service.name}</h3>

        <p className="text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
          {service.what}
        </p>

        <p className="text-[0.875rem] leading-relaxed text-[var(--color-ink-subtle)]">
          {service.when}
        </p>

        <TLink
          href={`/janji-temu?layanan=${service.id}`}
          className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[0.9375rem] font-semibold text-[var(--color-accent)] underline-offset-4 group-hover:underline"
        >
          Buat janji temu
          <span aria-hidden="true">→</span>
          <span className="u-sr-only">untuk layanan {service.name}</span>
        </TLink>
      </div>
    </article>
  );
}
