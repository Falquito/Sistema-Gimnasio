import { CreateGerenteDto } from './dto/create-gerente.dto';
import { UpdateGerenteDto } from './dto/update-gerente.dto';
import { DataSource, Repository } from 'typeorm';
import { Usuario } from 'src/entities/entities/Usuario.entity';
import { Gerente } from './entities/gerente.entity';
export declare class GerentesService {
    private readonly dataSource;
    private readonly usuarioRepository;
    private readonly gerenteRepository;
    constructor(dataSource: DataSource, usuarioRepository: Repository<Usuario>, gerenteRepository: Repository<Gerente>);
    create(createGerenteDto: CreateGerenteDto): Promise<Gerente>;
    findAll(): Promise<Gerente[]>;
    findOne(id: number): Promise<Gerente | null>;
    update(id: number, updateGerenteDto: UpdateGerenteDto): string;
    remove(id: number): string;
    private hashPassword;
}
