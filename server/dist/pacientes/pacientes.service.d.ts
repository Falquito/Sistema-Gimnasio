import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { DataSource, Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
export declare class PacienteService {
    private readonly dataSource;
    private readonly pacienteRepository;
    constructor(dataSource: DataSource, pacienteRepository: Repository<Paciente>);
    create(createPacienteDto: CreatePacienteDto): Promise<Paciente>;
    findAll(): Promise<Paciente[]>;
    update(id: number, updatePacienteDto: UpdatePacienteDto): Promise<Paciente>;
    findOne(id: number): Promise<Paciente | null>;
    remove(id: number): Promise<Paciente>;
}
