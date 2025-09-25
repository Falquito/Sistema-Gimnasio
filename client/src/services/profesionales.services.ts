// services/profesionales.api.ts
import { apiFetch } from "../lib/api";

export type ProfesionalListItem = {
  idProfesionales: number;
  nombreProfesional: string;
  apellidoProfesional: string;
  email?: string;
  telefono?: string;
  servicio?: string;
};

type Paged<T> = { page: number; limit: number; total: number; items: T[] };

/** Busca por texto (q) o lista primeros n si q="" */
export async function buscarProfesionales(q: string): Promise<ProfesionalListItem[]> {
  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  qs.set("limit", "25");

  const res = await apiFetch(`/profesionales?${qs.toString()}`);
  // Soporta tanto [{...}] como {items:[...]}
  return Array.isArray(res) ? (res as ProfesionalListItem[]) : (res as Paged<ProfesionalListItem>).items ?? [];
}

export async function getProfesionalById(id: number): Promise<ProfesionalListItem> {
  return apiFetch(`/profesionales/${id}`);
}
