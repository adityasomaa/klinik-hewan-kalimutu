"use client";

/**
 * Reveal halus saat elemen masuk layar.
 *
 * PERINGATAN YANG SUDAH MEMAKAN KORBAN:
 *   IntersectionObserver TIDAK BOLEH dipasang pada elemen yang salah satu
 *   induknya memakai overflow-hidden dengan tinggi terbatas — rasionya akan
 *   selalu 0 dan animasi reveal tidak pernah jalan. Karena itu pembungkus
 *   section di situs ini tidak memakai overflow-hidden; pemotongan hanya
 *   dilakukan di dalam .u-media-* yang isinya gambar, bukan elemen ber-reveal.
 *
 * Kalau reveal tiba-tiba tidak jalan, periksa induknya lebih dulu.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Jeda dalam milidetik, untuk merapikan urutan beberapa elemen. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Kalau browser tidak mendukung, tampilkan langsung — jangan pernah
    // meninggalkan konten dalam keadaan tak terlihat.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    io.observe(el);

    // Jaring pengaman: kalau observer tidak pernah menyala (mis. elemen
    // terjebak di induk yang terpotong), konten tetap muncul.
    const safety = window.setTimeout(() => setVisible(true), 1600);

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-visible={visible ? "true" : "false"}
      className={"u-reveal " + className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
