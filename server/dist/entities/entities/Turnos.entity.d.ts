import { Profesionales } from "./Profesionales.entity";
import { Recepcionista } from "./Recepcionista.entity";
import { Servicio } from "./Servicio.entity";
export declare class Turnos {
    idTurno: number;
    fecha: string | null;
    horaInicio: string | null;
    horaFin: string | null;
    idCliente: number;
    rutina: string | null;
    observacion: string | null;
    estado: string | null;
    fechaAlta: string | null;
    fechaUltUpd: string | null;
    idProfesional: Profesionales;
    idRecepcionista: Recepcionista;
    idServicio: Servicio;
}
