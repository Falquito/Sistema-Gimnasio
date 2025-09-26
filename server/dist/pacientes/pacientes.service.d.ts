import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { DataSource, Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { ObraSocial } from 'src/entities/entities/ObraSocial.entity';
export declare class PacienteService {
    private readonly dataSource;
    private readonly pacienteRepository;
    private readonly obraSocialRepository;
    constructor(dataSource: DataSource, pacienteRepository: Repository<Paciente>, obraSocialRepository: Repository<ObraSocial>);
    create(createPacienteDto: CreatePacienteDto): Promise<Paciente>;
    findAll(): Promise<Paciente[]>;
    update(id: number, updatePacienteDto: UpdatePacienteDto): Promise<Paciente>;
    findOne(id: number): Promise<Paciente | null>;
    remove(id: number): Promise<Paciente>;
}
