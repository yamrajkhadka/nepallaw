import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - We use this to prevent TypeScript from complaining
  allowedDevOrigins: ["192.168.31.226", "localhost:3000"],
};

export default nextConfig;