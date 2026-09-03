/**
 * Shared types for the SUS WEARS security engine.
 *
 * These are deliberately framework-agnostic (no Next.js imports) so the
 * detection, risk scoring, rate limiting and logging logic can be unit-tested
 * in isolation and reused on any server surface (Proxy, API route, webhook).
 */

/** Observed severity of a detection. */
export type Severity = "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/** Progressive action ladder. */
export type SecurityAction = "ALLOW" | "OBSERVE" | "THROTTLE" | "CHALLENGE" | "BLOCK";

/** What the request actually needs (HTTP-agnostic decision). */
export type Decision =
  | { action: "ALLOW"; reason?: string }
  | { action: "OBSERVE"; reason?: string }
  | { action: "THROTTLE"; reason: string }
  | { action: "CHALLENGE"; reason: string }
  | { action: "BLOCK"; reason: string };

/** The minimum shape every detection rule must produce. */
export interface DetectionSignal {
  /** Stable, short, snake_case rule id (e.g. `path-traversal`). */
  ruleId: string;
  severity: Severity;
  /** Contribution to the aggregate risk score (0..100). */
  points: number;
  /** Optional second-order weight (e.g. 1 for repeated rules). */
  weight?: number;
  /** Human-safe description (no attacker-controlled input). */
  detail?: string;
}

/** Request signature — the safe, abstracted features used by detection. */
export interface RequestSignature {
  method: string;
  /** Decoded pathname (after URL-decode), lower-cased. */
  path: string;
  /** Full raw pathname (for patterns that need the encoded form). */
  rawPath: string;
  /** Non-cryptographic client fingerprint for rate-limit bucketing
   *  (see signals.anonymiseClientKey — NOT anonymity). */
  clientKey: string;
  /** Normalised, lower-cased user agent ("" if absent). */
  userAgent: string;
  /** Whether the client supplied a browser-ish UA (heuristic). */
  isBrowserish: boolean;
  /** Number of query-string keys. */
  queryCount: number;
  /** Query raw length safety guard (already bounded by caller). */
  queryLength: number;
}

/** Immutable decision context returned to the caller. */
export interface Verdict {
  decision: Decision;
  riskScore: number;
  hitRules: DetectionSignal[];
}

/** Structured security log entry (never contains secrets). */
export interface SecurityEvent {
  ts: string;
  source: string;
  path: string;
  method: string;
  ruleId?: string;
  severity: Severity;
  riskScore: number;
  action: SecurityAction;
  status?: number;
  clientKey?: string;
  userAgent?: string;
  detail?: string;
}
