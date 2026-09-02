/**
 * Response factory and decision pipeline.
 *
 * Turns a `Verdict` (+ rate-limit result) into a concrete HTTP decision while
 * keeping responses generic and production-safe — we never reveal which rule
 * matched so attackers cannot learn the detection signatures.
 */

import type { Decision, Severity, Verdict } from "./types";
import { RISK_BLOCK, RISK_OBSERVE } from "./config";

/** Generic, attacker-neutral body. No rule names, no sensitive echoes. */
export const BLOCK_BODY = "Request blocked.\n";
export const THROTTLE_BODY = "Too many requests. Please try again shortly.\n";

export interface EvaluateContext {
  verdict: Verdict;
  rateLimit: { allowed: boolean; remaining: number; resetInSeconds: number } | null;
}

/**
 * Combine static risk + rate-limit into a single response decision.
 *
 * - Hard/residual risk == CRITICAL      → BLOCK (403)
 * - Rate limit exceeded                  → THROTTLE (429)
 * - Elevated risk (OBSERVE)              → ALLOW but log (de-escalate)
 * - Normal                               → ALLOW
 */
export function decideResponse(input: EvaluateContext): {
  status: number | null;
  body: string | null;
  action: string;
  severity: Severity;
} {
  const risk = input.verdict.riskScore;
  const blocking = input.verdict.hitRules.find((r) => r.severity === "CRITICAL");

  // 1. High-confidence signal (genuine probe signature) → block.
  if (blocking) {
    return { status: 403, body: BLOCK_BODY, action: "BLOCK", severity: "CRITICAL" };
  }

  // 2. Elevated residual risk (multiple signals, no single CRITICAL) → block.
  if (risk >= RISK_BLOCK) {
    return { status: 403, body: BLOCK_BODY, action: "BLOCK", severity: "HIGH" };
  }

  // 3. Rate limit → 429 (progressive, never a hard ban).
  if (input.rateLimit && !input.rateLimit.allowed) {
    return { status: 429, body: THROTTLE_BODY, action: "THROTTLE", severity: "MEDIUM" };
  }

  // 4. Elevated-but-non-blocking risk → allow, but log (OBSERVE).
  if (risk >= RISK_OBSERVE) {
    return { status: null, body: null, action: "OBSERVE", severity: "MEDIUM" };
  }

  // 5. Normal → allow.
  return { status: null, body: null, action: "ALLOW", severity: "INFO" };
}

/** Convert an internal decision to a plain-action label for logging. */
export function actionLabel(decision: Decision): string {
  return decision.action;
}
