import { DataSource, Repository } from 'typeorm';
import { Profesionales } from 'src/entities/entities/Profesionales.entity';
import { Servicio } from 'src/entities/entities/Servicio.entity';
import { ProfesionalesPorServicios } from 'src/entities/entities/ProfesionalesPorServicios.entity';
import { ListProfesionalesQuery } from 'src/modules/profesionales/dto/list-profesionales.query';
import { CreateProfesionaleDto } from './dto/create-profesionale.dto';
export declare class ProfesionalesService {
    private readonly dataSource;
    private readonly profRepo;
    private readonly servRepo;
    private readonly ppsRepo;
    constructor(dataSource: DataSource, profRepo: Repository<Profesionales>, servRepo: Repository<Servicio>, ppsRepo: Repository<ProfesionalesPorServicios>);
    private hashPassword;
    create(createProfesionalDto: CreateProfesionaleDto): Promise<Profesionales>;
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
