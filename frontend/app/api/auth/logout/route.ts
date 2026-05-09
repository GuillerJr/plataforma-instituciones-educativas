import { NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../../../../lib/auth-session';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada.' });

  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };

  response.cookies.set(ACCESS_TOKEN_COOKIE, '', cookieOptions);
  response.cookies.set(REFRESH_TOKEN_COOKIE, '', cookieOptions);

  return response;
}
