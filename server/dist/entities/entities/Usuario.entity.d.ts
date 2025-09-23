import { Profesionales } from "./Profesionales.entity";
import { Gerente } from '../../gerentes/entities/gerente.entity';
import { Recepcionista } from "./Recepcionista.entity";
export declare class Usuario {
    idUsuario: number;
    email: string | null;
    rol: string | null;
    contraseA: string | null;
    gerentes: Gerente[];
    profesionales: Profesionales[];
    recepcionistas: Recepcionista[];
}
