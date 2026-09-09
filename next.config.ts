import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: { "/*": ["./data/osm-paris.json"] },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "upload.wikimedia.org" }],
  },
};
export default nextConfig;
