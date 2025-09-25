import { Usuario } from "./Usuario.entity";
import { Turnos } from "./Turnos.entity";
export declare class Profesionales {
    idProfesionales: number;
    nombreProfesional: string | null;
    apellidoProfesional: string | null;
    email: string | null;
    telefono: string | null;
    dni: string | null;
    genero: string | null;
    fechaAlta: string | null;
    fechaUltUpd: string | null;
    idUsuario: Usuario;
    servicio: string;
    turnos: Turnos[];
}
