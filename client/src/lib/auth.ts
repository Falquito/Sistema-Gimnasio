// src/lib/auth.ts
function base64UrlDecode(input: string): string {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = input.length % 4;
  if (pad) input += '='.repeat(4 - pad);
  return atob(input);
}

export function decodeJwt<T = any>(token: string | null): T | null {
  if (!token) return null;
  try {
    const [, payloadB64] = token.split('.');
    return JSON.parse(base64UrlDecode(payloadB64)) as T;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const p = decodeJwt<any>(token);
  if (!p?.exp) return false; 
  const now = Date.now() / 1000;
  return p.exp < now;
}

export function getUserRole(token: string): string | null {
  const p = decodeJwt<any>(token);
 
  return p?.rol ?? null;
}

export function getProfessionalIdFromToken(token: string): number | null {
  const p = decodeJwt<any>(token);
  return typeof p?.professionalId === 'number' ? p.professionalId : null;
}

export function getProfessionalNameFromToken(token: string): string | null {
  const p = decodeJwt<any>(token);
  return p?.nombre ?? null;
}
