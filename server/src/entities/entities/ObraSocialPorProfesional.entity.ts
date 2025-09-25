import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ObraSocial } from "./ObraSocial.entity";
import { Profesionales } from "./Profesionales.entity";

@Entity()
export class ObraSocialPorProfesional{
    @PrimaryGeneratedColumn("identity")
    id_opp:number;
    @ManyToOne(()=>ObraSocial,(obraSocial)=>obraSocial.obraSocialPorProfesional)
    obraSocial:ObraSocial
    @ManyToOne(()=>Profesionales,(profesional)=>profesional.obraSocialPorProfesional)
    profesional:Profesionales
}