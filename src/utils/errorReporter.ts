// Reporter que envía los errores al backend (`/api/v1/logs`) y los registra
// en consola. Se ejecuta fire-and-forget: nunca bloquea al caller ni tira
// errores si el backend no responde.

import { API_BASE_URL } from '../services/api';
import {
  ClassifiedError,
  classifyError,
  isNetworkError,
} from './errorClassifier';

type LogSource =
  | 'medicationStorage'
  | 'useMedicationManager'
  | 'alarmService'
  | 'api'
  | 'auth'
  | 'app'
  | 'unknown';

export type ErrorContext = {
  source: LogSource;
  context?: string;
  extra?: Record<string, unknown>;
  userAgent?: string;
};

let pendingLogs: Array<{
  payload: Record<string, unknown>;
  retries: number;
}> = [];

let flushHandle: ReturnType<typeof setTimeout> | null = null;
const FLUSH_DELAY_MS = 1500;
const MAX_RETRIES = 2;
const REQUEST_TIMEOUT_MS = 4000;
// Cuando el propio POST a /logs falla por red, dejamos de intentarlo
// durante esta ventana para no inundar la consola con el mismo
// "descartado tras reintentos" cuando el problema es el backend, no la
// app.
const BACKEND_OFFLINE_WINDOW_MS = 60_000;

let backendOfflineUntil = 0;
let backendOfflineWarned = false;

function markBackendOffline() {
  backendOfflineUntil = Date.now() + BACKEND_OFFLINE_WINDOW_MS;
}

function scheduleFlush() {
  if (flushHandle) return;
  flushHandle = setTimeout(() => {
    flushHandle = null;
    void flushPending();
  }, FLUSH_DELAY_MS);
}

async function flushPending() {
  if (pendingLogs.length === 0) return;
  if (Date.now() < backendOfflineUntil) {
    // Backend caído hace poco: no spameamos reintentos, los descartamos
    // silenciosamente hasta que vuelva la ventana de blackout.
    return;
  }

  const batch = pendingLogs;
  pendingLogs = [];
  backendOfflineWarned = false;

  for (const item of batch) {
    if (Date.now() < backendOfflineUntil) {
      // Algún otro reporte volvió a marcar offline mientras iterábamos.
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(`${API_BASE_URL}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) continue;

      // 4xx no se va a recuperar — descartar inmediatamente.
      if (res.status >= 400 && res.status < 500) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.warn(
            `[errorReporter] log descartado por 4xx (${res.status}):`,
            item.payload,
          );
        }
        continue;
      }
      // 5xx u otros: reintentar hasta agotar el budget.
      if (item.retries < MAX_RETRIES) {
        pendingLogs.push({payload: item.payload, retries: item.retries + 1});
        scheduleFlush();
      } else if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn('[errorReporter] log descartado tras reintentos:', item.payload);
      }
    } catch (err) {
      clearTimeout(timeout);
      if (isNetworkError(err)) {
        markBackendOffline();
        if (__DEV__ && !backendOfflineWarned) {
          // eslint-disable-next-line no-console
          console.warn(
            '[errorReporter] backend no alcanzable — suprimiendo logs durante',
            `${BACKEND_OFFLINE_WINDOW_MS / 1000}s.`,
          );
          backendOfflineWarned = true;
        }
        // Salimos sin re-iterar: el próximo flush pasados los 60 s
        // reintentará con los pendientes que se hayan acumulado.
        return;
      }
      if (item.retries < MAX_RETRIES) {
        pendingLogs.push({payload: item.payload, retries: item.retries + 1});
        scheduleFlush();
      } else if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn('[errorReporter] log descartado tras reintentos:', item.payload);
      }
    }
  }
}

export function reportError(
  err: unknown,
  ctx: ErrorContext,
): ClassifiedError {
  const classified = err && typeof err === 'object' && (err as { __appError?: boolean }).__appError
    ? (err as unknown as ClassifiedError)
    : classifyError(err);

  const payload: Record<string, unknown> = {
    kind: classified.kind,
    severity: classified.severity,
    title: classified.title,
    message: classified.message,
    transient: classified.transient,
    source: ctx.source,
    context: ctx.context,
    extra: ctx.extra,
    userAgent: ctx.userAgent,
    timestamp: new Date().toISOString(),
    rawMessage: err instanceof Error ? err.message : String(err),
  };

  // Si el backend está marcado como caído hace poco, descartar el
  // reporte silenciosamente: no tiene sentido seguir acumulando logs
  // que no podemos entregar.
  if (Date.now() < backendOfflineUntil) {
    return classified;
  }

  pendingLogs.push({ payload, retries: 0 });
  scheduleFlush();

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn(
      `[errorReporter] ${classified.kind} :: ${ctx.source}` +
        (ctx.context ? ` (${ctx.context})` : ''),
      payload,
    );
  }
  return classified;
}

/** Para tests / debugging. */
export function _resetErrorReporterForTests() {
  pendingLogs = [];
  if (flushHandle) {
    clearTimeout(flushHandle);
    flushHandle = null;
  }
  backendOfflineUntil = 0;
  backendOfflineWarned = false;
}
