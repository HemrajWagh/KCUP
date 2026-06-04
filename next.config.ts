import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["stage.kumarcorp.co.in"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kpassets.kumarworld.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.magnific.com",
        pathname: "/**",
      },
    ],
  },

  transpilePackages: ["gsap"],

  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: "http://localhost:3030/:path*",
      },
    ];
  },
};

export default nextConfig;