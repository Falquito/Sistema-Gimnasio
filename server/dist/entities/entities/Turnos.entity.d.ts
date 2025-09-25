import { Profesionales } from "./Profesionales.entity";
import { Recepcionista } from "./Recepcionista.entity";
import { Paciente } from "../../pacientes/entities/paciente.entity";
export declare class Turnos {
    idTurno: number;
    fecha: string;
    horaInicio: string;
    idPaciente: Paciente;
    observacion: string;
    estado: string;
    fechaAlta: string;
    fechaUltUpd: string;
    idProfesional: Profesionales;
    idRecepcionista: Recepcionista;
}
