import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/loja",
        destination: "https://store.superraca.com",
        permanent: true,
      },
      {
        source: "/loja/:path*",
        destination: "https://store.superraca.com",
        permanent: true,
      },
    ];
  },
  devIndicators: false,
};

export default nextConfig;
