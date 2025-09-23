import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Profesionales } from "./Profesionales.entity";
import { Gerente } from '../../gerentes/entities/gerente.entity';
import { Recepcionista } from "./Recepcionista.entity";
import { ApiProperty } from '@nestjs/swagger';

@Entity("usuario", { schema: "public" })
export class Usuario {
  @ApiProperty()
  @PrimaryGeneratedColumn("identity", { name: "id_usuario" })
  idUsuario: number;

  @Column("character varying", { name: "email", nullable: true })
  email: string | null;

  @Column("character varying", { name: "rol", nullable: true })
  rol: string | null;

  @Column("character varying", { name: "contraseña", nullable: true })
  contraseA: string | null;

  @OneToMany(() => Gerente, (gerente) => gerente.idUsuario)
  gerentes: Gerente[];

  @OneToMany(() => Profesionales, (profesionales) => profesionales.idUsuario)
  profesionales: Profesionales[];

  @OneToMany(() => Recepcionista, (recepcionista) => recepcionista.idUsuario)
  recepcionistas: Recepcionista[];

}
