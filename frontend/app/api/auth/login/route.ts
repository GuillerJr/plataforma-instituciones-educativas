import { NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, SESSION_COOKIE_MAX_AGE, buildInstitutionalEmail } from '../../../../lib/auth-session';

const API_BASE_URL = process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4100/api';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { identifier?: string; password?: string } | null;
  const identifier = String(body?.identifier ?? '').trim();
  const password = String(body?.password ?? '').trim();

  if (!identifier || !password) {
    return NextResponse.json({ success: false, message: 'Ingresa tu usuario o correo institucional y la contraseña.' }, { status: 400 });
  }

  const backendResponse = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: buildInstitutionalEmail(identifier),
      password,
    }),
    cache: 'no-store',
  });

  const payload = (await backendResponse.json().catch(() => null)) as {
    message?: string;
    data?: {
      accessToken?: string;
      refreshToken?: string;
      user?: {
        fullName?: string;
        email?: string;
      };
    };
  } | null;

  if (!backendResponse.ok || !payload?.data?.accessToken) {
    return NextResponse.json(
      { success: false, message: payload?.message ?? 'No fue posible iniciar sesión.' },
      { status: backendResponse.status || 500 },
    );
  }

  const response = NextResponse.json({
    success: true,
    message: payload.message ?? 'Autenticación correcta.',
    data: {
      user: payload.data.user ?? null,
    },
  });

  const forwardedProto = request.headers.get('x-forwarded-proto');
  const isHttpsRequest = forwardedProto === 'https' || new URL(request.url).protocol === 'https:';

  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: isHttpsRequest,
    path: '/',
    maxAge: SESSION_COOKIE_MAX_AGE,
  };

  response.cookies.set(ACCESS_TOKEN_COOKIE, payload.data.accessToken, cookieOptions);

  if (payload.data.refreshToken) {
    response.cookies.set(REFRESH_TOKEN_COOKIE, payload.data.refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return response;
}
