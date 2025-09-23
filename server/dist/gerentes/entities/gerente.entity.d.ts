import { Usuario } from "src/entities/entities/Usuario.entity";
export declare class Gerente {
    idGerente: number;
    nombreGerente: string | null;
    apellidoGerente: string | null;
    telefonoGerente: string | null;
    dni: string | null;
    fechaAlta: string | null;
    fechaUltUpd: string | null;
    idUsuario: Usuario;
}
