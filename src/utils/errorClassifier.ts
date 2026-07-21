// Clasificador de errores — convierte errores nativos o de red en un tuple
// `kind + mensaje en español + transient?` para que las pantallas puedan
// decidir entre mostrar un toast no-bloqueante y una alerta modal.

export type AppErrorKind =
  | 'network'
  | 'firestore'
  | 'storage'
  | 'api'
  | 'auth'
  | 'permission'
  | 'unknown';

export type AppErrorSeverity = 'toast' | 'alert' | 'silent';

export type ClassifiedError = {
  kind: AppErrorKind;
  severity: AppErrorSeverity;
  title: string;
  message: string;
  transient: boolean;
  raw?: unknown;
};

const DEFAULT_NETWORK_TITLE = 'Sin conexión';
const DEFAULT_NETWORK_MESSAGE =
  'No pudimos contactar el servidor. Tu información se guardó localmente y se sincronizará cuando vuelvas a tener internet.';

const DEFAULT_FIRESTORE_TITLE = 'Error de sincronización';
const DEFAULT_FIRESTORE_MESSAGE =
  'No se pudo sincronizar con la nube. Tus cambios quedaron guardados localmente.';

const DEFAULT_STORAGE_TITLE = 'Error de almacenamiento';
const DEFAULT_STORAGE_MESSAGE =
  'No se pudo leer ni escribir en el almacenamiento local del dispositivo.';

const DEFAULT_API_TITLE = 'Error del servidor';
const DEFAULT_API_MESSAGE = 'El servidor respondió con un error inesperado.';

const DEFAULT_AUTH_TITLE = 'Error de autenticación';
const DEFAULT_AUTH_MESSAGE =
  'Hubo un problema iniciando o cerrando tu sesión.';

const DEFAULT_PERMISSION_TITLE = 'Permiso requerido';
const DEFAULT_PERMISSION_MESSAGE =
  'La app necesita un permiso adicional para continuar.';

const DEFAULT_UNKNOWN_TITLE = 'Algo salió mal';
const DEFAULT_UNKNOWN_MESSAGE =
  'Ocurrió un error inesperado. Intenta nuevamente en unos segundos.';

const FRIENDLY_BY_CODE: Record<string, Pick<ClassifiedError, 'message' | 'transient'>> = {
  'firestore/unavailable': {
    message:
      'Firebase no está disponible ahora mismo. Tus cambios quedaron guardados localmente.',
    transient: true,
  },
  'firestore/deadline-exceeded': {
    message: 'La consulta tardó demasiado. Reintentaremos en unos segundos.',
    transient: true,
  },
  'firestore/permission-denied': {
    message: 'No tienes permisos para esta operación.',
    transient: false,
  },
  'firestore/cancelled': {
    message: 'La operación fue cancelada.',
    transient: true,
  },
  'auth/network-request-failed': {
    message: 'No hay conexión a internet para iniciar sesión.',
    transient: true,
  },
  'auth/timeout': {
    message: 'La autenticación tardó demasiado. Reintenta cuando tengas señal.',
    transient: true,
  },
};

export function isNetworkError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes('network request failed') ||
    msg.includes('failed to fetch') ||
    msg.includes('networkerror') ||
    msg.includes('timed out') ||
    msg.includes('timeout') ||
    msg.includes('aborted')
  );
}

function isFirestoreErrorCode(code: unknown): boolean {
  if (typeof code !== 'string') return false;
  return code.startsWith('firestore/');
}

function isAuthErrorCode(code: unknown): boolean {
  if (typeof code !== 'string') return false;
  return code.startsWith('auth/');
}

function readErrorCode(err: unknown): string | undefined {
  if (err && typeof err === 'object') {
    const anyErr = err as { code?: unknown; status?: unknown };
    if (typeof anyErr.code === 'string') return anyErr.code;
    if (typeof anyErr.status === 'string') return anyErr.status;
  }
  if (err instanceof Error && /^\w+\/\w+/.test(err.message)) {
    return err.message.split(' ')[0];
  }
  return undefined;
}

export function classifyError(err: unknown): ClassifiedError {
  // Mensajes estructurados: `new AppError(...)` para casos que la app
  // conoce de antemano, p.ej. errores HTTP del backend.
  if (err && typeof err === 'object' && (err as { __appError?: boolean }).__appError) {
    const candidate = err as Partial<ClassifiedError> & { __appError: true };
    if (candidate.kind && candidate.title && candidate.message) {
      return {
        kind: candidate.kind,
        severity: candidate.severity ?? 'toast',
        title: candidate.title,
        message: candidate.message,
        transient: candidate.transient ?? false,
        raw: err,
      };
    }
  }

  // Network failures — RN's fetch suele surfacearlas como TypeError.
  if (isNetworkError(err)) {
    return {
      kind: 'network',
      severity: 'toast',
      title: DEFAULT_NETWORK_TITLE,
      message: DEFAULT_NETWORK_MESSAGE,
      transient: true,
      raw: err,
    };
  }

  const code = readErrorCode(err);

  if (isFirestoreErrorCode(code)) {
    const friendly = (code && FRIENDLY_BY_CODE[code]) || undefined;
    return {
      kind: 'firestore',
      severity: friendly?.transient ? 'toast' : 'alert',
      title: DEFAULT_FIRESTORE_TITLE,
      message: friendly?.message ?? DEFAULT_FIRESTORE_MESSAGE,
      transient: friendly?.transient ?? false,
      raw: err,
    };
  }

  if (isAuthErrorCode(code)) {
    const friendly = (code && FRIENDLY_BY_CODE[code]) || undefined;
    return {
      kind: 'auth',
      severity: friendly?.transient ? 'toast' : 'alert',
      title: DEFAULT_AUTH_TITLE,
      message: friendly?.message ?? DEFAULT_AUTH_MESSAGE,
      transient: friendly?.transient ?? false,
      raw: err,
    };
  }

  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes('asyncstorage') || msg.includes('storage')) {
      return {
        kind: 'storage',
        severity: 'alert',
        title: DEFAULT_STORAGE_TITLE,
        message: DEFAULT_STORAGE_MESSAGE,
        transient: false,
        raw: err,
      };
    }
    if (msg.includes('permission')) {
      return {
        kind: 'permission',
        severity: 'alert',
        title: DEFAULT_PERMISSION_TITLE,
        message: DEFAULT_PERMISSION_MESSAGE,
        transient: false,
        raw: err,
      };
    }
    if (msg.startsWith('api http ')) {
      return {
        kind: 'api',
        severity: 'toast',
        title: DEFAULT_API_TITLE,
        message: err.message.replace(/^api http \d+:\s*/, 'Servidor respondió: '),
        transient: false,
        raw: err,
      };
    }
  }

  return {
    kind: 'unknown',
    severity: 'toast',
    title: DEFAULT_UNKNOWN_TITLE,
    message:
      err instanceof Error && err.message
        ? err.message
        : DEFAULT_UNKNOWN_MESSAGE,
    transient: false,
    raw: err,
  };
}

/**
 * Helper para construir errores con metadata desde servicios. Evita que el
 * caller tenga que repetir el switch a la hora de throw.
 */
export function buildAppError(
  fields: Pick<ClassifiedError, 'kind' | 'title' | 'message'> &
    Partial<Pick<ClassifiedError, 'severity' | 'transient'>>,
): Error {
  const full: ClassifiedError = {
    severity: fields.severity ?? 'toast',
    transient: fields.transient ?? false,
    ...fields,
  };
  const err = new Error(full.message) as Error & ClassifiedError;
  Object.assign(err, full, { __appError: true });
  return err;
}
