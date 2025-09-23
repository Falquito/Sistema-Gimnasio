import { Column, Entity, Index, OneToMany } from "typeorm";
import { ClientesPorServicios } from "./ClientesPorServicios.entity";
import { ProfesionalesPorServicios } from "./ProfesionalesPorServicios.entity";
import { Turnos } from "./Turnos.entity";

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
