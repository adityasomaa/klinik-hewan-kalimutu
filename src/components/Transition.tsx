"use client";

/**
 * Loader dan transisi antar halaman.
 *
 * Ada DUA loader:
 *   1. Loader pembuka — dipakai saat situs pertama kali dibuka. Menampilkan
 *      lambang klinik sebentar, lalu terbuka.
 *   2. Tirai transisi — dipakai saat berpindah halaman. Lebih ringkas.
 *
 * Urutannya persis: halaman menutup -> konten berganti -> scroll ke atas ->
 * halaman membuka. Seluruh pergantian konten terjadi saat tirai menutup
 * supaya perpindahannya tidak terlihat.
 *
 * Durasinya sengaja ditahan pendek. Ini kategori di mana loader panjang
 * benar-benar merugikan: orang yang panik akan menutup tab.
 *
 * CATATAN PENTING soal requestAnimationFrame:
 *   rAF berhenti total kalau tab dipindah ke belakang. Kalau lanjutan sequence
 *   digantungkan ke rAF saja, tirai bisa nyangkut selamanya. Karena itu setiap
 *   penantian frame di file ini SELALU diadu (race) dengan setTimeout.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clinic } from "@/data/clinic";

const CLOSE_MS = 320;
const OPEN_MS = 420;
const INTRO_MS = 680;

type Phase = "intro" | "intro-out" | "idle" | "closing" | "opening";

const Ctx = createContext<{ navigate: (href: string) => void }>({
  navigate: () => {},
});

export const useTransitionNav = () => useContext(Ctx);

/** setTimeout biasa — tetap berjalan (walau di-throttle) di tab belakang. */
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Tunggu satu frame, TAPI adu dengan setTimeout supaya tidak pernah menggantung
 * kalau tab dipindah ke belakang dan rAF berhenti dipanggil.
 */
function nextFrame(fallbackMs = 120): Promise<void> {
  return new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    const t = setTimeout(finish, fallbackMs);
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => {
        clearTimeout(t);
        finish();
      });
    }
  });
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<Phase>("intro");
  const [, startTransition] = useTransition();
  const pending = useRef<string | null>(null);
  const shownPath = useRef(pathname);

  /* --- Loader pembuka ---------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await wait(INTRO_MS);
      if (cancelled) return;
      // Tirai pembuka ikut naik dengan gerakan yang sama seperti transisi
      // halaman, jadi pembukaan pertama dan perpindahan berikutnya terasa satu
      // bahasa. Lambangnya tetap terlihat selama tirai naik.
      setPhase("intro-out");
      await wait(OPEN_MS);
      if (!cancelled) setPhase("idle");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* --- Kunci scroll selama tirai menutup, tanpa menggeser layout. --------- */
  useEffect(() => {
    const covering = phase === "intro" || phase === "closing";
    document.documentElement.dataset.transition = phase;
    if (covering) document.documentElement.style.overflow = "hidden";
    else document.documentElement.style.overflow = "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [phase]);

  /* --- Konten sudah berganti: scroll ke atas lalu buka tirai. ------------- */
  useEffect(() => {
    if (pathname === shownPath.current) return;
    shownPath.current = pathname;
    pending.current = null;

    let cancelled = false;
    (async () => {
      // Scroll ke atas dilakukan SELAGI tirai masih menutup.
      window.scrollTo(0, 0);
      await nextFrame();
      if (cancelled) return;
      setPhase("opening");
      await wait(OPEN_MS);
      if (!cancelled) setPhase("idle");
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || pending.current === href) return;
      pending.current = href;
      setPhase("closing");

      (async () => {
        // Tunggu tirai selesai menutup sebelum konten diganti.
        await wait(CLOSE_MS);
        startTransition(() => router.push(href));

        // Jaring pengaman: kalau navigasi gagal atau tidak pernah selesai,
        // tirai tetap dibuka lagi supaya halaman tidak tertutup selamanya.
        await wait(3500);
        if (pending.current === href) {
          pending.current = null;
          setPhase("idle");
        }
      })();
    },
    [pathname, router]
  );

  const covering = phase === "intro" || phase === "closing";

  return (
    <Ctx.Provider value={{ navigate }}>
      {children}

      {/* Tirai transisi. aria-hidden supaya tidak diumumkan pembaca layar. */}
      <div
        aria-hidden="true"
        data-phase={phase}
        className="kal-curtain"
        style={{ zIndex: "var(--z-overlay)" }}
      >
        {phase === "intro" || phase === "intro-out" ? (
          <div className="kal-curtain__intro">
            <IntroMark />
            <span className="kal-curtain__word">{clinic.name}</span>
          </div>
        ) : null}
      </div>

      {/* Status navigasi untuk pembaca layar. */}
      <div role="status" aria-live="polite" className="u-sr-only">
        {covering ? "Memuat halaman" : ""}
      </div>
    </Ctx.Provider>
  );
}

/** Lambang klinik untuk loader pembuka. Garisnya menggambar sendiri, singkat. */
function IntroMark() {
  return (
    <svg viewBox="0 0 512 512" className="kal-curtain__mark" aria-hidden="true">
      <path d="M 116 216 L 148 74 L 262 156 Z" fill="currentColor" />
      <path d="M 396 216 L 364 74 L 250 156 Z" fill="currentColor" />
      <circle cx="256" cy="300" r="168" fill="currentColor" />
      <circle cx="200" cy="284" r="19" fill="var(--color-accent)" />
      <circle cx="312" cy="284" r="19" fill="var(--color-accent)" />
      <path
        d="M 220 352 q 36 34 72 0"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="17"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Tautan internal yang melewati sequence transisi.
 * Pakai ini, bukan <Link> langsung, untuk semua navigasi antar halaman.
 */
export function TLink({
  href,
  children,
  className,
  onClick,
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  const { navigate } = useTransitionNav();

  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        // Hormati klik tengah, ctrl/cmd-klik, dan buka di tab baru.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        onClick?.();
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
