import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';

import { Profesionales } from 'src/entities/entities/Profesionales.entity';
import { Servicio } from 'src/entities/entities/Servicio.entity';
import { ProfesionalesPorServicios } from 'src/entities/entities/ProfesionalesPorServicios.entity';
import { ListProfesionalesQuery } from 'src/modules/profesionales/dto/list-profesionales.query';

@Injectable()
export class ProfesionalesService {
  constructor(
    @InjectRepository(Profesionales)
    private readonly profRepo: Repository<Profesionales>,

    @InjectRepository(Servicio)
    private readonly servRepo: Repository<Servicio>,

    @InjectRepository(ProfesionalesPorServicios)
    private readonly ppsRepo: Repository<ProfesionalesPorServicios>,
  ) {}

  /**
   * Listar/filtrar profesionales con paginación.
   * Filtros: servicioId, activo, q
   */
  async findAll(q: ListProfesionalesQuery) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.profRepo.createQueryBuilder('p');

    // Búsqueda por texto (nombre, email, doc, etc. ajusta a tus columnas)
    if (q.q) {
      qb.andWhere(
        '(p.nombre ILIKE :q OR p.apellido ILIKE :q OR p.email ILIKE :q)',
        { q: `%${q.q}%` },
      );
    }

    // Filtro por activo
    if (typeof q.activo !== 'undefined') {
      const activoBool = q.activo === 'true';
      qb.andWhere('p.activo = :activo', { activo: activoBool });
    }

    // Filtro por servicio (vía tabla puente)
    if (q.servicioId) {
      qb.innerJoin(ProfesionalesPorServicios, 'pps', 'pps.profesional_id = p.id')
        .andWhere('pps.servicio_id = :sid', { sid: q.servicioId });
    }

    // (Opcional) incluir relaciones livianas si querés
    // qb.leftJoinAndSelect('p.especialidades', 'esp');

    qb.orderBy('p.apellido', 'ASC').addOrderBy('p.nombre', 'ASC');
    qb.take(limit).skip(skip);

    const [items, total] = await qb.getManyAndCount();

    return {
      page,
      limit,
      total,
      items,
    };
  }

  /** Obtener un profesional por id */
  async findOne(id: number) {
    const profesional = await this.profRepo.findOne({
      where: { idProfesionales: id },
      // relations: ['loQueNecesites'],
    });
    if (!profesional) {
      throw new NotFoundException('Profesional no encontrado');
    }
    return profesional;
  }

  /**
   * Listar servicios que presta un profesional
   */
  async findServiciosByProfesional(id: number) {
    // Valida existencia
    await this.ensureProfesional(id);

    const qb = this.servRepo
      .createQueryBuilder('s')
      .innerJoin(ProfesionalesPorServicios, 'pps', 'pps.servicio_id = s.id')
      .where('pps.profesional_id = :pid', { pid: id })
      .orderBy('s.nombre', 'ASC');

    return qb.getMany();
  }

  private async ensureProfesional(id: number) {
    const exists = await this.profRepo.exist({ where: { idProfesionales: id } });
    if (!exists) throw new NotFoundException('Profesional no encontrado');
  }
}
