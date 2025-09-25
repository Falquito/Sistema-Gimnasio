import { TurnosService } from './turnos.service';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { CancelarTurnoDto } from './dto/cancelar-turno.dto';
import { DisponibilidadQuery } from './dto/disponibilidad.query';
import { AgendaQuery } from './dto/agenda.query';
import { Turnos } from 'src/entities/entities/Turnos.entity';
export declare class TurnosController {
    private readonly turnosService;
    constructor(turnosService: TurnosService);
    getDisponibles(q: DisponibilidadQuery): Promise<void>;
    crear(dto: CrearTurnoDto): Promise<Turnos>;
    cancelar(id: number, dto: CancelarTurnoDto): Promise<Turnos>;
    agenda(q: AgendaQuery): Promise<Turnos[]>;
    findOne(id: number): Promise<Turnos>;
    listar(pacienteId?: string, estado?: string): Promise<Turnos[]>;
}
