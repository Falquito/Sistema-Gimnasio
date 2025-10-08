import { apiFetch } from "../lib/api";

export const pacientesApi = {
  getAll: () => apiFetch("/pacientes"),
  getById: (id: number) => apiFetch(`/pacientes/${id}`),
};
