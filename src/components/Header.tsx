"use client";

/**
 * Header sticky.
 *
 * Nomor telepon dan tombol WhatsApp selalu ada di header, di setiap halaman —
 * pola yang muncul di hampir semua situs klinik hewan yang kami baca, dan
 * alasannya jelas: orang yang membuka situs ini sering sedang buru-buru.
 *
 * Menu mobile memakai hamburger, mengunci scroll saat terbuka, mengembalikan
 * fokus ke tombol pemicunya saat ditutup, dan menutup sendiri saat berpindah
 * halaman.
 */

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { clinic, contact } from "@/data/clinic";
import { TLink } from "@/components/Transition";
import { WhatsAppIcon, WhatsAppLink } from "@/components/WhatsAppLink";
import { OpenStatus } from "@/components/OpenStatus";
import { pushOverlay, popOverlay } from "@/lib/overlay";

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/layanan", label: "Layanan" },
  { href: "/janji-temu", label: "Janji Temu" },
  { href: "/lokasi", label: "Lokasi" },
  { href: "/kontak", label: "Kontak" },
];

export function Header() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Tutup menu setiap kali halaman berganti. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Kunci scroll dan tandai overlay selama menu terbuka. */
  useEffect(() => {
    if (!open) return;
    pushOverlay();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    // Fokus masuk ke panel supaya navigasi keyboard tidak tertinggal di belakang.
    panelRef.current?.focus();

    return () => {
      popOverlay();
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className="sticky top-0 border-b border-[var(--color-line)] bg-[var(--color-bg)]/92 backdrop-blur-md"
      style={{ zIndex: "var(--z-header)" }}
    >
      <div className="u-container flex h-[var(--header-h)] items-center justify-between gap-4">
        <TLink
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label={`${clinic.name}, ke halaman utama`}
        >
          <Mark />
          <span className="font-[var(--font-display)] text-[0.9375rem] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--color-ink)] sm:text-base">
            Klinik Hewan
            <span className="block text-[var(--color-accent)]">Kalimutu</span>
          </span>
        </TLink>

        {/* Navigasi desktop */}
        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <TLink
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      "inline-flex h-10 items-center rounded-[var(--radius-pill)] px-3.5 text-[0.9375rem] font-medium transition-colors " +
                      (active
                        ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-ink)]"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]")
                    }
                  >
                    {item.label}
                  </TLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={`tel:${contact.phone}`}
            className="u-btn u-btn--ghost hidden h-11 min-h-0 px-4 sm:inline-flex"
          >
            <PhoneIcon className="size-[17px]" />
            <span className="hidden md:inline">{contact.phoneDisplay}</span>
            <span className="md:hidden">Telepon</span>
          </a>

          <WhatsAppLink
            label="WhatsApp di header"
            className="u-btn u-btn--primary hidden h-11 min-h-0 px-4 lg:inline-flex"
          >
            <WhatsAppIcon className="size-[17px]" />
            WhatsApp
          </WhatsAppLink>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={menuId}
            className="u-btn u-btn--ghost h-11 min-h-0 w-11 px-0 lg:hidden"
          >
            <span className="u-sr-only">{open ? "Tutup menu" : "Buka menu"}</span>
            <BurgerIcon open={open} />
          </button>
        </div>
      </div>

      {/* Panel menu mobile */}
      {open ? (
        <div
          id={menuId}
          ref={panelRef}
          tabIndex={-1}
          className="fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto border-t border-[var(--color-line)] bg-[var(--color-bg)] lg:hidden"
          style={{ zIndex: "var(--z-menu)" }}
        >
          <nav aria-label="Navigasi utama" className="u-container py-6">
            <OpenStatus className="mb-5" />

            <ul className="flex flex-col gap-1">
              {NAV.map((item) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <TLink
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={
                        "flex items-center justify-between rounded-[var(--radius-card)] px-4 py-4 text-[1.125rem] font-semibold transition-colors " +
                        (active
                          ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-ink)]"
                          : "text-[var(--color-ink)] hover:bg-[var(--color-sunken)]")
                      }
                    >
                      {item.label}
                      <ArrowIcon />
                    </TLink>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex flex-col gap-2.5">
              <a href={`tel:${contact.phone}`} className="u-btn u-btn--ghost w-full">
                <PhoneIcon className="size-[17px]" />
                Telepon {contact.phoneDisplay}
              </a>
              <WhatsAppLink
                label="WhatsApp di menu mobile"
                className="u-btn u-btn--primary w-full"
              >
                <WhatsAppIcon className="size-[17px]" />
                Hubungi lewat WhatsApp
              </WhatsAppLink>
              <a
                href={contact.mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="u-btn u-btn--outline w-full"
              >
                Buka rute di Google Maps
              </a>
            </div>

            <p className="mt-6 text-[0.875rem] leading-relaxed text-[var(--color-ink-muted)]">
              {contact.address.street}, {contact.address.village},{" "}
              {contact.address.district}
            </p>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function Mark() {
  return (
    <svg viewBox="0 0 512 512" className="size-8 shrink-0" aria-hidden="true">
      <path d="M 116 216 L 148 74 L 262 156 Z" fill="var(--color-accent)" />
      <path d="M 396 216 L 364 74 L 250 156 Z" fill="var(--color-accent)" />
      <circle cx="256" cy="300" r="168" fill="var(--color-accent)" />
      <circle cx="200" cy="284" r="19" fill="var(--color-bg)" />
      <circle cx="312" cy="284" r="19" fill="var(--color-bg)" />
      <path
        d="M 220 352 q 36 34 72 0"
        fill="none"
        stroke="var(--color-bg)"
        strokeWidth="17"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z" />
    </svg>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
      <path
        d={open ? "M6 6 L18 18" : "M4 7 H20"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d={open ? "M18 6 L6 18" : "M4 12 H20"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {open ? null : (
        <path d="M4 17 H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 opacity-45" fill="none" aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
