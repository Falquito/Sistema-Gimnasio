import { Repository } from "typeorm";
import { ClientesPorServicios } from "./ClientesPorServicios.entity";
import { ProfesionalesPorServicios } from "./ProfesionalesPorServicios.entity";
import { Turnos } from "./Turnos.entity";
import { CreateServicioDto } from "../../modules/servicios/dto/create-servicio.dto";
import { UpdateServicioDto } from "../../modules/servicios/dto/update-servicio.dto";
export declare class Servicio {
    idServicio: number;
    nombre: string | null;
    clientesPorServicios: ClientesPorServicios[];
    profesionalesPorServicios: ProfesionalesPorServicios[];
    turnos: Turnos[];
}
export declare class ServiciosService {
    private readonly servRepo;
    constructor(servRepo: Repository<Servicio>);
    findAll(): Promise<Servicio[]>;
    findOne(id: number): Promise<Servicio>;
    create(dto: CreateServicioDto): Promise<Servicio>;
    update(id: number, dto: UpdateServicioDto): Promise<Servicio>;
    remove(id: number): Promise<Servicio>;
}
