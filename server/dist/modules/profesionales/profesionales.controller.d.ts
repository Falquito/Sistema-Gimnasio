import { ProfesionalesService } from './profesionales.service';
import { ListProfesionalesQuery } from 'src/modules/profesionales/dto/list-profesionales.query';
export declare class ProfesionalesController {
    private readonly service;
    constructor(service: ProfesionalesService);
    findAll(q: ListProfesionalesQuery): Promise<{
        page: number;
        limit: number;
        total: number;
        items: import("../../entities/entities/Profesionales.entity").Profesionales[];
    }>;
    findOne(id: number): Promise<import("../../entities/entities/Profesionales.entity").Profesionales>;
    findServicios(id: number): Promise<import("../../entities/entities/Servicio.entity").Servicio[]>;
}
