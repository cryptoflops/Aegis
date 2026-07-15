import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  transpilePackages: ["@stacks/connect", "@stacks/transactions", "@stacks/wallet-sdk", "@stacks/network"],
  webpack: (config: any, { isServer }: any) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, net: false, tls: false, crypto: false,
        stream: false, http: false, https: false, zlib: false, path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
