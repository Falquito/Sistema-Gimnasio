import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Profesionales } from 'src/entities/entities/Profesionales.entity';
// import { Servicio } from 'src/entities/entities/Servicio.entity';
// import { ProfesionalesPorServicios } from 'src/entities/entities/ProfesionalesPorServicios.entity';
import { ListProfesionalesQuery } from 'src/modules/profesionales/dto/list-profesionales.query';
import { CreateProfesionaleDto } from './dto/create-profesionale.dto';

import { Usuario } from 'src/entities/entities/Usuario.entity';
import * as bcrypt from "bcrypt"
import { ObraSocialPorProfesional } from 'src/entities/entities/ObraSocialPorProfesional.entity';
import { ObraSocial } from 'src/entities/entities/ObraSocial.entity';
@Injectable()
export class ProfesionalesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource:DataSource,
    @InjectRepository(Profesionales)
    private readonly profRepo: Repository<Profesionales>,

    // @InjectRepository(Servicio)
    // private readonly servRepo: Repository<Servicio>,

    // @InjectRepository(ProfesionalesPorServicios)
    // private readonly ppsRepo: Repository<ProfesionalesPorServicios>,
  ) {}

  private async hashPassword(plainPassword: string): Promise<string> {
      const saltRounds = 10; // costo, más alto = más seguro pero más lento
      const salt = await bcrypt.genSalt(saltRounds);
      const hashed = await bcrypt.hash(plainPassword, salt);
    return hashed
  }
  async create(createProfesionalDto:CreateProfesionaleDto){
        const {ObrasSociales,apellido,dni,nombre,telefono,email,contraseña,servicio} = createProfesionalDto
        const queryRunner = this.dataSource.createQueryRunner()
        const fecha = new Date();
        const contraseñaHasheada = await this.hashPassword(contraseña)
    
        const year = fecha.getFullYear() % 100; // últimos 2 dígitos
        const month = fecha.getMonth() + 1; // los meses van de 0 a 11
        const day = fecha.getDate();
     
        const fechaFormateada = `${year.toString().padStart(2,'0')}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
          
          //Creo el usuario con el gmail y correo del gerente
          const usuario = queryRunner.manager.create(Usuario,{
            
            email,
            contraseA:contraseñaHasheada,
            rol:"medico"
          })
    
          console.log(usuario)
          await queryRunner.manager.save(usuario)
          const profesional = queryRunner.manager.create(Profesionales,{
            idUsuario:usuario,
            nombreProfesional:nombre,
            apellidoProfesional:apellido,
            email:email,
            dni:dni,
            telefono:telefono,
            fechaAlta:fechaFormateada,
            fechaUltUpd:"-",
            servicio:servicio
          })
    
          await queryRunner.manager.save(profesional)
          // const servicioBdd = await queryRunner.manager.findOneBy(Servicio,{nombre:servicio})
          // const ppS = queryRunner.manager.create(ProfesionalesPorServicios,{
          //   idServicio:servicioBdd!,
          //   idProfesional:profesional
          // })
          // await queryRunner.manager.save(ppS)

          
          for(const item of ObrasSociales){
            const obraSocial = await queryRunner.manager.findOneBy(ObraSocial,{
            id_os:item.idObraSocial
          })
          if(!obraSocial){
            throw new NotFoundException(`Obra social con el id ${item.idObraSocial} no encontrada`)
          }
          const obraSocialPorProfesional = queryRunner.manager.create(ObraSocialPorProfesional,{
            profesional:profesional!,
            obraSocial:obraSocial!
          })
          await queryRunner.manager.save(obraSocialPorProfesional)
          }
          await queryRunner.commitTransaction()
          return profesional;
    
        } catch (error) {
          await queryRunner.rollbackTransaction()
          console.log(error)
          throw new InternalServerErrorException("Necesito que revise los logs por favor.")
        }finally{
          await queryRunner.release()
        }
  }

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
    // if (q.servicioId) {
    //   qb.innerJoin(ProfesionalesPorServicios, 'pps', 'pps.profesional_id = p.id')
    //     .andWhere('pps.servicio_id = :sid', { sid: q.servicioId });
    // }

    // (Opcional) incluir relaciones livianas si querés
    // qb.leftJoinAndSelect('p.especialidades', 'esp');

    qb.orderBy('p.apellido_profesional', 'ASC').addOrderBy('p.nombre_profesional', 'ASC');
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
  // async findServiciosByProfesional(id: number) {
  //   // Valida existencia
  //   await this.ensureProfesional(id);

  //   const qb = this.servRepo
  //     .createQueryBuilder('s')
  //     .innerJoin(ProfesionalesPorServicios, 'pps', 'pps.servicio_id = s.id')
  //     .where('pps.profesional_id = :pid', { pid: id })
  //     .orderBy('s.nombre', 'ASC');

  //   return qb.getMany();
  // }

  private async ensureProfesional(id: number) {
    const exists = await this.profRepo.exist({ where: { idProfesionales: id } });
    if (!exists) throw new NotFoundException('Profesional no encontrado');
  }
}
