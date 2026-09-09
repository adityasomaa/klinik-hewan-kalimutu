"use client";

/**
 * Lenis smooth scrolling — dengan batasan yang ketat.
 *
 * DIMATIKAN di:
 *   - lebar di bawah 1024px (tablet dan HP) — di layar sentuh, smooth scroll
 *     buatan justru terasa lambat dan melawan gerakan jari.
 *   - halaman admin — di sana orang bekerja dengan tabel, bukan membaca.
 *   - saat kalender atau modal terbuka — supaya scroll di dalam overlay tidak
 *     direbut Lenis.
 *   - saat pengguna meminta prefers-reduced-motion.
 *
 * Overlay memberi tahu lewat atribut data-overlay-open di elemen <html>, yang
 * dipasang oleh helper di src/lib/overlay.ts.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    const wide = window.matchMedia("(min-width: 1024px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

    let lenis: { raf: (t: number) => void; stop: () => void; start: () => void; destroy: () => void } | null = null;
    let frame = 0;
    let observer: MutationObserver | null = null;
    let cancelled = false;

    async function start() {
      if (cancelled || lenis) return;
      if (!wide.matches || calm.matches) return;

      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

      lenis = new Lenis({ duration: 0.9, smoothWheel: true, touchMultiplier: 1 });

      const loop = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);

      // Hentikan Lenis selama overlay terbuka, jalankan lagi setelah ditutup.
      const sync = () => {
        const open = document.documentElement.hasAttribute("data-overlay-open");
        if (open) lenis?.stop();
        else lenis?.start();
      };
      sync();
      observer = new MutationObserver(sync);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-overlay-open"],
      });
    }

    function stop() {
      cancelled = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      observer?.disconnect();
      observer = null;
      lenis?.destroy();
      lenis = null;
    }

    start();

    const onChange = () => {
      stop();
      start();
    };
    wide.addEventListener("change", onChange);
    calm.addEventListener("change", onChange);

    return () => {
      cancelled = true;
      wide.removeEventListener("change", onChange);
      calm.removeEventListener("change", onChange);
      stop();
    };
  }, [pathname]);

  return null;
}
