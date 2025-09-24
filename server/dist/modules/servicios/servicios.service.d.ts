import { Repository } from 'typeorm';
import { Servicio } from 'src/entities/entities/Servicio.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
export declare class ServiciosService {
    private readonly servRepo;
    constructor(servRepo: Repository<Servicio>);
    findAll(): Promise<Servicio[]>;
    findOne(id: number): Promise<Servicio>;
    create(dto: CreateServicioDto): Promise<Servicio>;
    update(id: number, dto: UpdateServicioDto): Promise<Servicio>;
    remove(id: number): Promise<Servicio>;
}
