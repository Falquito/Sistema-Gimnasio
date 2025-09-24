import type {DisponibilidadQuery,DisponibilidadResponse,CrearTurnoRequest,Turno,
    AgendaQuery, CancelarTurnoRequest,ReprogramarTurnoRequest
} from "../types/turnos"


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


export class TurnosApiService {
  private baseUrl = `${API_BASE_URL}/turnos`;

  // GET /turnos/disponibilidad
  async getDisponibilidad(query: DisponibilidadQuery): Promise<DisponibilidadResponse> {
    const params = new URLSearchParams();
    params.append('servicioId', query.servicioId.toString());
    
    if (query.profesionalId) params.append('profesionalId', query.profesionalId.toString());
    if (query.fecha) params.append('fecha', query.fecha);
    if (query.desde) params.append('desde', query.desde);
    if (query.hasta) params.append('hasta', query.hasta);
    if (query.duracionMin) params.append('duracionMin', query.duracionMin.toString());

    const response = await fetch(`${this.baseUrl}/disponibilidad?${params}`);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  }

  // POST /turnos
  async crearTurno(data: CrearTurnoRequest): Promise<Turno> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  }

  // GET /turnos/agenda
  async getAgenda(query: AgendaQuery): Promise<Turno[]> {
    const params = new URLSearchParams();
    params.append('profesionalId', query.profesionalId.toString());
    params.append('desde', query.desde);
    params.append('hasta', query.hasta);
    if (query.estado) params.append('estado', query.estado);

    const response = await fetch(`${this.baseUrl}/agenda?${params}`);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  }

  // GET /turnos
  async listarTurnos(clienteId?: number, estado?: string): Promise<Turno[]> {
    const params = new URLSearchParams();
    if (clienteId) params.append('clienteId', clienteId.toString());
    if (estado) params.append('estado', estado);

    const response = await fetch(`${this.baseUrl}?${params}`);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  }

  // GET /turnos/:id
  async getTurnoById(id: number): Promise<Turno> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  }

  // PATCH /turnos/:id/cancelar
  async cancelarTurno(id: number, data: CancelarTurnoRequest): Promise<Turno> {
    const response = await fetch(`${this.baseUrl}/${id}/cancelar`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  }

  // PATCH /turnos/:id/reprogramar
  async reprogramarTurno(id: number, data: ReprogramarTurnoRequest): Promise<Turno> {
    const response = await fetch(`${this.baseUrl}/${id}/reprogramar`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  }
}

export const turnosApi = new TurnosApiService();