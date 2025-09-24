import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
export declare class ServiciosController {
    private readonly service;
    constructor(service: ServiciosService);
    findAll(): Promise<import("../../entities/entities/Servicio.entity").Servicio[]>;
    findOne(id: number): Promise<import("../../entities/entities/Servicio.entity").Servicio>;
    create(dto: CreateServicioDto): Promise<import("../../entities/entities/Servicio.entity").Servicio>;
    update(id: number, dto: UpdateServicioDto): Promise<import("../../entities/entities/Servicio.entity").Servicio>;
    remove(id: number): Promise<import("../../entities/entities/Servicio.entity").Servicio>;
}
