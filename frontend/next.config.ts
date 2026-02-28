import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  transpilePackages: ["@stacks/connect", "@stacks/transactions", "@stacks/wallet-sdk", "@stacks/network"],
  webpack: (config, { isServer }) => {
    // Force Webpack to provide fallbacks for Node.js modules commonly used by crypto/blockchain libs
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
