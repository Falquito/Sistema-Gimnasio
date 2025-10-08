// api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function apiFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // 🔒 Si el token es inválido o expiró → cerrar sesión
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("No autorizado");
  }

  // ⚠️ Si hay error del servidor o request fallida
  if (!response.ok) {
    let errorMessage = `Error HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData?.message || errorData?.error || errorMessage;
    } catch {
      // respuesta no JSON → ignoramos
    }
    throw new Error(errorMessage);
  }

  // ✅ Si la respuesta está vacía (ej: 204 No Content)
  if (response.status === 204) return null as T;

  // ✅ Devolvemos directamente el resultado JSON parseado
  return (await response.json()) as T;
}
