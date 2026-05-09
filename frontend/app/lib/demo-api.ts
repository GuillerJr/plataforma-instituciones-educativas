import { cookies } from 'next/headers';

import { ACCESS_TOKEN_COOKIE } from '../../lib/auth-session';

const API_BASE_URL = process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4100/api';

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
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    throw new DemoApiError('Debes iniciar sesión para acceder al sistema institucional.');
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
    if (response.status === 401) {
      throw new DemoApiError('Tu sesión expiró o ya no es válida. Inicia sesión nuevamente.');
    }

    throw new DemoApiError(payload?.message ?? 'No fue posible completar la operación.');
  }

  return payload?.data as T;
}
