import { Turnos } from "src/entities/entities/Turnos.entity";
export declare class Paciente {
    id_paciente: number;
    nombre_paciente: string;
    apellido_paciente: string;
    telefono_paciente: string;
    dni: string;
    genero: string;
    fecha_nacimiento: string;
    observaciones: string;
    turnos: Turnos[];
}
