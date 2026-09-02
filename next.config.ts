import type { NextConfig } from "next";

// eval/new Function are only emitted by the dev server (Turbopack HMR). The
// production output is eval-free (verified against the built chunks), so we
// deliberately drop 'unsafe-eval' from the production CSP to harden it.
const scriptSrc =
  process.env.NODE_ENV === "development"
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : "'self' 'unsafe-inline'";

const nextConfig: NextConfig = {
  // Do not advertise the framework (X-Powered-By) to reduce infrastructure
  // fingerprinting. This is a supported Next option and disables no cache,
  // browser, or security header that is actually required.
  poweredByHeader: false,
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
        // HSTS: Vercel always serves HTTPS; explicit header adds preload readiness.
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        // Isolate this origin from cross-origin window/embedding attacks.
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            `script-src ${scriptSrc}`,
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https://*.vercel-static.com https://vercel.com",
            "font-src 'self'",
            // WhatsApp links use wa.me (navigation, not fetch/connect) — unaffected.
            "connect-src 'self' https://va.vercel-scripts.com",
            "frame-ancestors 'none'",
            // Harden against plugin/object and base-URI manipulation.
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            // No iframes or embedded resources on this site.
            "frame-src 'none'",
          ].join("; "),
        },
      ],
    },
  ],
};

export default nextConfig;
