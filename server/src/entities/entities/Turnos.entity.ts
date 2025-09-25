import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profesionales } from "./Profesionales.entity";
import { Recepcionista } from "./Recepcionista.entity";
import { Paciente } from "../../pacientes/entities/paciente.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("turnos", { schema: "public" })
export class Turnos {
  @ApiProperty()
  @PrimaryGeneratedColumn("identity",{ name: "id_turno" })
  idTurno: number;
  @ApiProperty()
  @Column("character varying", { name: "fecha", nullable: true })
  fecha: string;
  @ApiProperty()
  @Column("character varying", { name: "hora_inicio", nullable: true })
  horaInicio: string;
  
  @ApiProperty({example:1})
  @ManyToOne(()=>Paciente,(paciente)=>paciente.turnos,{eager:true})
    idPaciente: Paciente;
  
  @ApiProperty()
  @Column("character varying", { name: "observacion", nullable: true })
  observacion: string;
  @ApiProperty()
  @Column("character varying", { name: "estado", nullable: true })
  estado: string;
  @ApiProperty()
  @Column("character varying", { name: "fecha_alta", nullable: true })
  fechaAlta: string;
  @ApiProperty()
  @Column("character varying", { name: "fecha_ult_upd", nullable: true })
  fechaUltUpd: string;
  
  @ManyToOne(() => Profesionales, (profesionales) => profesionales.turnos,{eager:true})
  @JoinColumn([
    { name: "id_profesional", referencedColumnName: "idProfesionales" },
  ])
  idProfesional: Profesionales;
  
  @ManyToOne(() => Recepcionista, (recepcionista) => recepcionista.turnos,{eager:true})
  @JoinColumn([
    { name: "id_recepcionista", referencedColumnName: "idRecepcionista" },
  ])
  idRecepcionista: Recepcionista;
 
  
}
