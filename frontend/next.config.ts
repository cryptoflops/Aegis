import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  transpilePackages: ["@stacks/connect", "@stacks/transactions", "@stacks/wallet-sdk", "@stacks/network"],
};

export default nextConfig;
