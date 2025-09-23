import { TurnosService } from './turnos.service';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { ReprogramarTurnoDto } from './dto/reprogramar-turno.dto';
import { CancelarTurnoDto } from './dto/cancelar-turno.dto';
import { DisponibilidadQuery } from './dto/disponibilidad.query';
import { AgendaQuery } from './dto/agenda.query';
export declare class TurnosController {
    private readonly turnosService;
    constructor(turnosService: TurnosService);
    getDisponibles(q: DisponibilidadQuery): Promise<{
        servicioId: number;
        duracionMin: number;
        slots: {
            profesionalId: number;
            fecha: string;
            horaInicio: string;
            horaFin: string;
        }[];
    }>;
    crear(dto: CrearTurnoDto): Promise<import("../../entities/entities/Turnos.entity").Turnos>;
    cancelar(id: number, dto: CancelarTurnoDto): Promise<import("../../entities/entities/Turnos.entity").Turnos>;
    reprogramar(id: number, dto: ReprogramarTurnoDto): Promise<import("../../entities/entities/Turnos.entity").Turnos>;
    agenda(q: AgendaQuery): Promise<import("../../entities/entities/Turnos.entity").Turnos[]>;
    findOne(id: number): Promise<import("../../entities/entities/Turnos.entity").Turnos>;
    listar(clienteId?: string, estado?: string): Promise<import("../../entities/entities/Turnos.entity").Turnos[]>;
}
