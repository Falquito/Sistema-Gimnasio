import { CreateRecepcionistaDto } from './dto/create-recepcionista.dto';
import { DataSource, Repository } from 'typeorm';
import { Recepcionista } from 'src/entities/entities/Recepcionista.entity';
export declare class RecepcionistaService {
    private readonly dataSource;
    private readonly recepcionistaRepository;
    constructor(dataSource: DataSource, recepcionistaRepository: Repository<Recepcionista>);
    create(createRecepcionistaDto: CreateRecepcionistaDto): Promise<Recepcionista>;
    findAll(): Promise<Recepcionista[]>;
    findOne(id: number): Promise<Recepcionista | null>;
    private hashPassword;
}
