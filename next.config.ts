import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow this host in development — Next 16 blocks cross-origin dev
  // resource requests (chunks / HMR) otherwise, returning 403 and breaking
  // client hydration when testing via 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    // Allow higher fidelity for hero/editorial imagery.
    qualities: [50, 75, 90],
    // Typical viewport widths for responsive image generation.
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920, 2048, 2560],
    imageSizes: [32, 64, 96, 128, 256, 384],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https://*.vercel-static.com https://vercel.com",
            "font-src 'self'",
            "connect-src 'self' https://va.vercel-scripts.com",
            "frame-ancestors 'none'",
          ].join("; "),
        },
      ],
    },
  ],
};

export default nextConfig;
