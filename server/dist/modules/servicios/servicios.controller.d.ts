import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
export declare class ServiciosController {
    private readonly service;
    constructor(service: ServiciosService);
    findAll(): string;
    findOne(id: number): string;
    create(dto: CreateServicioDto): string;
    update(id: number, dto: UpdateServicioDto): string;
    remove(id: number): string;
}
