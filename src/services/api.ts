const API_BASE_URL = 'http://localhost:4000/api/v1';

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`API error (${response.status})`);
  }

  return response.json() as Promise<T>;
}
