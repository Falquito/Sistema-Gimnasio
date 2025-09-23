import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Profesionales } from "./Profesionales.entity";
import { Recepcionista } from "./Recepcionista.entity";
import { Servicio } from "./Servicio.entity";

@Entity("turnos", { schema: "public" })
export class Turnos {
  @Column("integer", { primary: true, name: "id_turno" })
  idTurno: number;

  @Column("character varying", { name: "fecha", nullable: true })
  fecha: string | null;

  @Column("character varying", { name: "hora_inicio", nullable: true })
  horaInicio: string | null;

  @Column("character varying", { name: "hora_fin", nullable: true })
  horaFin: string | null;

  @Column("integer", { name: "id_cliente", nullable: true })
  idCliente: number | null;

  @Column("character varying", { name: "rutina", nullable: true })
  rutina: string | null;

  @Column("character varying", { name: "observacion", nullable: true })
  observacion: string | null;

  @Column("character varying", { name: "estado", nullable: true })
  estado: string | null;

  @Column("character varying", { name: "fecha_alta", nullable: true })
  fechaAlta: string | null;

  @Column("character varying", { name: "fecha_ult_upd", nullable: true })
  fechaUltUpd: string | null;

  @ManyToOne(() => Profesionales, (profesionales) => profesionales.turnos)
  @JoinColumn([
    { name: "id_profesional", referencedColumnName: "idProfesionales" },
  ])
  idProfesional: Profesionales;

  @ManyToOne(() => Recepcionista, (recepcionista) => recepcionista.turnos)
  @JoinColumn([
    { name: "id_recepcionista", referencedColumnName: "idRecepcionista" },
  ])
  idRecepcionista: Recepcionista;

  @ManyToOne(() => Servicio, (servicio) => servicio.turnos)
  @JoinColumn([{ name: "id_servicio", referencedColumnName: "idServicio" }])
  idServicio: Servicio;
}
