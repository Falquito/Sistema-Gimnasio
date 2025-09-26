// src/services/pacientes.api.ts
import { apiFetch } from "../lib/api";
import type { ObraSocial } from "../pages/Pacientes";

export type PacienteListItem = {
  id_paciente: number;
  nombre_paciente: string;
  apellido_paciente: string;
  dni: string;
  email: string;
  telefono_paciente: string;
  fecha_nacimiento: string;
  genero: string;
  observaciones?: string;
  fecha_alta: string;
  fecha_ult_upd: string;
  estado: boolean;
  id_obraSocial: number | null; // CORREGIDO: puede ser null
  nro_obraSocial: number | null; // CORREGIDO: puede ser null
};

const BASE = "/pacientes";

export async function listarPacientes(): Promise<PacienteListItem[]> {
  return await apiFetch<PacienteListItem[]>(BASE);
}

export async function listarObrasSociales(): Promise<ObraSocial[]> {
  return await apiFetch<ObraSocial[]>("/obra-social");
}

export async function buscarPacientes(q: string): Promise<PacienteListItem[]> {
  const term = (q ?? "").trim();

  if (!term) return listarPacientes();

  const url = `${BASE}?q=${encodeURIComponent(term)}`;
  try {
    const data = await apiFetch<any>(url);
    if (Array.isArray(data)) return data as PacienteListItem[];
  } catch {
    // Error silencioso, continúa con fallback
  }

  // Fallback: traer todos y filtrar en el cliente
  const all = await listarPacientes();
  const lower = term.toLowerCase();
  return all.filter((p) =>
    [p.nombre_paciente, p.apellido_paciente, p.dni, p.telefono_paciente]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(lower))
  );
}

export async function getPacienteById(id: number): Promise<PacienteListItem> {
  return apiFetch<PacienteListItem>(`${BASE}/${id}`);
}

// NUEVAS: Funciones para crear/actualizar pacientes
export async function crearPaciente(paciente: Omit<PacienteListItem, 'id_paciente'>): Promise<PacienteListItem> {
  return apiFetch<PacienteListItem>(BASE, {
    method: 'POST',
    body: JSON.stringify(paciente),
  });
}

export async function actualizarPaciente(id: number, paciente: Partial<PacienteListItem>): Promise<PacienteListItem> {
  return apiFetch<PacienteListItem>(`${BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(paciente),
  });
}