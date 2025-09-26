// src/lib/auth.ts
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Date.now() / 1000; // tiempo actual en segundos
    return payload.exp < now;
  } catch {
    return true; // si algo falla, tratamos el token como inválido
  }
}
