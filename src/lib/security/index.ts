/**
 * SUS WEARS security engine — public surface.
 *
 * Framework-agnostic: detection, risk scoring, rate limiting, logging and
 * response decisions. Consumed by `src/proxy.ts` today and by future API
 * routes, auth, checkout and payment-webhook handlers.
 */
export * from "./types";
export * from "./config";
export * from "./signals";
export * from "./rules";
export * from "./ratelimit";
export * from "./logger";
export * from "./respond";
