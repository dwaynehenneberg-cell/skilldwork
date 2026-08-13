import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/sales/foerderklar",
        destination: "/foerderklar",
        permanent: true,
      },
      {
        source: "/sales/foerderklar/:path*",
        destination: "/foerderklar/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
