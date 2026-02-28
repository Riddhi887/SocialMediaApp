import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //give image (avatar) config
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  }
};

export default nextConfig;
