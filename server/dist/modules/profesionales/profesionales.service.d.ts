import { DataSource, Repository } from 'typeorm';
import { Profesionales } from 'src/entities/entities/Profesionales.entity';
import { ListProfesionalesQuery } from 'src/modules/profesionales/dto/list-profesionales.query';
import { CreateProfesionaleDto } from './dto/create-profesionale.dto';
export declare class ProfesionalesService {
    private readonly dataSource;
    private readonly profRepo;
    constructor(dataSource: DataSource, profRepo: Repository<Profesionales>);
    private hashPassword;
    create(createProfesionalDto: CreateProfesionaleDto): Promise<Profesionales>;
    findAll(q: ListProfesionalesQuery): Promise<{
        page: number;
        limit: number;
        total: number;
        items: Profesionales[];
    }>;
    findOne(id: number): Promise<Profesionales>;
    private ensureProfesional;
}
