import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  transpilePackages: ["@stacks/transactions", "@stacks/wallet-sdk", "@stacks/network"],
  serverExternalPackages: ["@stacks/connect"],
};

export default nextConfig;
