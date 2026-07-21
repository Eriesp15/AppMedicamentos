import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildAppError } from '../utils/errorClassifier';

const ANDROID_EMULATOR_HOST = '10.0.2.2';
const DEV_PORT = 4000;

const getBaseUrl = (): string => {
  if (__DEV__) {
    const host = Platform.OS === 'android' ? ANDROID_EMULATOR_HOST : 'localhost';
    return `http://${host}:${DEV_PORT}/api/v1`;
  }
  return 'http://localhost:4000/api/v1';
};

export const API_BASE_URL = getBaseUrl();

const BACKEND_TOKEN_KEY = '@medicare/backendToken';

let cachedBackendToken: string | null = null;

export async function getBackendToken(): Promise<string | null> {
  if (cachedBackendToken) {
    return cachedBackendToken;
  }
  const stored = await AsyncStorage.getItem(BACKEND_TOKEN_KEY);
  if (stored) {
    cachedBackendToken = stored;
    return stored;
  }
  return null;
}

export async function setBackendToken(token: string): Promise<void> {
  cachedBackendToken = token;
  await AsyncStorage.setItem(BACKEND_TOKEN_KEY, token);
}

/**
 * Lanza un `Error` enriquecido con metadata que el `ToastContext` y
 * `errorReporter` saben clasificar (kind=api, severity=toast).
 */
function makeHttpError(status: number, body: string): Error {
  const trimmed = body?.trim();
  const description = trimmed ? `: ${trimmed.slice(0, 120)}` : '';
  return buildAppError({
    kind: 'api',
    severity: 'toast',
    title: 'Error del servidor',
    message: `Servidor respondió con error ${status}${description}`,
    transient: false,
  });
}

function makeNetworkError(): Error {
  return buildAppError({
    kind: 'network',
    severity: 'toast',
    title: 'Sin conexión',
    message:
      'No pudimos contactar el servidor. Tu información se guardó localmente.',
    transient: true,
  });
}

async function readErrorBody(response: Response): Promise<string> {
  try {
    const text = await response.text();
    return text;
  } catch {
    return '';
  }
}

async function buildAuthHeaders(
  extra?: Record<string, string>,
): Promise<Record<string, string>> {
  const token = await getBackendToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function apiGet<T>(path: string): Promise<T> {
  let response: Response;
  try {
    const headers = await buildAuthHeaders();
    response = await fetch(`${API_BASE_URL}${path}`, { headers });
  } catch {
    throw makeNetworkError();
  }

  if (!response.ok) {
    const body = await readErrorBody(response);
    throw makeHttpError(response.status, body);
  }

  return (await response.json()) as Promise<T>;
}

export async function apiPost<T>(
  path: string,
  body: unknown,
): Promise<T> {
  let response: Response;
  try {
    const headers = await buildAuthHeaders();
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  } catch {
    throw makeNetworkError();
  }

  if (!response.ok) {
    const errBody = await readErrorBody(response);
    throw makeHttpError(response.status, errBody);
  }

  return (await response.json()) as Promise<T>;
}

export async function apiPut<T>(
  path: string,
  body: unknown,
): Promise<T> {
  let response: Response;
  try {
    const headers = await buildAuthHeaders();
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
  } catch {
    throw makeNetworkError();
  }

  if (!response.ok) {
    const errBody = await readErrorBody(response);
    throw makeHttpError(response.status, errBody);
  }

  return (await response.json()) as Promise<T>;
}

export async function apiDelete(path: string): Promise<void> {
  let response: Response;
  try {
    const headers = await buildAuthHeaders();
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers,
    });
  } catch {
    throw makeNetworkError();
  }

  if (!response.ok && response.status !== 204) {
    const errBody = await readErrorBody(response);
    throw makeHttpError(response.status, errBody);
  }
}
