// api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function apiFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  // armamos headers sin meter Authorization vacío ni forzar JSON en FormData
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Token inválido/expirado → logout duro y cortar ejecución
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("No autorizado");
  }

  if (!res.ok) {
    // Intentamos leer mensaje del backend
    let message = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      message = err?.message || err?.error || message;
    } catch {
      // por si la respuesta no es JSON
    }
    throw new Error(message);
  }

  // 204 o respuestas vacías
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}
