import type { NextConfig } from "next";

// Statik eksport: landing ilova bilan bitta Caddy serverida turadi
// (alia.uz — landing, alia.uz/login, /admin ... — ilova). Node server kerak emas.
const nextConfig: NextConfig = {
  output: "export",
  // Eksportda rasm optimallashtirish serveri yo'q — rasmlar o'zicha beriladi.
  images: { unoptimized: true },
};

export default nextConfig;
