import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ObraSocialPorProfesional } from "./ObraSocialPorProfesional.entity";

@Entity()
export class ObraSocial{
    @PrimaryGeneratedColumn("identity")
    id_os:number

    @Column("text")
    nombre:string;

    @Column("text")
    fecha_alta:string;

    @OneToMany(()=>ObraSocialPorProfesional,(obrp)=>obrp.obraSocial)
    obraSocialPorProfesional:ObraSocialPorProfesional[]
}