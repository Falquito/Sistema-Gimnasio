import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Turnos } from "./Turnos.entity";
import { Profesionales } from "./Profesionales.entity";
import { Paciente } from "../../pacientes/entities/paciente.entity";

export enum EstadoDiagnostico {
  ACTIVO = 'ACTIVO',
  CERRADO = 'CERRADO',
}

export enum CertezaDiagnostico {
  EN_ESTUDIO = 'EN_ESTUDIO',
  CONFIRMADO = 'CONFIRMADO',
  DESCARTADO = 'DESCARTADO',
}

@Entity("diagnosticos", { schema: "public" })
@Index(
  // Evita múltiples diagnósticos ACTIVO con el mismo CIE para un mismo paciente
  "uq_diag_activo_cie_paciente",
  ["codigoCIE", "idPaciente"],
  { unique: true, where: "estado = 'ACTIVO'" } 
)
export class Diagnostico {
  @ApiProperty()
  @PrimaryGeneratedColumn("identity", { name: "id_diagnostico" })
  idDiagnostico: number;

  @ApiProperty({ example: "2025-10-06" })
  @Column("character varying", { name: "fecha", nullable:true}) //varchar
  fecha: string;

  @ApiProperty({ enum: EstadoDiagnostico, default: EstadoDiagnostico.ACTIVO })
  @Column("character varying", {
    name: "estado",
    default: EstadoDiagnostico.ACTIVO,
  })
  estado: EstadoDiagnostico;

  @ApiProperty({ enum: CertezaDiagnostico, default: CertezaDiagnostico.EN_ESTUDIO })
  @Column("character varying", {
    name: "certeza",
    default: CertezaDiagnostico.EN_ESTUDIO,
  })
  certeza: CertezaDiagnostico;

  @ApiProperty()
  @Column("text", { name: "codigo_cie" })
  codigoCIE: string;

  @ApiProperty()
  @Column("text", { name: "sintomas_principales" })
  sintomasPrincipales: string;

  @Column("character varying", { name: "fecha_cierre", nullable: true })
  fechaCierre?: string;

  @ApiProperty({ required: false })
  @Column("text", { name: "observaciones", nullable: true })
  observaciones?: string;

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
