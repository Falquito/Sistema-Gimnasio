import { Column, Entity, Index, OneToMany, Repository} from "typeorm";
import { ClientesPorServicios } from "./ClientesPorServicios.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfesionalesPorServicios } from "./ProfesionalesPorServicios.entity";
import { Turnos } from "./Turnos.entity";
import { CreateServicioDto } from "../../modules/servicios/dto/create-servicio.dto";
import { UpdateServicioDto } from "../../modules/servicios/dto/update-servicio.dto";

@Entity("servicio", { schema: "public" })
export class Servicio {
  @Column("integer", { primary: true, name: "id_servicio" })
  idServicio: number;

  @Column("character varying", { name: "nombre", nullable: true })
  nombre: string | null;

  @OneToMany(
    () => ClientesPorServicios,
    (clientesPorServicios) => clientesPorServicios.idServicio
  )
  clientesPorServicios: ClientesPorServicios[];

  @OneToMany(
    () => ProfesionalesPorServicios,
    (profesionalesPorServicios) => profesionalesPorServicios.idServicio
  )
  profesionalesPorServicios: ProfesionalesPorServicios[];

  @OneToMany(() => Turnos, (turnos) => turnos.idServicio)
  turnos: Turnos[];
}

Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private readonly servRepo: Repository<Servicio>,
  ) {}

  findAll() {
    return this.servRepo.find();
  }

  async findOne(id: number) {
    const servicio = await this.servRepo.findOne({ where: { idServicio: id } });
    if (!servicio) throw new NotFoundException('Servicio no encontrado');
    return servicio;
  }

  create(dto: CreateServicioDto) {
    const servicio = this.servRepo.create(dto);
    return this.servRepo.save(servicio);
  }

  async update(id: number, dto: UpdateServicioDto) {
    const servicio = await this.findOne(id);
    Object.assign(servicio, dto);
    return this.servRepo.save(servicio);
  }

  async remove(id: number) {
    const servicio = await this.findOne(id);
    return this.servRepo.remove(servicio);
  }}
