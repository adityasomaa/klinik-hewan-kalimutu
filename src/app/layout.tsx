import type { Metadata, Viewport } from "next";
import "./globals.css";

import {
  clinic,
  contact,
  fullAddress,
  hasOpeningHours,
  openingHours,
  site,
  weekdayOrder,
  weekdaySchema,
} from "@/data/clinic";
import { SkipLink } from "@/components/SkipLink";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { CookieBanner } from "@/components/CookieBanner";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TransitionProvider } from "@/components/Transition";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${clinic.name} — Klinik Hewan di Denpasar`,
    template: `%s — ${clinic.name}`,
  },
  description:
    "Klinik hewan di Denpasar Barat yang melayani pemeriksaan, vaksinasi, sterilisasi, bedah, dan grooming untuk anjing dan kucing. Lihat lokasi, jam layanan, dan buat janji temu.",
  keywords: [
    "klinik hewan Denpasar",
    "dokter hewan Denpasar",
    "klinik hewan Denpasar Barat",
    "vaksinasi kucing Denpasar",
    "sterilisasi anjing Denpasar",
    "grooming hewan Denpasar",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: clinic.name,
    title: `${clinic.name} — Klinik Hewan di Denpasar`,
    description:
      "Klinik hewan di Denpasar Barat untuk anjing dan kucing. Lihat lokasi, hubungi klinik, dan buat janji temu.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${clinic.name} — Klinik Hewan di Denpasar`,
    description:
      "Klinik hewan di Denpasar Barat untuk anjing dan kucing. Lihat lokasi, hubungi klinik, dan buat janji temu.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F4EF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Structured data VeterinaryCare.
 *
 * Penting untuk klien ini: jejak mereka di internet praktis hanya listing
 * Google Maps, jadi data terstruktur yang benar adalah cara paling murah
 * membuat informasi kliniknya bisa ditemukan.
 *
 * openingHoursSpecification HANYA disertakan kalau jam operasional sudah diisi
 * di config. Menerbitkan jam yang salah ke Google lebih berbahaya daripada
 * tidak menerbitkan apa pun.
 */
function structuredData() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VeterinaryCare",
    "@id": `${site.url}/#klinik`,
    name: clinic.name,
    url: site.url,
    telephone: contact.phone,
    description:
      "Klinik hewan di Denpasar Barat yang melayani pemeriksaan, vaksinasi, sterilisasi, bedah, dan grooming untuk anjing dan kucing.",
    image: `${site.url}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      addressLocality: contact.address.city,
      addressRegion: contact.address.region,
      postalCode: contact.address.postalCode,
      addressCountry: clinic.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: contact.geo.lat,
      longitude: contact.geo.lng,
    },
    hasMap: contact.mapsPlaceUrl,
    areaServed: { "@type": "City", name: clinic.city },
  };

  if (hasOpeningHours) {
    data.openingHoursSpecification = weekdayOrder
      .filter((d) => openingHours[d])
      .map((d) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${weekdaySchema[d]}`,
        opens: openingHours[d]!.open,
        closes: openingHours[d]!.close,
      }));
  }

  return data;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.lang}>
      <head>
        {/* Font di-self-host, jadi hanya perlu preload berkasnya sendiri. */}
        <link
          rel="preload"
          href="/fonts/plus-jakarta-sans-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/archivo-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
        />
      </head>

      <body>
        <TransitionProvider>
          <SkipLink />
          <Header />

          <main id="konten-utama" className="u-fab-safe">
            {children}
          </main>

          <Footer />
          <FloatingContact />
          <CookieBanner />
          <SmoothScroll />
        </TransitionProvider>
      </body>
    </html>
  );
}
