import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "mzqwvmtxjklnangzdanr.supabase.co",
      },
    ],
  },
};

export default nextConfig;
