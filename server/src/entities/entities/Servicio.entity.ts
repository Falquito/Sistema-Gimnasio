import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, Repository} from "typeorm";
import { ClientesPorServicios } from "./ClientesPorServicios.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfesionalesPorServicios } from "./ProfesionalesPorServicios.entity";
import { Turnos } from "./Turnos.entity";
import { CreateServicioDto } from "../../modules/servicios/dto/create-servicio.dto";
import { UpdateServicioDto } from "../../modules/servicios/dto/update-servicio.dto";

@Entity("servicio", { schema: "public" })
export class Servicio {
  @PrimaryGeneratedColumn("identity", { name: "id_servicio" })
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

