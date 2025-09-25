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
// import { ProfesionalesPorServicios } from "./ProfesionalesPorServicios.entity";
import { Turnos } from "./Turnos.entity";

@Entity("profesionales", { schema: "public" })
export class Profesionales {
  @PrimaryGeneratedColumn("identity",{name:"id_profesionales"})
  idProfesionales: number;

  @Column("character varying", { name: "nombre_profesional", nullable: true })
  nombreProfesional: string | null;

  @Column("character varying", { name: "apellido_profesional", nullable: true })
  apellidoProfesional: string | null;

  @Column("character varying", { name: "email", nullable: true })
  email: string | null;

  @Column("character varying", { name: "telefono", nullable: true })
  telefono: string | null;

  @Column("character varying", { name: "dni", nullable: true })
  dni: string | null;

  @Column("character varying", { name: "genero", nullable: true })
  genero: string | null;

  @Column("character varying", { name: "fecha_alta", nullable: true })
  fechaAlta: string | null;

  @Column("character varying", { name: "fecha_ult_upd", nullable: true })
  fechaUltUpd: string | null; 

  @ManyToOne(() => Usuario, (usuario) => usuario.profesionales)
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  idUsuario: Usuario;

  @Column({type:"text",nullable:true}) 
  servicio:string;

  // @OneToMany(
  //   () => ProfesionalesPorServicios,
  //   (profesionalesPorServicios) => profesionalesPorServicios.idProfesional
  // )
  // profesionalesPorServicios: ProfesionalesPorServicios[];

  @OneToMany(() => Turnos, (turnos) => turnos.idProfesional)
  turnos: Turnos[];
}
