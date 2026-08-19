import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/uploads/:filename*',
        destination: '/api/uploads/:filename*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
