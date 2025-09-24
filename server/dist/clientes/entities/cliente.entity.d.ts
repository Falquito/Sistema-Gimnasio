import { ClientesPorServicios } from "src/entities/entities/ClientesPorServicios.entity";
import { Turnos } from "src/entities/entities/Turnos.entity";
export declare class Cliente {
    id_cliente: number;
    nombre_cliente: string;
    apellido_cliente: string;
    telefono_cliente: string;
    dni: string;
    genero: string;
    fecha_alta: string;
    fecha_ult_upd: string;
    peso: number;
    altura: number;
    fecha_nacimiento: string;
    nivel_fisico: string;
    observaciones: string;
    clientesPorServicios: ClientesPorServicios[];
    turnos: Turnos[];
}
