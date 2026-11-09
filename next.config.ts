import type { NextConfig } from "next";

const config: NextConfig = {
  agentRules: false,
  devIndicators: false,
  serverExternalPackages: ["@electric-sql/pglite", "pg"],
};

export default config;
