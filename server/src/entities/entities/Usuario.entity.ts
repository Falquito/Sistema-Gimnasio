import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Profesionales } from "./Profesionales.entity";
import { Gerente } from '../../gerentes/entities/gerente.entity';
import { Recepcionista } from "./Recepcionista.entity";
import { ApiProperty } from '@nestjs/swagger';
import { Auditoria } from "./auditorias.entity";


export enum RolUsuario {
  MEDICO = "medico",
  GERENTE = "gerente",
  RECEPCIONISTA = "recepcionista",
}

@Entity("usuario", { schema: "public" })
export class Usuario {
  @ApiProperty()
  @PrimaryGeneratedColumn("identity", { name: "id_usuario" })
  idUsuario: number;

  @Column("character varying", { name: "email", nullable: true })
  email: string | null;

  @Column({
    type: "enum",
    enum: RolUsuario,
    nullable:true
  })
  rol: RolUsuario;

  @Column("character varying", { name: "contraseña", nullable: true })
  contraseA: string | null;

  @OneToMany(() => Gerente, (gerente) => gerente.idUsuario,{eager:true})
  gerentes: Gerente[];

  @OneToMany(() => Profesionales, (profesionales) => profesionales.idUsuario,{eager:true})
  profesionales: Profesionales[];

  @OneToMany(() => Recepcionista, (recepcionista) => recepcionista.idUsuario,{eager:true})
  recepcionistas: Recepcionista[];

  @OneToMany(()=>Auditoria,(auditoria)=>auditoria.usuario)
  auditorias:Auditoria[];

}
