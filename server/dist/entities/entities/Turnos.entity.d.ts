import { Profesionales } from "./Profesionales.entity";
import { Recepcionista } from "./Recepcionista.entity";
import { Servicio } from "./Servicio.entity";
export declare class Turnos {
    idTurno: number;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    idCliente: number;
    rutina: string;
    observacion: string;
    estado: string;
    fechaAlta: string;
    fechaUltUpd: string;
    idProfesional: Profesionales;
    idRecepcionista: Recepcionista;
    idServicio: Servicio;
}
