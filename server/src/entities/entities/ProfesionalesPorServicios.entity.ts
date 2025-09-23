import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profesionales } from "./Profesionales.entity";
import { Servicio } from "./Servicio.entity";

@Entity("profesionales_por_servicios", { schema: "public" })
export class ProfesionalesPorServicios {
  @PrimaryGeneratedColumn("identity")
  id: number;

  @ManyToOne(
    () => Profesionales,
    (profesionales) => profesionales.profesionalesPorServicios
  )
  @JoinColumn([
    { name: "id_profesional", referencedColumnName: "idProfesionales" },
  ])
  idProfesional: Profesionales;

  @ManyToOne(() => Servicio, (servicio) => servicio.profesionalesPorServicios)
  @JoinColumn([{ name: "id_servicio", referencedColumnName: "idServicio" }])
  idServicio: Servicio;
}
