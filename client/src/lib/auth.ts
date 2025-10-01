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

export function getUserRole(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.rol || null; // 👈 depende de cómo generes el token en tu backend
  } catch {
    return null;
  }
}
