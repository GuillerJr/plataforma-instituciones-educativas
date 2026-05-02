const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4100/api';

type ApiPayload<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export class DemoApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DemoApiError';
  }
}

export { API_BASE_URL };

export async function getDemoAccessToken() {
  const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@educa.local', password: 'Educa2026!' }),
    cache: 'no-store',
  });

  if (!loginResponse.ok) {
    throw new DemoApiError('No fue posible autenticar el acceso demo.');
  }

  const loginPayload = (await loginResponse.json()) as ApiPayload<{ accessToken?: string }>;
  const accessToken = loginPayload.data?.accessToken;

  if (!accessToken) {
    throw new DemoApiError('No se recibió token de acceso.');
  }

  return accessToken;
}

export async function fetchDemoApi<T>(path: string, init?: RequestInit) {
  const accessToken = await getDemoAccessToken();
  const headers = new Headers(init?.headers);

  headers.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => null)) as ApiPayload<T> | null;

  if (!response.ok) {
    throw new DemoApiError(payload?.message ?? 'No fue posible completar la operación.');
  }

  return payload?.data as T;
}
