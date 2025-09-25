import { DataSource, Repository } from 'typeorm';
import { Turnos } from 'src/entities/entities/Turnos.entity';
import { Profesionales } from 'src/entities/entities/Profesionales.entity';
import { DisponibilidadQuery } from './dto/disponibilidad.query';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { CancelarTurnoDto } from './dto/cancelar-turno.dto';
export declare class TurnosService {
    private readonly dataSource;
    private readonly turnoRepo;
    private readonly profRepo;
    constructor(dataSource: DataSource, turnoRepo: Repository<Turnos>, profRepo: Repository<Profesionales>);
    private getDuracionMin;
    private onlyDate;
    private normHM;
    private toMin;
    private isoToParts;
    private addMinutesHM;
    private getTurnoOrThrow;
    private getProfesionalId;
    disponibilidad(q: DisponibilidadQuery): Promise<void>;
    crear(dto: CrearTurnoDto): Promise<Turnos>;
    cancelar(id: number, dto: CancelarTurnoDto): Promise<Turnos>;
    completar(id: number): Promise<Turnos>;
    agenda(q: {
        profesionalId?: number;
        desde?: string;
        hasta?: string;
        estado?: string;
    }): Promise<Turnos[]>;
    listar(q: {
        pacienteId?: number;
        estado?: string;
    }): Promise<Turnos[]>;
    getById(id: number): Promise<Turnos>;
}
