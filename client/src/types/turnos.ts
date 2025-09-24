export interface Turno {
  idTurno: number;
  idCliente: number;
  fecha: string; // "YYYY-MM-DD"
  horaInicio: string; // "HH:mm"
  horaFin: string; // "HH:mm"
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO' | 'COMPLETADO';
  motivoCancelacion?: string;
  idServicio: {
    idServicio: number;
    nombre: string;
    duracionMin: number;
  };
  idProfesional: {
    idProfesionales: number;
    nombre: string;
    apellido: string;
  };
}

export interface DisponibilidadSlot {
  profesionalId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

export interface DisponibilidadResponse {
  servicioId: number;
  duracionMin: number;
  slots: DisponibilidadSlot[];
}

export interface CrearTurnoRequest {
  clienteId: number;
  servicioId: number;
  profesionalId: number;
  inicio: string; // ISO8601
}

export interface CancelarTurnoRequest {
  motivo?: string;
}

export interface ReprogramarTurnoRequest {
  nuevoInicio: string; // ISO8601
}

export interface AgendaQuery {
  profesionalId: number;
  desde: string; // ISO8601
  hasta: string; // ISO8601
  estado?: string;
}

export interface DisponibilidadQuery {
  servicioId: number;
  profesionalId?: number;
  fecha?: string; // YYYY-MM-DD
  desde?: string; // ISO8601
  hasta?: string; // ISO8601
  duracionMin?: number;
}