import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: resolve(import.meta.dirname, "../../"),
  },
  transpilePackages: [
    "@clarix/ui",
    "@clarix/shared",
    "@clarix/utils",
    "@clarix/auth",
    "@clarix/observability",
  ],
};

export default nextConfig;
