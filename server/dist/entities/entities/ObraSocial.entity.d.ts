import { ObraSocialPorProfesional } from "./ObraSocialPorProfesional.entity";
import { Paciente } from "../../pacientes/entities/paciente.entity";
export declare class ObraSocial {
    id_os: number;
    nombre: string;
    fecha_alta: string;
    obraSocialPorProfesional: ObraSocialPorProfesional[];
    paciente: Paciente[];
}
