/**
 * Satu tempat untuk menandai bahwa ada overlay terbuka (kalender, modal,
 * menu mobile).
 *
 * Penanda dipasang di elemen <html> sebagai data-overlay-open. Lenis mengamati
 * atribut itu dan berhenti selama overlay terbuka, supaya scroll di dalam
 * overlay tidak direbut smooth scrolling.
 *
 * Memakai penghitung, bukan boolean, supaya dua overlay yang terbuka bersamaan
 * tidak saling mematikan penanda saat salah satunya ditutup.
 */

let depth = 0;

export function pushOverlay(): void {
  if (typeof document === "undefined") return;
  depth += 1;
  document.documentElement.setAttribute("data-overlay-open", "");
}

export function popOverlay(): void {
  if (typeof document === "undefined") return;
  depth = Math.max(0, depth - 1);
  if (depth === 0) document.documentElement.removeAttribute("data-overlay-open");
}
