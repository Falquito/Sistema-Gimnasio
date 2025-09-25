import { ProfesionalesService } from './profesionales.service';
import { ListProfesionalesQuery } from 'src/modules/profesionales/dto/list-profesionales.query';
import { CreateProfesionaleDto } from './dto/create-profesionale.dto';
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
    create(createProfesionalDto: CreateProfesionaleDto): Promise<import("../../entities/entities/Profesionales.entity").Profesionales>;
}
