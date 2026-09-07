import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/mijn-eerste-bezoek", destination: "/gratis-persoonlijke-intake", permanent: true },
      { source: "/sporten/personal-training", destination: "/personal-training", permanent: true },
      { source: "/blog", destination: "/kennisbank", permanent: true },
      { source: "/blog/:slug", destination: "/kennisbank/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
