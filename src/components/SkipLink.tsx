/**
 * Skip link — lapisan paling atas di skala z-index, supaya tidak pernah
 * tertutup header, banner cookie, atau tombol melayang saat menerima fokus.
 */
export function SkipLink() {
  return (
    <a
      href="#konten-utama"
      className="u-btn u-btn--primary sr-only fixed left-4 top-4 focus:not-sr-only focus:fixed"
      style={{ zIndex: "var(--z-skip)" }}
    >
      Lompat ke konten utama
    </a>
  );
}
