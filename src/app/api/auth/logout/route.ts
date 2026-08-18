// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth';

async function handleLogoutRedirect(request: Request) {
  await clearSession();
  const url = new URL(request.url);
  // Redirect back to login page using a 303 (See Other) redirect to force GET request
  return NextResponse.redirect(new URL('/login', url.origin), 303);
}

export async function POST(request: Request) {
  return handleLogoutRedirect(request);
}

export async function GET(request: Request) {
  return handleLogoutRedirect(request);
}
