import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production'
);

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface PlayerSession {
  playerId: string;
  name: string;
  country: string;
  archetype: string;
  type: 'player';
  [key: string]: unknown;
}

export interface GMSession {
  type: 'gm';
  [key: string]: unknown;
}

export type Session = PlayerSession | GMSession;

// Create a session token
export async function createSessionToken(session: Session): Promise<string> {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SESSION_SECRET);

  return token;
}

// Verify and decode a session token
export async function verifySessionToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    return payload as Session;
  } catch (error) {
    return null;
  }
}

// Set session cookie
export async function setSessionCookie(session: Session) {
  const token = await createSessionToken(session);
  const cookieStore = await cookies();

  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  });
}

// Get current session from cookie
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    return null;
  }

  return verifySessionToken(sessionCookie.value);
}

// Clear session cookie
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

// Get player session (returns null if not a player or no session)
export async function getPlayerSession(): Promise<PlayerSession | null> {
  const session = await getSession();
  if (session && session.type === 'player') {
    return session as PlayerSession;
  }
  return null;
}

// Get GM session (returns null if not GM or no session)
export async function getGMSession(): Promise<GMSession | null> {
  const session = await getSession();
  if (session && session.type === 'gm') {
    return session as GMSession;
  }
  return null;
}

// Check if user is authenticated as player
export async function requirePlayerAuth(): Promise<PlayerSession> {
  const session = await getPlayerSession();
  if (!session) {
    throw new Error('Unauthorized: Player authentication required');
  }
  return session;
}

// Check if user is authenticated as GM
export async function requireGMAuth(): Promise<GMSession> {
  const session = await getGMSession();
  if (!session) {
    throw new Error('Unauthorized: GM authentication required');
  }
  return session;
}
