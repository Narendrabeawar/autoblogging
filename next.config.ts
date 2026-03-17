import type { NextConfig } from "next";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_HOST = SUPABASE_URL ? new URL(SUPABASE_URL).hostname : undefined;

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Hide "Compiling..." so dev doesn’t look stuck; compilation still runs in background
  devIndicators: false,
  images: {
    remotePatterns: SUPABASE_HOST
      ? [
          {
            protocol: "https",
            hostname: SUPABASE_HOST,
            pathname: "/storage/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
