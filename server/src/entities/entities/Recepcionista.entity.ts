import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuario } from "./Usuario.entity";
import { Turnos } from "./Turnos.entity";

@Entity("recepcionista", { schema: "public" })
export class Recepcionista {
  @PrimaryGeneratedColumn("identity",{name:"id_recepcionista"})
  idRecepcionista: number;

  @Column("character varying", { name: "nombre_recepcionista", nullable: true })
  nombreRecepcionista: string | null;

  @Column("character varying", {
    name: "apellido_recepcionista",
    nullable: true,
  })
  apellidoRecepcionista: string | null;

  @Column("character varying", {
    name: "telefono_recepcionista",
    nullable: true,
  })
  telefonoRecepcionista: string | null;

  @Column("character varying", { name: "dni", nullable: true })
  dni: string | null;

  @Column("character varying", { name: "fecha_alta", nullable: true })
  fechaAlta: string | null;

  @Column("character varying", { name: "fecha_ult_upd", nullable: true })
  fechaUltUpd: string | null;

  @ManyToOne(() => Usuario, (usuario) => usuario.recepcionistas)
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  idUsuario: Usuario;

  @OneToMany(() => Turnos, (turnos) => turnos.idRecepcionista)
  turnos: Turnos[];
}
