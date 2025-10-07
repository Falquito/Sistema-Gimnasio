import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique, ManyToOne } from "typeorm";
import { Turnos } from "./Turnos.entity";
import { Profesionales } from "./Profesionales.entity";
import { Paciente } from "../../pacientes/entities/paciente.entity";

@Entity("anotaciones_clinicas", { schema: "public" })
@Unique(['idTurno'])
@Entity('anotaciones_clinicas', { schema: 'public' })
export class AnotacionClinica {
  @ApiProperty()
  @PrimaryGeneratedColumn("identity", { name: "id_anotacion" })
  idAnotacion: number;

  @ApiProperty({ example: "2025-10-06" })
  @Column("character varying", { name: "fecha" })
  fecha: string;              // YYYY-MM-DD

  @ApiProperty({ example: "14:30", required: false })
  @Column("character varying", { name: "hora", nullable: true })
  hora?: string;              // HH:mm (opcional; si hay turno, se toma de turno.hora_inicio)

  @ApiProperty()
  @Column("text", { name: "texto" })
  texto: string;              // contenido de la observación

  @OneToOne(() => Turnos, { eager: true })
  @JoinColumn([{ name: "id_turno", referencedColumnName: "idTurno" }])
  idTurno: Turnos ;

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
  creadoEn: String;
}
