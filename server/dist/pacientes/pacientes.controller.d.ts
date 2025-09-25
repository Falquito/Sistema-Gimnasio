import { PacienteService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
export declare class PacientesController {
    private readonly pacienteService;
    constructor(pacienteService: PacienteService);
    create(createClienteDto: CreatePacienteDto): Promise<import("./entities/paciente.entity").Paciente>;
    findAll(): Promise<import("./entities/paciente.entity").Paciente[]>;
    findOne(id: string): Promise<import("./entities/paciente.entity").Paciente | null>;
    update(id: string, updateClienteDto: UpdatePacienteDto): Promise<import("./entities/paciente.entity").Paciente>;
    remove(id: string): Promise<import("./entities/paciente.entity").Paciente>;
}
