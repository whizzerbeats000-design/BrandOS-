/**
 * Detection rules + risk scoring.
 *
 * Produces a `Verdict` (risk score + hit rules) from a `RequestSignature`.
 * No single weak signal blocks by itself — points accumulate into a score that
 * maps to the ALLOW → OBSERVE → THROTTLE → BLOCK ladder (see respond.ts).
 */

import {
  AGGRESSIVE_SCANNER_HINTS,
  ALLOWED_METHODS,
  DISALLOWED_METHODS,
  HARD_BLOCK_PATTERNS,
  LEGIT_PAGE_PREFIXES,
  RISK_BLOCK,
  RISK_OBSERVE,
  SENSITIVE_PATHS,
  TRUSTED_UA_HINTS,
} from "./config";
import type { DetectionSignal, RequestSignature, Verdict } from "./types";

function hardBlockHit(sig: RequestSignature): DetectionSignal | null {
  for (const { path, reason } of HARD_BLOCK_PATTERNS) {
    if (path.test(sig.path) || path.test(sig.rawPath)) {
      return { ruleId: reason, severity: "CRITICAL", points: 100, detail: reason };
    }
  }
  return null;
}

function sensitivePathHit(sig: RequestSignature): DetectionSignal | null {
  for (const { path, reason } of SENSITIVE_PATHS) {
    if (path.test(sig.path) && !isLegit(sig.path)) {
      return { ruleId: reason, severity: "HIGH", points: 70, detail: reason };
    }
  }
  return null;
}

/** Is this a known-good static page/prefix? Used to avoid false positives. */
export function isLegit(path: string): boolean {
  if (path === "/" || path === "") return true;
  return LEGIT_PAGE_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

/** Methods that make no sense on a read-only static site. */
function disallowedMethodHit(sig: RequestSignature): DetectionSignal | null {
  if (ALLOWED_METHODS.has(sig.method)) return null;
  // Always-dangerous methods — block regardless of path.
  if (sig.method === "TRACE" || sig.method === "CONNECT") {
    return { ruleId: "disallowed-method", severity: "HIGH", points: 85, detail: sig.method };
  }
  // Mutating methods on the static site are not legitimate — except on the
  // future /api namespace where handlers define their own policy.
  if (sig.path.startsWith("/api/")) return null;
  if (DISALLOWED_METHODS.has(sig.method)) {
    return { ruleId: "disallowed-method", severity: "MEDIUM", points: 45, detail: sig.method };
  }
  return null;
}

/** Headless / obvious non-browser client without a trusted UA. */
function headlessClientHit(sig: RequestSignature): DetectionSignal | null {
  if (sig.isBrowserish || sig.userAgent === "") return null;
  // Generic CLI/script UAs (curl, wget, python-requests) without a trusted hint.
  if (
    !TRUSTED_UA_HINTS.some((h) => sig.userAgent.includes(h)) &&
    /(?:curl|wget|python|go-http-client|http\.client|node-fetch|okhttp|libwww)/.test(sig.userAgent)
  ) {
    return { ruleId: "headless-client", severity: "LOW", points: 20, detail: "non-browser-ua" };
  }
  return null;
}

/** Known aggressive scanner fingerprints. */
function scannerHit(sig: RequestSignature): DetectionSignal | null {
  if (AGGRESSIVE_SCANNER_HINTS.some((h) => sig.userAgent.includes(h))) {
    return { ruleId: "aggressive-scanner", severity: "HIGH", points: 85, detail: "scanner-ua" };
  }
  return null;
}

/** Abnormally large / malformed request structure (bounded in proxy). */
function oversizedQueryHit(sig: RequestSignature): DetectionSignal | null {
  if (sig.queryLength > 2048 || sig.queryCount > 64) {
    return { ruleId: "oversized-query", severity: "MEDIUM", points: 40, detail: "query-structure" };
  }
  return null;
}

/**
 * Evaluate all static rules and return risk score + hits.
 * The highest single hard-block (real genuine probe) short-circuits to 100.
 */
export function evaluateRules(sig: RequestSignature): { signals: DetectionSignal[]; risk: number } {
  const signals: DetectionSignal[] = [];
  const hb = hardBlockHit(sig);
  if (hb) {
    signals.push(hb);
    return { signals, risk: hb.points };
  }

  const push = (s: DetectionSignal | null) => {
    if (s) signals.push(s);
  };
  push(sensitivePathHit(sig));
  push(disallowedMethodHit(sig));
  push(scannerHit(sig));
  push(headlessClientHit(sig));
  push(oversizedQueryHit(sig));

  // Only apply headless penalty to genuinely scripted paths, never static pages.
  const risk = signals.reduce((acc, s) => acc + s.points * (s.weight ?? 1), 0);
  return { signals, risk: Math.min(100, risk) };
}

/** Build the final verdict from signals + risk. */
export function verdictFromRisk(risk: number, signals: DetectionSignal[]): Verdict {
  let decision;
  if (risk >= RISK_BLOCK) decision = { action: "THROTTLE", reason: "elevated-risk" } as const;
  else if (risk >= RISK_OBSERVE) decision = { action: "OBSERVE", reason: "elevated-risk" } as const;
  else decision = { action: "ALLOW" } as const;
  return { decision, riskScore: risk, hitRules: signals };
}
