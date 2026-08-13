// src/lib/auth.ts
import { cookies } from 'next/headers';

export interface SessionUser {
  userId: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'FACULTY' | 'COORDINATOR' | 'ADMIN' | 'PRINCIPAL';
  profileId: string; // The specific profile ID
}

const COOKIE_NAME = 'sih_session';

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie) return null;

  try {
    const raw = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    return JSON.parse(raw) as SessionUser;
  } catch (error) {
    return null;
  }
}

export async function setSession(user: SessionUser) {
  const cookieStore = await cookies();
  const raw = Buffer.from(JSON.stringify(user)).toString('base64');
  cookieStore.set(COOKIE_NAME, raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
