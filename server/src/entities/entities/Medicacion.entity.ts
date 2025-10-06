import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Index } from "typeorm";
import { Turnos } from "./Turnos.entity";
import { Profesionales } from "./Profesionales.entity";
import { Paciente } from "../../pacientes/entities/paciente.entity";

export enum EstadoMedicacion {
  ACTIVO = 'ACTIVO',
  SUSPENDIDO = 'SUSPENDIDO',
  COMPLETADO = 'COMPLETADO',
}

@Entity("medicaciones", { schema: "public" })
@Index("ix_meds_paciente_inicio", ["idPaciente", "fechaInicio"])
export class Medicacion {
  @ApiProperty()
  @PrimaryGeneratedColumn("identity", { name: "id_medicacion" })
  idMedicacion: number;

  @ApiProperty()
  @Column("text", { name: "farmaco" })
  farmaco: string;

  @ApiProperty({ required: false })
  @Column("character varying", { name: "dosis", nullable: true })
  dosis?: string;

  @ApiProperty({ required: false })
  @Column("character varying", { name: "frecuencia", nullable: true })
  frecuencia?: string;

  @ApiProperty({ required: false })
  @Column("text", { name: "indicacion", nullable: true })
  indicacion?: string;

  @ApiProperty({ example: "2025-10-06" })
  @Column("character varying", { name: "fecha_inicio" })
  fechaInicio: string; // YYYY-MM-DD

  @ApiProperty({ required: false })
  @Column("character varying", { name: "fecha_fin", nullable: true })
  fechaFin?: string; // YYYY-MM-DD

  @ApiProperty({ required: false })
  @Column("character varying", { name: "ultima_admin", nullable: true })
  ultimaAdmin?: string; // YYYY-MM-DD

  @ApiProperty({ enum: EstadoMedicacion, default: EstadoMedicacion.ACTIVO })
  @Column("character varying", { name: "estado", default: EstadoMedicacion.ACTIVO })
  estado: EstadoMedicacion;

  @ManyToOne(() => Turnos, { eager: true, nullable: true })
  @JoinColumn([{ name: "id_turno", referencedColumnName: "idTurno" }])
  idTurno?: Turnos | null;

  @ManyToOne(() => Paciente, { eager: true })
  @JoinColumn([{ name: "id_paciente", referencedColumnName: "id_paciente" }])
  idPaciente: Paciente;

  @ManyToOne(() => Profesionales, { eager: true })
  @JoinColumn([{ name: "id_profesional", referencedColumnName: "idProfesionales" }])
  idProfesional: Profesionales;

  @ApiProperty()
  @Column("timestamp without time zone", {
    name: "creado_en",
    default: () => "now()",
  })
  creadoEn: Date;
}
