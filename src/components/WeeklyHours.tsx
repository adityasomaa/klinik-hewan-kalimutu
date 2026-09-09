import { hasOpeningHours } from "@/data/clinic";
import { weeklyHours } from "@/lib/hours";

/**
 * Daftar jam layanan per hari.
 *
 * Kalau jam operasional di config belum diisi sama sekali, komponen ini
 * mengembalikan null — halaman yang memanggilnya bertanggung jawab menampilkan
 * kalimat pengganti yang jujur, bukan menampilkan tabel kosong.
 */
export function WeeklyHours({ compact = false }: { compact?: boolean }) {
  if (!hasOpeningHours) return null;

  const rows = weeklyHours();

  if (compact) {
    return (
      <ul className="flex flex-col gap-1">
        {rows.map((r) => (
          <li key={r.day} className="flex justify-between gap-4 tabular-nums">
            <span>{r.label}</span>
            <span className={r.value ? "" : "text-[var(--color-ink-subtle)]"}>
              {r.value ?? "Tutup"}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <table className="w-full text-left text-[0.9375rem]">
      <caption className="u-sr-only">Jam layanan Klinik Hewan Kalimutu</caption>
      <tbody>
        {rows.map((r) => (
          <tr key={r.day} className="border-b border-[var(--color-line)] last:border-0">
            <th scope="row" className="py-3 font-medium text-[var(--color-ink)]">
              {r.label}
            </th>
            <td className="py-3 text-right tabular-nums text-[var(--color-ink-muted)]">
              {/* Keadaan tutup selalu berlabel teks, bukan sekadar sel kosong. */}
              {r.value ?? "Tutup"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
