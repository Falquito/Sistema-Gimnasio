// src/types/turnos.ts

export type EstadoTurno = 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO' | 'COMPLETADO';

export interface Turno {
  idTurno: number;

  /** Fecha y horas en formato simple */
  fecha: string;            // "YYYY-MM-DD"
  horaInicio: string;       // "HH:mm"
  horaFin?: string | null;  // "HH:mm" (si existe)

  estado: EstadoTurno;
  observacion?: string | null;
  motivoCancelacion?: string;

  /** Timestamps del registro (si tu API los manda) */
  fechaAlta?: string | null;
  fechaUltUpd?: string | null;

  /** Paciente (normalizado y expuesto como "cliente" para no romper la UI) */
  idCliente: {
    id: number;
    nombre: string;
    apellido: string;
    telefono?: string | null;
    dni?: string | null;
    genero?: string | null;
    fechaNacimiento?: string | null; // "YYYY-MM-DD"
    observaciones?: string | null;
  } | null;

  /** Profesional (normalizado) */
  idProfesional: {
    id: number;          
    nombre: string;       
    apellido: string;     
    email?: string | null;
    telefono?: string | null;
    dni?: string | null;
    genero?: string | null;
    fechaAlta?: string | null;
    fechaUltUpd?: string | null;
    servicio?: string | null;
  } | null;

    idRecepcionista?: {
    id: number;
    nombre: string;
    apellido: string;
    telefono?: string | null;
    dni?: string | null;
    fechaAlta?: string | null;
    fechaUltUpd?: string | null;
  } | null;



  idServicio?: {
    idServicio: number;
    nombre: string;
    duracionMin?: number;
  } | null;
}

/** Disponibilidad */
export interface DisponibilidadSlot {
  profesionalId: number;
  fecha: string;      // "YYYY-MM-DD"
  horaInicio: string; // "HH:mm"
  horaFin: string;    // "HH:mm"
}

export interface DisponibilidadResponse {
  servicioId: number;
  duracionMin: number;
  slots: DisponibilidadSlot[];
}

export interface CrearTurnoRequest {
  pacienteId: number;         // antes clienteId
  profesionalId: number;
  recepcionistaId: number;    
  inicio: string;             // ISO8601 (ej: "2025-10-04T21:00:00.000Z")
  observacion?: string;
}

/** Cancelar/Reprogramar/Agenda */
export interface CancelarTurnoRequest {
  motivo?: string;
}

export interface ReprogramarTurnoRequest {
  nuevoInicio: string; // ISO8601
}

export type AgendaQuery = {
  profesionalId?: number;
  desde?: string;
  hasta?: string; 
  estado?: string;
};
export interface DisponibilidadQuery {
  servicioId: number;
  profesionalId?: number;
  fecha?: string;  // "YYYY-MM-DD"
  desde?: string;  // ISO8601
  hasta?: string;  // ISO8601
  duracionMin?: number;
}
