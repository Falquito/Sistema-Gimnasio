import { Usuario } from "./Usuario.entity";
import { Turnos } from "./Turnos.entity";
export declare class Recepcionista {
    idRecepcionista: number;
    nombreRecepcionista: string | null;
    apellidoRecepcionista: string | null;
    telefonoRecepcionista: string | null;
    dni: string | null;
    fechaAlta: string | null;
    fechaUltUpd: string | null;
    idUsuario: Usuario;
    turnos: Turnos[];
}
