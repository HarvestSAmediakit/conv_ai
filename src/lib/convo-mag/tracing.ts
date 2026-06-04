// src/lib/convo-mag/tracing.ts
import { pino } from 'pino';

export interface TraceContext {
  traceId: string;
  tenantId?: string;
  documentId?: string;
  jobId?: string;
}

const sysLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Standardized telemetry utility for publishing correlated logs
 * across asynchronous service boundaries.
 */
export const tracer = {
  info: (ctx: TraceContext, msg: string, data?: any) => {
    sysLogger.info({ ...ctx, ...data }, msg);
  },
  warn: (ctx: TraceContext, msg: string, data?: any) => {
    sysLogger.warn({ ...ctx, ...data }, msg);
  },
  error: (ctx: TraceContext, msg: string, error?: any) => {
    sysLogger.error({
      ...ctx,
      errMessage: error?.message,
      stack: error?.stack,
      ...error,
    }, msg);
  },
};

/**
 * Executes a function block and profiles its execution latency.
 * Emits telemetry metrics to support latency profiling and cost control.
 */
export async function profileBlock<T>(
  ctx: TraceContext,
  milestone: string,
  fn: () => Promise<T>
): Promise<T> {
  const startHr = process.hrtime.bigint();
  tracer.info(ctx, `Initiating latency metric block: ${milestone}`);

  try {
    const output = await fn();
    const endHr = process.hrtime.bigint();
    const durationMs = Number(endHr - startHr) / 1e6; // Convert nanoseconds to milliseconds

    tracer.info(ctx, `Completed latency metric block: ${milestone}`, {
      milestone,
      durationMs,
      telemetryMetric: 'performance_latency_record',
    });

    return output;
  } catch (err) {
    const endHr = process.hrtime.bigint();
    const durationMs = Number(endHr - startHr) / 1e6;

    tracer.error(ctx, `Milestone execution block failed: ${milestone}`, {
      milestone,
      durationMs,
      err,
    });
    throw err;
  }
}
