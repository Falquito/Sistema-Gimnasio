import { Repository } from 'typeorm';
import { Profesionales } from 'src/entities/entities/Profesionales.entity';
import { Servicio } from 'src/entities/entities/Servicio.entity';
import { ProfesionalesPorServicios } from 'src/entities/entities/ProfesionalesPorServicios.entity';
import { ListProfesionalesQuery } from 'src/modules/profesionales/dto/list-profesionales.query';
export declare class ProfesionalesService {
    private readonly profRepo;
    private readonly servRepo;
    private readonly ppsRepo;
    constructor(profRepo: Repository<Profesionales>, servRepo: Repository<Servicio>, ppsRepo: Repository<ProfesionalesPorServicios>);
    findAll(q: ListProfesionalesQuery): Promise<{
        page: number;
        limit: number;
        total: number;
        items: Profesionales[];
    }>;
    findOne(id: number): Promise<Profesionales>;
    findServiciosByProfesional(id: number): Promise<Servicio[]>;
    private ensureProfesional;
}
