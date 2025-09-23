import { DataSource, Repository } from 'typeorm';
import { Turnos } from 'src/entities/entities/Turnos.entity';
import { Servicio } from 'src/entities/entities/Servicio.entity';
import { Profesionales } from 'src/entities/entities/Profesionales.entity';
import { ProfesionalesPorServicios } from 'src/entities/entities/ProfesionalesPorServicios.entity';
import { DisponibilidadQuery } from './dto/disponibilidad.query';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { ReprogramarTurnoDto } from './dto/reprogramar-turno.dto';
import { CancelarTurnoDto } from './dto/cancelar-turno.dto';
export declare class TurnosService {
    private readonly dataSource;
    private readonly turnoRepo;
    private readonly servRepo;
    private readonly profRepo;
    private readonly ppsRepo;
    constructor(dataSource: DataSource, turnoRepo: Repository<Turnos>, servRepo: Repository<Servicio>, profRepo: Repository<Profesionales>, ppsRepo: Repository<ProfesionalesPorServicios>);
    private getDuracionMin;
    private isoToParts;
    private addMinutesHM;
    private getTurnoOrThrow;
    private getServicioId;
    private getProfesionalId;
    disponibilidad(q: DisponibilidadQuery): Promise<{
        servicioId: number;
        duracionMin: number;
        slots: {
            profesionalId: number;
            fecha: string;
            horaInicio: string;
            horaFin: string;
        }[];
    }>;
    crear(dto: CrearTurnoDto): Promise<Turnos>;
    cancelar(id: number, dto: CancelarTurnoDto): Promise<Turnos>;
    reprogramar(id: number, dto: ReprogramarTurnoDto): Promise<Turnos>;
    agenda(q: {
        profesionalId: number;
        desde: string;
        hasta: string;
        estado?: string;
    }): Promise<Turnos[]>;
    listar(q: {
        clienteId?: number;
        estado?: string;
    }): Promise<Turnos[]>;
    getById(id: number): Promise<Turnos>;
}
