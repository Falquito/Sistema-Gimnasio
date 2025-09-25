export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  };

  const response = await fetch(`http://localhost:3000${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token inválido o expirado → forzar logout
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return response.json();
}
