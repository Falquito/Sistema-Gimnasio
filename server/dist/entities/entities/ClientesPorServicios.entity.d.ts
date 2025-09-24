import { Servicio } from "./Servicio.entity";
import { Cliente } from '../../clientes/entities/cliente.entity';
export declare class ClientesPorServicios {
    id: number;
    idCliente: Cliente;
    idServicio: Servicio;
}
