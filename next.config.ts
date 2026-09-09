import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: { "/*": ["./data/osm-paris.json"] },
};
export default nextConfig;
