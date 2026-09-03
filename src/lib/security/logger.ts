/**
 * Structured security logger.
 *
 * Emits safe, structured security events. It deliberately receives only the
 * coarse client fingerprint `clientKey` (never the raw IP) and never logs
 * cookies, query values, bodies, tokens, payment data, or secrets. The
 * fingerprint is non-cryptographic bucketing only — see signals.anonymiseClientKey.
 *
 * Logger is pluggable so it can later fan out to real observability (Vercel Logs,
 * a managed SIEM, or a logging endpoint) without changing call sites.
 */

import type { SecurityAction, SecurityEvent, Severity } from "./types";

/** A sink receives only the structured, secret-free event. */
export interface SecurityLogSink {
  log(event: SecurityEvent): void | Promise<void>;
}

/** Default sink: console under a stable prefix for local/edge logging. */
export const consoleSink: SecurityLogSink = {
  log(event) {
    console.log(`[sec] ${JSON.stringify(event)}`);
  },
};

/**
 * In-memory sink useful for tests and for self-contained (non-KV) deployments
 * that want a bounded tail of recent events. Not durable across restarts.
 */
export class MemorySink implements SecurityLogSink {
  events: SecurityEvent[] = [];
  private readonly max: number;
  constructor(max = 500) {
    this.max = max;
  }
  log(event: SecurityEvent): void {
    this.events.push(event);
    if (this.events.length > this.max) this.events.splice(0, this.events.length - this.max);
  }
}

export interface SecurityLoggerOptions {
  sink?: SecurityLogSink;
  source: string;
  /** Log only events at or above this severity (default LOW). */
  minSeverity?: Severity;
}

const SEVERITY_ORDER: Record<Severity, number> = {
  INFO: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

export class SecurityLogger {
  private readonly sink: SecurityLogSink;
  private readonly source: string;
  private readonly minSeverity: SecuritySeverity;
  private readonly minLevel: number;

  constructor(options: SecurityLoggerOptions) {
    this.sink = options.sink ?? consoleSink;
    this.source = options.source;
    this.minSeverity = options.minSeverity ?? "LOW";
    this.minLevel = SEVERITY_ORDER[this.minSeverity];
  }

  /** Emit an event if it meets the severity threshold. */
  log(input: {
    path: string;
    method: string;
    severity: Severity;
    action: SecurityAction;
    riskScore: number;
    status?: number;
    ruleId?: string;
    clientKey?: string;
    userAgent?: string;
    detail?: string;
  }): void {
    const event: SecurityEvent = {
      ts: new Date().toISOString(),
      source: this.source,
      path: truncate(input.path, 200),
      method: input.method,
      severity: input.severity,
      action: input.action,
      riskScore: input.riskScore,
      status: input.status,
      ruleId: input.ruleId,
      clientKey: input.clientKey,
      userAgent: input.userAgent ? truncate(input.userAgent, 120) : undefined,
      detail: input.detail,
    };
    const level = SEVERITY_ORDER[input.severity];
    if (level < this.minLevel) return;
    void this.sink.log(event);
  }
}

/** Re-export for convenience. */
type SecuritySeverity = Severity;

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}
