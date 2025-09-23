import { Usuario } from "src/entities/entities/Usuario.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("gerente", { schema: "public" })
export class Gerente {
  @PrimaryGeneratedColumn("identity",{ name: "id_gerente" })
  idGerente: number;

  @Column("character varying", { name: "nombre_gerente", nullable: true })
  nombreGerente: string | null;

  @Column("character varying", { name: "apellido_gerente", nullable: true })
  apellidoGerente: string | null;

  @Column("character varying", { name: "telefono_gerente", nullable: true })
  telefonoGerente: string | null;

  @Column("character varying", { name: "dni", nullable: true })
  dni: string | null;

  @Column("character varying", { name: "fecha_alta", nullable: true })
  fechaAlta: string | null;

  @Column("character varying", { name: "fecha_ult_upd", nullable: true })
  fechaUltUpd: string | null;

  @ManyToOne(() => Usuario, (usuario) => usuario.gerentes,{eager:true})
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  idUsuario: Usuario;
}
