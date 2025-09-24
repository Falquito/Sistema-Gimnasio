import { ClientesPorServicios } from "./ClientesPorServicios.entity";
import { ProfesionalesPorServicios } from "./ProfesionalesPorServicios.entity";
import { Turnos } from "./Turnos.entity";
export declare class Servicio {
    idServicio: number;
    nombre: string | null;
    clientesPorServicios: ClientesPorServicios[];
    profesionalesPorServicios: ProfesionalesPorServicios[];
    turnos: Turnos[];
}
