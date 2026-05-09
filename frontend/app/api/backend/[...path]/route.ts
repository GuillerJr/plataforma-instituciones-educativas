import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE } from '../../../../lib/auth-session';

const API_BASE_URL = process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4100/api';

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function forwardToBackend(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const pathname = path.join('/');
  const incomingUrl = new URL(request.url);
  const targetUrl = `${API_BASE_URL}/${pathname}${incomingUrl.search}`;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const isPublicRequestCreate = request.method === 'POST' && pathname === 'public-requests';

  if (!accessToken && !isPublicRequestCreate) {
    return NextResponse.json({ success: false, message: 'Tu sesión no está disponible. Inicia sesión nuevamente.' }, { status: 401 });
  }

  const headers = new Headers();
  const contentType = request.headers.get('content-type');

  if (contentType) headers.set('Content-Type', contentType);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const backendResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text(),
    cache: 'no-store',
  });
  const payload = await backendResponse.text();

  return new NextResponse(payload, {
    status: backendResponse.status,
    headers: {
      'Content-Type': backendResponse.headers.get('content-type') ?? 'application/json',
    },
  });
}

export async function GET(request: Request, context: RouteContext) {
  return forwardToBackend(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return forwardToBackend(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return forwardToBackend(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return forwardToBackend(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return forwardToBackend(request, context);
}
