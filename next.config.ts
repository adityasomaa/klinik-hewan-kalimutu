import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Kuota Vercel Image Optimization di akun ini habis. Kalau optimizer aktif,
    // semua gambar balas 402 dan produksi jadi blank. Jangan diubah tanpa cek kuota.
    unoptimized: true,
  },
  poweredByHeader: false,
};

export default nextConfig;
