import { ApiProperty } from "@nestjs/swagger";
import { Usuario } from "src/entities/entities/Usuario.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("gerente", { schema: "public" })
export class Gerente {
  @ApiProperty({example:1})
  @PrimaryGeneratedColumn("identity",{ name: "id_gerente" })
  idGerente: number;
  @ApiProperty({example:"Juan"})
  @Column("character varying", { name: "nombre_gerente", nullable: true })
  nombreGerente: string | null;
  @ApiProperty({example:"Perez"})
  @Column("character varying", { name: "apellido_gerente", nullable: true })
  apellidoGerente: string | null;
  @ApiProperty({example:"string"})
  @Column("character varying", { name: "telefono_gerente", nullable: true })
  telefonoGerente: string | null;
  @ApiProperty({example:"string"})
  @Column("character varying", { name: "dni", nullable: true })
  dni: string | null;
  @ApiProperty({example:"2020-09-23"})
  @Column("character varying", { name: "fecha_alta", nullable: true })
  fechaAlta: string | null;
  @ApiProperty({example:"2025-09-23"})
  @Column("character varying", { name: "fecha_ult_upd", nullable: true })
  fechaUltUpd: string | null;
  
  @ManyToOne(() => Usuario, (usuario) => usuario.gerentes)
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  idUsuario: Usuario;
}
