import { ObraSocial } from "src/entities/entities/ObraSocial.entity";
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
    estado: boolean;
    email: string;
    nro_obrasocial: number;
    turnos: Turnos[];
    obraSocial: ObraSocial;
}
