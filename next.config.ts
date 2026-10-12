import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // The adapter normalizes only the known Sites routes and keeps query strings.
  skipTrailingSlashRedirect: true,
  outputFileTracingIncludes: { "/*": ["./site/dist/**/*"] },
};

export default nextConfig;
